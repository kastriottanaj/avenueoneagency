# Deploying Avenue One Agency on Hetzner

Migration runbook: Render → a single Hetzner Cloud server running nginx,
gunicorn and PostgreSQL under systemd.

| | Render (before) | Hetzner (after) |
|---|---|---|
| App | Render web service, `render.yaml` | gunicorn under systemd, unix socket |
| Web server | Render's edge | nginx + Let's Encrypt (certbot) |
| Database | Render managed Postgres | PostgreSQL 16 on the same box, loopback only |
| Static files | WhiteNoise | nginx serves `staticfiles/`, WhiteNoise stays as fallback |
| Media uploads | **ephemeral** — lost on every redeploy | persistent disk at `/srv/avenueoneagency/media` |
| Config | Render dashboard env vars | `/etc/avenueoneagency/env` (root:avenue, 0640) |
| Deploy | git push → Render build | `deploy/deploy.sh` over SSH |
| Backups | Render automatic | nightly `pg_dump`, 14 days, `/var/backups/` |

Everything referenced below lives in [deploy/](deploy/).

---

## 0. Before you start

Collect these:

- **Render external database URL** — Render dashboard → your Postgres →
  *Connections* → **External Database URL**. The internal `dpg-…` hostname that
  used to be hardcoded in settings only resolves inside Render's network.
- **Gmail app password** for `avenueoneagency@gmail.com` (the contact form
  sends through Gmail SMTP).
- **Access to DNS** for `avenueoneagency.com`.
- An **SSH public key** (`~/.ssh/id_ed25519.pub`; create with
  `ssh-keygen -t ed25519` if you don't have one).

Two things to know before touching anything:

1. **The old secrets are burned.** The previous `SECRET_KEY`, the Render
   database password and the Gmail app password were committed in
   `settings.py` and are in the public GitHub history. All three are now read
   from the environment. Generate new ones — bootstrap does this for
   `SECRET_KEY` and the database password automatically, but **rotate the Gmail
   app password yourself** in the Google account, and revoke the old one.
   Rotating `SECRET_KEY` logs out existing admin sessions; that's expected.
2. **Media on Render is ephemeral.** `render.yaml` mounts no disk, so images
   uploaded through the admin only exist on the running instance. Step 6
   pulls them off the live site before cutover. On Hetzner they land on real
   disk and stop disappearing.

---

## 1. Create the server

Hetzner Cloud console → **Add Server**:

- **Location** — Nuremberg or Falkenstein (the site's audience is largely
  German-speaking). Pick Ashburn if traffic is mostly US.
- **Image** — Ubuntu 24.04 LTS.
- **Type** — CX22 (2 vCPU / 4 GB / 40 GB) is comfortable for Django +
  Postgres + the Vite build. CX32 if you want headroom.
- **SSH key** — paste your public key. Do this at creation time so password
  login is never enabled.
- **Public IPv4** — yes. IPv6 optional.

Note the IP, then confirm access:

```bash
ssh root@<server-ip>
```

## 2. Push the migration branch to GitHub

Bootstrap clones from GitHub, so the deploy files and the environment-driven
`settings.py` need to be pushed — but **to the `hetzner-deployment` branch, not
`main`**:

```bash
git push -u origin hetzner-deployment
```

Render auto-deploys `main` only. Keeping this work on a branch means Render
never rebuilds, so the live site stays exactly as it is while the new server
is built and tested. `main` gets merged in step 11, after the cutover has
proven itself.

This matters because `settings.py` no longer carries the hardcoded `SECRET_KEY`
and database URL. If you ever *do* redeploy Render from `main` after merging,
set `SECRET_KEY`, `DATABASE_URL`, `EMAIL_HOST_PASSWORD` and
`DJANGO_ALLOWED_HOSTS` in its dashboard first, or it won't boot.

## 3. Bootstrap the server

```bash
ssh root@<server-ip>
curl -fsSL https://raw.githubusercontent.com/kastriottanaj/avenueoneagency/main/deploy/bootstrap.sh -o bootstrap.sh
bash bootstrap.sh
```

This installs Python, Node 22, PostgreSQL, nginx, certbot, ufw and fail2ban;
creates the `avenue` service user and the database; clones the repo to
`/srv/avenueoneagency`; generates `/etc/avenueoneagency/env` with a fresh
`SECRET_KEY` and database password; installs the systemd unit, the nginx
vhost and the nightly backup cron; and enables the firewall (SSH + HTTP/HTTPS
only). It is idempotent — re-run it safely.

## 4. Fill in the remaining secrets

```bash
nano /etc/avenueoneagency/env
```

Set `EMAIL_HOST_PASSWORD` to the **new** Gmail app password. Keep the double
quotes — Google displays app passwords as four space-separated groups, and
both systemd and `source` split unquoted values on whitespace.

Leave `SECURE_HSTS_SECONDS=0` for now (step 10).

## 5. Move the database

Run this **on the Hetzner box** so the dump never round-trips through your
laptop:

```bash
export RENDER_DB='<Render External Database URL>'
export LOCAL_DB="$(grep '^DATABASE_URL=' /etc/avenueoneagency/env | cut -d= -f2-)"

# Sanity check both ends, and compare major versions.
psql "$RENDER_DB" -c 'select version();'
psql "$LOCAL_DB"  -c 'select version();'

pg_dump --no-owner --no-privileges --format=custom \
        --file=/tmp/render.dump "$RENDER_DB"

pg_restore --no-owner --no-privileges --clean --if-exists \
           --dbname="$LOCAL_DB" /tmp/render.dump

psql "$LOCAL_DB" -c '\dt'   # tables should be listed
rm /tmp/render.dump
```

If `pg_dump` refuses with a server version mismatch, Render is on a newer
major than Ubuntu's PostgreSQL 16 client. Install a matching client:

```bash
install -d /usr/share/postgresql-common/pgdg
curl -fsSL https://www.postgresql.org/media/keys/ACCC4CF8.asc \
    -o /usr/share/postgresql-common/pgdg/apt.postgresql.org.asc
echo "deb [signed-by=/usr/share/postgresql-common/pgdg/apt.postgresql.org.asc] https://apt.postgresql.org/pub/repos/apt noble-pgdg main" \
    > /etc/apt/sources.list.d/pgdg.list
apt-get update && apt-get install -y postgresql-client-17
export PATH=/usr/lib/postgresql/17/bin:$PATH
```

A few `pg_restore` errors about roles or extensions that don't exist locally
are normal with `--no-owner --no-privileges`; errors about *tables* are not.

## 6. Move the media files

First push what's in your working copy:

```bash
# from your laptop, in the project directory
rsync -avz ./media/ root@<server-ip>:/srv/avenueoneagency/media/
ssh root@<server-ip> 'chown -R avenue:www-data /srv/avenueoneagency/media && chmod -R 775 /srv/avenueoneagency/media'
```

Then, **while the live site is still on Render**, pull anything the database
references that you don't have locally:

```bash
ssh root@<server-ip>
sudo -u avenue SOURCE=https://avenueoneagency.com \
    /srv/avenueoneagency/deploy/fetch-media.sh
```

It reports anything the database references that Render no longer serves —
those were lost to an earlier redeploy and need re-uploading through the admin.

## 7. First deploy

```bash
sudo -u avenue /srv/avenueoneagency/deploy/deploy.sh
```

Pulls `main`, builds the virtualenv, `npm ci && npm run build`, runs
`collectstatic` and `migrate` (a no-op after step 5), restarts gunicorn and
health-checks the socket.

If it fails: `journalctl -u gunicorn -n 80 --no-pager`.

## 8. Verify before touching DNS

The site only answers to its real hostnames, so send the right `Host` header
rather than browsing the bare IP:

```bash
curl -s  --resolve avenueoneagency.com:80:<server-ip> http://avenueoneagency.com/healthz
curl -I  --resolve avenueoneagency.com:80:<server-ip> http://avenueoneagency.com/
curl -s  --resolve avenueoneagency.com:80:<server-ip> http://avenueoneagency.com/api/ | head
```

`/healthz` returns `ok` when the database is reachable and the frontend bundle
is built; on failure it returns 503 naming which one broke.

To click through it in a browser, add a temporary line to your Mac's
`/etc/hosts` (remove it after the cutover):

```
<server-ip>  avenueoneagency.com www.avenueoneagency.com
```

Check: home page renders, `/blog/` lists posts with images, `/kontakt/`
submits and the email arrives, `/admin/` logs in, `/sitemap.xml` and
`/robots.txt` respond.

## 9. DNS cutover

Record the existing records first, so you can roll back.

1. A few hours ahead, drop the TTL on the `@` and `www` records to 300s.
2. Point both at the Hetzner IP:
   - `A` `@` → `<server-ip>`
   - `A` `www` → `<server-ip>` (replace the Render `CNAME`)
   - `AAAA` records too, if you enabled IPv6.
3. Watch it propagate: `dig +short avenueoneagency.com`.

Leave the Render service running until step 11.

## 10. Certificates

Once DNS resolves to Hetzner:

```bash
certbot --nginx -d avenueoneagency.com -d www.avenueoneagency.com
```

Certbot rewrites the vhost with the 443 block and the http→https redirect, and
installs a renewal timer. Verify: `certbot renew --dry-run`.

Then confirm `https://avenueoneagency.com` and `https://www.avenueoneagency.com`
both serve valid certs — and only then raise HSTS:

```bash
nano /etc/avenueoneagency/env    # SECURE_HSTS_SECONDS=604800
systemctl restart gunicorn
```

After a week without issues, raise it to `31536000`. HSTS is sticky: browsers
honour it for the full duration, so a broken cert under a one-year HSTS makes
the site unreachable. Don't jump straight to a year.

## 11. Decommission Render

After a few days on Hetzner:

1. Merge the migration branch and switch the server onto `main`:
   ```bash
   git checkout main && git merge hetzner-deployment && git push origin main
   ssh root@<server-ip> 'cd /srv/avenueoneagency && sudo -u avenue git checkout main'
   sudo -u avenue /srv/avenueoneagency/deploy/deploy.sh
   ```
   Do this *after* deleting the Render service, or set the Render environment
   variables from step 2 first — otherwise this push triggers a Render rebuild
   that fails to boot.
2. Delete the Render web service and Postgres instance (download a final
   Render backup first if you want one).
3. Remove the now-dead config from the repo:
   ```bash
   git rm render.yaml Procfile && git commit -m "Remove Render deployment config"
   ```
4. Remove the temporary `/etc/hosts` line on your Mac.

---

## Day-to-day

**Deploy a change**

```bash
git push origin main
ssh root@<server-ip> 'sudo -u avenue /srv/avenueoneagency/deploy/deploy.sh'
```

**Logs**

```bash
journalctl -u gunicorn -f                          # app
tail -f /var/log/nginx/avenueoneagency.error.log   # nginx
```

Application errors, unhandled 500s and rejected requests all go to stdout and
land in the journal. Filter to just the bad ones with
`journalctl -u gunicorn -p warning`.

**Uptime monitoring** — point any external monitor at
`https://avenueoneagency.com/healthz`. It returns `ok` (200) or a 503 naming
the broken dependency, so it catches a dead database, which polling the home
page would not.

**Service control**

```bash
systemctl restart gunicorn
systemctl reload nginx
```

**Backups** — nightly at 03:17 UTC to `/var/backups/avenueoneagency/`, 14 days
retained, log at `/var/log/avenueoneagency-backup.log`. Run one on demand with
`sudo -u postgres /usr/local/bin/avenueoneagency-backup`. Restore:

```bash
sudo -u postgres pg_restore --clean --if-exists --no-owner --no-privileges \
    -d avenueoneagency /var/backups/avenueoneagency/<file>.dump
```

Those backups sit on the same disk as the database. Pull them somewhere else
periodically — `rsync` to your machine, or enable Hetzner's snapshot/backup
option on the server.

**Django management commands**

```bash
sudo -u avenue bash -c 'set -a; source /etc/avenueoneagency/env; set +a; \
    /srv/avenueoneagency/venv/bin/python /srv/avenueoneagency/manage.py createsuperuser'
```

## Rollback

Before the DNS change, there is nothing to undo — Render is still live.

After it: point the DNS records back at Render (this is why the TTL goes to
300s first). The Render database keeps whatever it had at cutover; content
added through the Hetzner admin in the meantime won't be there, so re-enter it
or restore the Hetzner dump into Render.

## Local development

Unchanged, except that `DEBUG=True` is now required for the insecure fallbacks:

```bash
export DEBUG=True
export DATABASE_URL=postgresql://postgres@localhost:5432/avenueoneagency
python manage.py runserver
cd frontend && npm run dev
```

With `DEBUG=False` and no `SECRET_KEY`/`DATABASE_URL`, startup fails with an
explicit `ImproperlyConfigured` — that's deliberate, so a misconfigured
production boot is loud instead of silently insecure.
