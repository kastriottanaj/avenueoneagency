#!/usr/bin/env bash
#
# One-time server setup for Avenue One Agency on a fresh Ubuntu 24.04 host.
# Run as root on the Hetzner box:
#
#     ssh root@<server-ip>
#     curl -fsSL https://raw.githubusercontent.com/kastriottanaj/avenueoneagency/main/deploy/bootstrap.sh -o bootstrap.sh
#     bash bootstrap.sh
#
# Safe to re-run: every step checks for its own result first. It does NOT
# import the database or start the site — deploy.sh does that afterwards.

set -euo pipefail

APP_NAME="avenueoneagency"
APP_USER="avenue"
APP_DIR="/srv/${APP_NAME}"
ENV_DIR="/etc/${APP_NAME}"
ENV_FILE="${ENV_DIR}/env"
REPO_URL="${REPO_URL:-https://github.com/kastriottanaj/avenueoneagency.git}"
# Deploy from the migration branch until the cutover is done: Render
# auto-deploys `main`, so leaving main alone keeps the old site untouched.
BRANCH="${BRANCH:-hetzner-deployment}"
NODE_MAJOR="22"

log() { printf '\n\033[1;34m==>\033[0m %s\n' "$*"; }

if [[ "${EUID}" -ne 0 ]]; then
    echo "Run this as root." >&2
    exit 1
fi

log "Updating base system"
export DEBIAN_FRONTEND=noninteractive
apt-get update
apt-get -y upgrade

log "Installing packages"
apt-get install -y --no-install-recommends \
    python3 python3-venv python3-dev \
    build-essential libpq-dev \
    postgresql postgresql-contrib \
    nginx certbot python3-certbot-nginx \
    git curl ca-certificates ufw fail2ban unattended-upgrades acl

if ! command -v node >/dev/null 2>&1; then
    log "Installing Node.js ${NODE_MAJOR}.x (needed to build the Vite frontend)"
    curl -fsSL "https://deb.nodesource.com/setup_${NODE_MAJOR}.x" | bash -
    apt-get install -y nodejs
else
    log "Node.js already present: $(node --version)"
fi

# The Vite/TypeScript build is the most memory-hungry step of a deploy; on a
# 4 GB box a little swap keeps it from being OOM-killed.
if ! swapon --show | grep -q .; then
    log "Creating 2G swap file"
    fallocate -l 2G /swapfile
    chmod 600 /swapfile
    mkswap /swapfile
    swapon /swapfile
    echo '/swapfile none swap sw 0 0' >> /etc/fstab
else
    log "Swap already configured"
fi

if ! id -u "${APP_USER}" >/dev/null 2>&1; then
    log "Creating application user '${APP_USER}'"
    adduser --system --group --shell /bin/bash --home "/home/${APP_USER}" "${APP_USER}"
    mkdir -p "/home/${APP_USER}"
    chown "${APP_USER}:${APP_USER}" "/home/${APP_USER}"
else
    log "User '${APP_USER}' already exists"
fi

# nginx (www-data) reads staticfiles/ and media/ straight off disk.
usermod -aG www-data "${APP_USER}"

log "Preparing ${APP_DIR}"
mkdir -p "${APP_DIR}"
chown "${APP_USER}:www-data" "${APP_DIR}"
chmod 755 "${APP_DIR}"

if [[ ! -d "${APP_DIR}/.git" ]]; then
    log "Cloning ${REPO_URL} (branch ${BRANCH})"
    sudo -u "${APP_USER}" git clone --branch "${BRANCH}" "${REPO_URL}" "${APP_DIR}"
else
    log "Repository already cloned"
fi

sudo -u "${APP_USER}" mkdir -p "${APP_DIR}/media" "${APP_DIR}/staticfiles"
chown -R "${APP_USER}:www-data" "${APP_DIR}/media" "${APP_DIR}/staticfiles"
chmod 775 "${APP_DIR}/media"

log "Configuring PostgreSQL"
systemctl enable --now postgresql

DB_NAME="${APP_NAME}"
DB_USER="${APP_NAME}"
DB_PASSWORD=""

role_exists=$(sudo -u postgres psql -tAc \
    "SELECT 1 FROM pg_roles WHERE rolname = '${DB_USER}'")
if [[ "${role_exists}" != "1" ]]; then
    DB_PASSWORD="$(openssl rand -base64 36 | tr -d '/+=' | cut -c1-32)"
    sudo -u postgres psql -c \
        "CREATE ROLE ${DB_USER} LOGIN PASSWORD '${DB_PASSWORD}';"
    echo "    created role ${DB_USER}"
else
    echo "    role ${DB_USER} already exists (password left untouched)"
fi

db_exists=$(sudo -u postgres psql -tAc \
    "SELECT 1 FROM pg_database WHERE datname = '${DB_NAME}'")
if [[ "${db_exists}" != "1" ]]; then
    sudo -u postgres createdb -O "${DB_USER}" -E UTF8 "${DB_NAME}"
    echo "    created database ${DB_NAME}"
else
    echo "    database ${DB_NAME} already exists"
fi

# Django creates and drops tables in the public schema during migrate.
sudo -u postgres psql -d "${DB_NAME}" -c \
    "GRANT ALL ON SCHEMA public TO ${DB_USER};" >/dev/null

log "Writing ${ENV_FILE}"
mkdir -p "${ENV_DIR}"
if [[ ! -f "${ENV_FILE}" ]]; then
    SECRET="$(python3 -c 'import secrets; print(secrets.token_urlsafe(64))')"
    if [[ -z "${DB_PASSWORD}" ]]; then
        DB_PASSWORD="SET-THIS-TO-THE-EXISTING-DB-PASSWORD"
    fi
    cat > "${ENV_FILE}" <<EOF
DEBUG=False
SECRET_KEY=${SECRET}

DJANGO_ALLOWED_HOSTS=avenueoneagency.com,www.avenueoneagency.com
DJANGO_CSRF_TRUSTED_ORIGINS=https://avenueoneagency.com,https://www.avenueoneagency.com
DJANGO_CORS_ALLOWED_ORIGINS=https://avenueoneagency.com,https://www.avenueoneagency.com

DATABASE_URL=postgresql://${DB_USER}:${DB_PASSWORD}@127.0.0.1:5432/${DB_NAME}

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_HOST_USER=avenueoneagency@gmail.com
# Keep the quotes — Gmail app passwords contain spaces.
EMAIL_HOST_PASSWORD="SET THIS TO THE GMAIL APP PASSWORD"
DEFAULT_FROM_EMAIL=avenueoneagency@gmail.com
CONTACT_RECEIVER_EMAIL=avenueoneagency@gmail.com

# Raise only after HTTPS is verified on both apex and www.
SECURE_HSTS_SECONDS=0
EOF
    echo "    generated a fresh SECRET_KEY and database password"
else
    echo "    ${ENV_FILE} already exists, leaving it alone"
fi
chown root:"${APP_USER}" "${ENV_FILE}"
chmod 640 "${ENV_FILE}"

log "Installing systemd unit"
install -m 644 "${APP_DIR}/deploy/gunicorn.service" /etc/systemd/system/gunicorn.service
systemctl daemon-reload
systemctl enable gunicorn

log "Installing nginx vhost"
install -m 644 "${APP_DIR}/deploy/nginx.conf" "/etc/nginx/sites-available/${APP_NAME}"
ln -sfn "/etc/nginx/sites-available/${APP_NAME}" "/etc/nginx/sites-enabled/${APP_NAME}"
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl enable --now nginx

log "Allowing '${APP_USER}' to restart the app without a password"
cat > /etc/sudoers.d/${APP_USER}-deploy <<EOF
${APP_USER} ALL=(root) NOPASSWD: /usr/bin/systemctl restart gunicorn, /usr/bin/systemctl reload gunicorn, /usr/bin/systemctl status gunicorn
EOF
chmod 440 /etc/sudoers.d/${APP_USER}-deploy
visudo -c -f /etc/sudoers.d/${APP_USER}-deploy

log "Installing nightly database backup"
install -m 755 "${APP_DIR}/deploy/backup-db.sh" /usr/local/bin/${APP_NAME}-backup
mkdir -p /var/backups/${APP_NAME}
chown postgres:postgres /var/backups/${APP_NAME}
cat > /etc/cron.d/${APP_NAME}-backup <<EOF
# Nightly pg_dump at 03:17 UTC, 14 days of retention.
17 3 * * * postgres /usr/local/bin/${APP_NAME}-backup >> /var/log/${APP_NAME}-backup.log 2>&1
EOF
chmod 644 /etc/cron.d/${APP_NAME}-backup

log "Configuring firewall"
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw --force enable

log "Enabling automatic security updates"
dpkg-reconfigure -f noninteractive unattended-upgrades
systemctl enable --now fail2ban

cat <<EOF

Bootstrap complete.

Next:
  1. Edit ${ENV_FILE} and set EMAIL_HOST_PASSWORD (Gmail app password).
  2. Import the database from Render — see DEPLOY.md, step 5.
  3. Run the first deploy:  sudo -u ${APP_USER} ${APP_DIR}/deploy/deploy.sh
  4. Point DNS at this server, then issue certificates:
       certbot --nginx -d avenueoneagency.com -d www.avenueoneagency.com

Database password is in ${ENV_FILE} (DATABASE_URL).
EOF
