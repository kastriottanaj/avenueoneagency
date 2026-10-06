# High-risk remediation — September 2026

Everything in this document was fixed on the branch `fix/high-risk-audit`,
cut from `main`. Nothing is committed.

---

## ⚠️ Three things only a human can do

Code changes cannot undo a published secret or drop a production table.

### 1. Rotate all three credentials — they are in the public git history

Removing them from `settings.py` does **not** remove them from history. Every
clone made since February 2026 still has them.

| Credential | Where | Action |
|---|---|---|
| Postgres password | `DATABASE_URL` fallback | Change the database password |
| Gmail App Password | `EMAIL_HOST_PASSWORD` fallback | Revoke at [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords), issue a new one |
| Django `SECRET_KEY` | `SECRET_KEY` fallback | Generate a new one (see below) |

```bash
python3 -c "import secrets; print(secrets.token_urlsafe(64))"
```

The Gmail password is the urgent one: it is send-as access to the mailbox that
receives every contact-form lead.

After rotating, either make the repository private or rewrite history
(`git filter-repo`). Rotation is what actually closes the exposure; history
rewriting only stops it happening again.

### 2. Drop the orphaned `contact_contactmessage` table

The `contact` app was a duplicate of `core` — two `ContactMessage` models, two
admin sections with the same name, and the API only ever wrote to `core`. The
app is deleted, but its table is still in the database. Confirm it is empty,
then drop it:

```sql
SELECT count(*) FROM contact_contactmessage;   -- expect 0
DROP TABLE contact_contactmessage;
DELETE FROM django_migrations WHERE app = 'contact';
```

### 3. Merge this back into `main`

Production runs `hetzner-deployment`. `main` is what anyone cloning receives.
Both branches need these changes, or the next person picks the old secrets
straight back up.

---

## What changed

### Security
- `settings.py` takes every secret from the environment and refuses to boot in
  production without them. No committed fallbacks remain.
- Security headers switched on: `SECURE_SSL_REDIRECT`, secure + HttpOnly +
  SameSite cookies, `nosniff`, `strict-origin-when-cross-origin`, `X-Frame-Options: DENY`.
- **HSTS is now actually sent.** It was configured but pinned at `0`.
  Defaults to one year. `includeSubDomains` and `preload` stay **off** — they
  are the parts that are hard to reverse. Turn them on once every subdomain is
  confirmed HTTPS-only.
- `/api/contact/` and `/api/newsletter/` are rate-limited (5/hour per IP,
  env-tunable) and carry a honeypot field. They were open and unthrottled.
- `.env.example` documents every variable. `.gitignore` now covers `.venv*/`.

### Search visibility
- **Per-route metadata is rendered server-side** (`core/seo.py`). Every page had
  shipped the same `<title>` with no description, canonical, Open Graph,
  Twitter card, or structured data. Blog posts use their own title/description.
- JSON-LD: `ProfessionalService` + `WebSite` site-wide, `OfferCatalog` of the
  eight services on `/services/`, `BlogPosting` on posts.
- **Unmatched URLs return a real 404.** The catch-all served the SPA with a 200,
  making every mistyped URL a soft-404 duplicate of the home page. An unknown
  blog slug now 404s too, resolved server-side.
- **`www` 301s to the apex domain** (`core/middleware.py`). Both hostnames were
  serving 200 with no canonical.
- Sitemap: real per-page priorities and `changefreq`, `lastmod` on posts, https.
- RSS `item_link` returns a path so Django can make it absolute; it was emitting
  unresolvable relative URLs.

### Performance
- **Hero image: 589 KB → 11 KB on a phone.** Responsive AVIF/WebP/JPEG at 640,
  1024, 1600 and 2048 px, with `srcset`, intrinsic `width`/`height` (no layout
  shift) and `fetchpriority="high"`.
- **GA4 and the Meta Pixel no longer load on the critical path** — 171 KB, more
  than the whole app bundle. They load only after consent.
- Removed the duplicate Google Fonts load. The CSS `@import` fetched Inter a
  second time *and* blocked rendering on a serialised round trip.
- Deleted ~1 MB of unreferenced images and a zero-byte `logo.svg`.

Cold homepage transfer, measured locally: **830 KB → 84 KB** on a phone,
**177 KB** on a retina desktop.

### Mobile & UX
- **The header no longer collapses.** `.site-header` is `display:flex`, which
  made `.container` a shrink-to-fit flex item: it ignored its `max-width` and
  collapsed to 84 px, then centred. The logo overlapped "HOME" on desktop and
  jammed against the hamburger on mobile. One line: `width: 100%`.
- **Scroll resets on route change.** Navigating to `/services/` landed visitors
  795 px down the page, past the headline.
- Hamburger is 44×44 (was 32×24) and reports `aria-expanded`.
- `min-height: 100svh` on the hero, so it no longer fights the mobile address bar.

### Accessibility
- **Two-tone brand pink.** `#e8185c` carries white text at 4.45:1 and reads on
  the dark ground at 4.24:1 — both under WCAG AA. Buttons now use `--pink-cta`
  `#c0134d` (6.10:1 with white); pink text uses `--pink-text` `#ff4778`
  (5.78–6.13:1). The brand hue is unchanged for large display type.
- Skip link, visible focus rings, `prefers-reduced-motion`, favicon,
  `aria-hidden` on decorative emoji, 44 px touch targets.

### Legal
- **Consent gate.** GA4 and the Meta Pixel fired on page load with no banner and
  no opt-out. They now load only on explicit opt-in, with Google Consent Mode v2.
- **Privacy policy rewritten.** The old one was a translated German template
  citing the TMG — a statute superseded in 2024 — in under 200 words, and
  disclosed neither GA nor the Pixel. The replacement covers both trackers,
  US state privacy rights and GDPR/UK rights.
  **A privacy attorney should review it before it is relied on.**

### Codebase
- Deleted the duplicate `contact` app, 767 lines of orphaned Django templates,
  `core/forms.py`, `blog/forms.py`, `blog/views.py`, and the PolePosition
  Automation leftovers (`colors.css`, the German 404, the stale logo alt text).
- **Contact email is sent from our own domain with the visitor as `Reply-To`.**
  It was sent *as* the visitor through Gmail SMTP, which fails SPF/DMARC and
  gets spam-filtered. Failures are now logged instead of swallowed by
  `except Exception: pass`, which returned `{"success": true}` regardless.
- **29 regression tests**, one per finding. There were none.

---

## Verify

```bash
python3 -m venv .venv && .venv/bin/pip install -r requirements.txt
cd frontend && npm install && npm run build && cd ..
DEBUG=True .venv/bin/python manage.py test          # 29 tests
DEBUG=False SECRET_KEY=x DATABASE_URL=sqlite:///t.db \
  .venv/bin/python manage.py check --deploy
```

`check --deploy` reports only `SECURE_HSTS_INCLUDE_SUBDOMAINS` and
`SECURE_HSTS_PRELOAD` — both deliberately off, as described above.

---

## Round 2 — SEO / AEO

### The site is now server-rendered

Routes are prerendered to static HTML at build time (`frontend/entry-server.tsx`
→ `frontend/prerender.mjs`) and the browser hydrates them. Blog posts cannot be
prerendered — they come from the database — so Django renders those per request
as semantic HTML.

This was the biggest remaining gap. Google executes JavaScript; **GPTBot,
ClaudeBot, PerplexityBot, OAI-SearchBot and every social unfurler do not.** The
site sells AI Engine Optimization and was invisible to every AI engine.

Readable content in the HTML response, no JavaScript executed:

| Page | Before | After |
|---|---|---|
| `/` | 0 chars | 2,641 |
| `/services/` | 0 chars | 3,324 |
| `/ueber-uns/` | 0 chars | 1,567 |
| `/branchen/` | 0 chars | 1,477 |
| `/testimonials/` | 0 chars | 1,007 |

Build is now `tsc && vite build && vite build --ssr && node prerender.mjs`.
**`render.yaml` and the Hetzner deploy script need no change** — they already
run `npm run build`.

### Structured data

- `Person` for Linda Kafexholli with `sameAs` to LinkedIn and both Instagram
  accounts, so search and answer engines can resolve and corroborate her as an
  entity. She was previously not a named entity anywhere in the markup.
- `FAQPage` with six questions on `/` and `/services/`, with the matching
  visible Q&A on the services page — Google only honours the markup when the
  content is on the page, and answer engines quote this format directly.
- `BreadcrumbList` on every inner page.
- `OfferCatalog` of the eight services; `BlogPosting` on posts.

### robots.txt

The ten AI crawlers are now named and allowed explicitly, rather than relying
on `User-agent: *`. Several honour only a directive addressed to them by name,
and a future blanket `Disallow` would otherwise cut the site out of AI answers.

### Tests

48 now, up from 30. The new ones assert that every route ships rendered content
rather than an empty root, that the FAQ in `core/seo.py` stays in sync with
`Faq.tsx`, and that a blog post's body reaches the HTML source.

---

## Round 3 — vertical landing pages & Open Graph cards

### Six industry landing pages

`/hotel-marketing-nyc/`, `/restaurant-marketing-nyc/`, `/fashion-marketing-nyc/`,
`/beauty-marketing-nyc/`, `/lifestyle-marketing-nyc/`, `/real-estate-marketing-nyc/`

The site had one `/branchen/` page covering six industries, which competes for
nothing. Competitors rank with a page per vertical.

Content lives in `frontend/src/data/verticals.json`, read by **both**
`VerticalPage.tsx` (rendering) and `core/seo.py` (titles, descriptions,
`Service` + `FAQPage` schema, breadcrumbs, sitemap), so copy and metadata
cannot drift.

**These are not doorway pages.** Six pages sharing a layout is a template; six
sharing copy is a doorway network, which Google demotes. Every page has ~300
words written for that vertical alone — its own diagnosis, approach, and FAQ.
`test_pages_are_not_thin_duplicates` fails the build if any two share a
sentence of body copy, and `test_only_real_testimonials_are_used_as_proof`
fails if anyone attaches a client result that is not one of the two genuine
testimonials. Four of the six carry no proof quote, because there isn't one.

Each page: breadcrumb → Home / Industries / vertical, three-part problem
diagnosis, four-part approach, FAQ, cross-links to the other five, CTA.
Linked from the industries page cards and a new footer column.

### Per-page Open Graph cards

`python manage.py generate_og_images` renders 16 cards (1200x630) into
`core/static/core/css/img/og/` using the same titles the pages use. Every page
previously shared one stock photograph, so every link shared to Instagram,
LinkedIn, WhatsApp or Slack looked identical and said nothing about where it
led. `og:image:width`, `height` and `alt` are declared so unfurlers can lay the
card out before fetching it.

Build fonts live in `assets/fonts/` (OFL, build-time only — not served).
Re-run the command after changing a page title or adding a vertical.

### Tests

65 now, up from 48.

---

## Round 4 — English URLs

| Old (301) | New |
|---|---|
| `/ueber-uns/` | `/about/` |
| `/branchen/` | `/industries/` |
| `/kontakt/` | `/contact/` |
| `/datenschutz/` | `/privacy/` |
| `/impressum/` | `/imprint/` |

The map lives in `LEGACY_REDIRECTS` (`core/seo.py`) and drives the Django
routes, the React fallback routes and the tests from one place.

**The site already redirected in the opposite direction** — `/industries/` and
`/contact/` were 301ing *to* the German slugs. Reversing that without removing
the old rules would have produced infinite redirect loops, so
`test_no_redirect_loops` asserts every legacy URL resolves in exactly one hop.

`query_string=True` on the redirects, so a visitor landing on an old URL from a
paid campaign keeps their UTM parameters and still attributes.

Also fixed in passing: **`/privacy/` returned 404 server-side.** It had a React
route but no Django route, so a direct load or a crawl of it failed. It is now
a real page.

Open Graph cards were regenerated under the new slugs and the five stale ones
deleted. No internal link points at a legacy URL — every navigation hits the
canonical directly rather than spending a redirect hop.

### After deploying

1. Submit the updated sitemap in Google Search Console.
2. Expect a few weeks of ranking turbulence while the 301s are consolidated —
   normal, and the old URLs had little equity to lose.
3. Update the link in the Instagram bio and any ad campaigns pointing at
   `/kontakt/`. They will redirect, but a direct link is one hop faster.

### Tests

74 now, up from 65.

---

## Still open — scope for the rebrand, not a hotfix

- **First Contentful Paint.** The bytes are fixed; the architecture is not. The
  app still renders entirely client-side, so nothing paints until the bundle
  executes. Only server rendering (Next.js/Astro) closes the remaining gap.
- **The blog is empty** while sitting in the nav, footer and sitemap.
- **Page content is hardcoded in `.tsx` files.** Services, industries and
  testimonials cannot be edited without a developer, despite Django models
  existing for exactly that.
- **`/impressum/`** is a German legal requirement with no US equivalent.
