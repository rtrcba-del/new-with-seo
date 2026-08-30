# Chandra Bhakta Adhikari — Portfolio

Multi-page React (Vite) site + Express API. Brand: Playfair Display (headings) + Inter (body),
refined navy/muted-blue/coral-red palette per a professional color audit.

## Latest revision (this build)
- **Content** rewritten from the updated resume: professional summary, all four experience
  entries (dates, roles, responsibilities), core competencies mapped into the capabilities
  section, stats updated (5+ Years / 5K+ People / 62 Districts / 30+ Schools), and two new
  sections added: **Awards & Recognition** (Experience page) and **References** (About page,
  names/titles only — phone numbers and personal emails of the three referenced individuals
  were deliberately left off the public site; add them yourself if you have their consent).
- **Hero photo replaced** with the new lounge portrait.
- **CV download**: removed from the header and hero (per request, so it doesn't compete with
  the on-site content), and reinstated as a single clear "Download Full CV" action on the About
  page, now linking to the newly supplied resume PDF
  (`client/public/chandra-bhakta-adhikari-resume.pdf`).
- **Full color system refined** per a detailed brand audit: navy (`#0B3048`) is now the
  dominant color across header/footer/hero-overlay/stats/CTA sections; coral red (`#E53935`) is
  reserved for buttons, active nav state, and small accents; a muted blue (`#1261A0`) handles
  informational elements (links, section labels, numbers). The statistics bar and the closing
  CTA section both moved from a red background to navy, and the contact form is now a white
  card with navy text sitting on the dark contact section, per the audit's form spec.

## Structure
- `client/` — React app. Real routes (not hash routes, so Google can index each page on its own
  URL): `/`, `/about`, `/experience`, `/projects`, `/leadership`, `/gallery`, `/contact`.
  Pre-built output is already in `client/dist/` — ready to deploy as-is.
- `server/` — Express API (`/api/content`, `/api/visit`, `/api/contact`) that also serves the
  built client in production.
- `render.yaml` — Render.com config (deploys `server/`, which serves the API and the built client).
- `client/vercel.json` — Vercel config (deploys `client/` as a static Vite site, with an SPA
  fallback rewrite that explicitly excludes `robots.txt`, `sitemap.xml`, `images/`, and `assets/`
  so those are always served as real files, not the app shell).

## Deploy — pick one

### Option A: Vercel (static, simplest)
1. Import this repo in Vercel, set the project root to `client/`.
2. Vercel reads `vercel.json` automatically: builds with `npm run build`, serves `dist/`.
3. Done. The contact form posts directly to Formspree, so no backend is required for the
   client-only deploy — but `/api/visit` (view counter) and content editing via `content.json`
   won't work unless you also deploy `server/` and set `VITE_API_URL` as an env var pointing to it.

### Option B: Render (client + API together)
1. Create a new Web Service in Render, point it at this repo, root directory `server/`.
2. Render reads `render.yaml`: `npm install` then `npm start`.
3. Before deploying, run `npm run build` inside `client/` locally (already done, `client/dist/`
   is committed) — `server/index.js` serves that folder automatically once present at
   `../client/dist`, including direct loads of real routes like `/about` (verified: returns 200,
   not a 404) and static files like `/robots.txt` and `/sitemap.xml`.
4. Push. The one Render service now serves both the API and the site.

### Option C: Any static host (Netlify, GitHub Pages, S3, etc.)
Upload the contents of `client/dist/` as-is, but you'll need to configure that host's own SPA
fallback (serve `index.html` for unmatched paths) — check their docs for the equivalent of
Vercel's `rewrites`. Netlify: add a `_redirects` file with `/* /index.html 200`.

## Local development
```
npm run install:all   # installs client + server deps
npm run dev:server    # API on :4000
npm run dev:client    # Vite dev server on :5173 (proxies /api to :4000)
```

## Editing content
All copy lives in **two places that must be kept in sync**:
- `server/data/content.json` — used by the API, for live edits without rebuild when the server
  is deployed (Option B).
- `client/src/data/content.json` — bundled directly into the client build, so the site works as
  a static-only deploy (Option A/C) with zero backend.

If you only need one, edit `client/src/data/content.json` and rebuild (`npm run build`).

## SEO — what's implemented and what's left

### Done in code
- **Real URLs per page** (`BrowserRouter`, not hash routes) — `/about`, `/projects`, etc. are
  each their own crawlable, shareable URL. Verified server-side: a direct request to `/about`
  returns HTTP 200 with the app, not a 404.
- **Unique title, meta description, and canonical URL per page**, applied via
  `client/src/lib/seo.js` (`useSEO` hook) — verified in-browser for all 7 routes.
- **Exactly one `<h1>` per page**, verified.
- **Person + WebSite JSON-LD structured data** in `index.html` (`sameAs` linked to LinkedIn,
  Facebook, Instagram; `jobTitle`, `knowsAbout`, `alumniOf`, `worksFor` filled in).
- **Open Graph + Twitter Card meta tags**, base versions in `index.html`, updated per-route by
  the SEO hook for browsers that execute JS.
- **`robots.txt`** at `client/public/robots.txt`, pointing to the sitemap.
- **`sitemap.xml`** at `client/public/sitemap.xml`, listing all 7 pages.
- **Custom 404 page**, self-excluded from indexing via `<meta name="robots" content="noindex, nofollow">`.
- **Descriptive image filenames and alt text** for the highest-traffic images (hero, about,
  leadership, and the three project case-file photos), e.g.
  `chandra-bhakta-adhikari-nepal-business-summit.jpg` with alt text like
  "Chandra Bhakta Adhikari: Nepal Business Summit" — all gallery photos also carry descriptive
  alt text built from their captions.
- **Internal linking**: nav links every page to every other page; About links to Experience;
  Home links to Projects and Contact.
- **Stronger hero positioning statement** — "Program Manager · Strategic Partnerships · Youth
  Leadership & Entrepreneurship" now appears directly under the name on the homepage.
- Consistent full name (**Chandra Bhakta Adhikari**) used throughout, matching the entity
  consistency recommendation.

### Important honest limitation
This is a client-rendered SPA (no server-side rendering). Googlebot does execute JavaScript and
will index each page's unique rendered title/description correctly, but **non-JS scrapers**
(some link-preview bots, and crawlers that don't render JS) will only ever see the *default*
Open Graph tags baked into `index.html` — i.e. every page will show the homepage's preview
image/title when shared, not a page-specific one. If per-page social-share previews matter to
you, the next upgrade would be a prerendering step (e.g. `vite-plugin-ssr`, Next.js migration,
or a prerender service) — happy to help with that as a follow-up if it matters to you.

### Still needs you (can't be done from here)
- **Google Search Console**: verify the domain, then submit `https://adhikarichandra.com.np/sitemap.xml`.
- **Bing Webmaster Tools**: same idea, separate console.
- **Professional email** (`hello@` or `chandra@adhikarichandra.com.np`) — a domain/hosting task.
- **Testimonials**: the audit recommends 5 to 8 real quotes with real names/titles/organizations.
  I did not fabricate these — building a `Testimonials` section is quick once you have the real
  quotes; send them over and I'll wire it in.
- **Media / press coverage**: same principle — real links to real coverage only.
- **Blog / articles**: the audit's suggested topics are good long-tail SEO targets, but the
  writing should come from your actual experience. I can help draft/structure posts once you
  pick which ones to start with.

## SEO/GEO/AEO update (this revision)

### Fixed
- **`server/data/content.json` was corrupted** (a missing string value made it
  invalid JSON), which meant `/api/content` was silently returning a 500 in
  production. Re-synced from the client copy and it's now valid — verify this
  file's JSON validity before any manual edit (`python3 -m json.tool
  server/data/content.json` or any online JSON validator).

### The core problem this addresses
This is a client-rendered SPA. Googlebot executes JavaScript and sees each
page's real title/description fine — but most **AI/answer-engine crawlers**
(GPTBot, ClaudeBot, PerplexityBot, CCBot, and most link-preview bots) fetch
raw HTML and never run the JS bundle. Without a fix, every route looked
*identical* to those crawlers: the homepage's title, description and content,
forever. That's the single biggest lever for GEO/LLMO/AEO on a site like
this, and it's now fixed for the Option B (Render/Express) deploy:

- `server/seo-meta.js` holds a per-route registry (title, description,
  breadcrumb, FAQ) and generates: a rewritten `<title>`/meta description/
  canonical/OG/Twitter tags per route, BreadcrumbList JSON-LD on every page,
  FAQPage JSON-LD on `/about`, and a short, honest, crawlable text snapshot
  of the page's real content injected into the HTML response.
- That snapshot is visually hidden (off-screen, `aria-hidden`, same
  accessibility pattern as a "skip to content" link) and removes itself the
  instant React mounts, so sighted users, screen-reader users, and Google
  never see duplicate content — it only exists for the brief pre-hydration
  window and for clients that never run JS at all.
- **This only runs on the Express (Option B) deploy.** If you deploy
  Option A (Vercel, static-only, no `server/`), AI crawlers will still only
  see the homepage's default meta tags on every route — the honest
  limitation from the previous revision still applies there. Recommend
  Option B if AI-search visibility matters to you.
- **Keep `ROUTES` in `server/seo-meta.js` in sync** with the `useSEO(...)`
  calls in `client/src/pages/*.jsx` if you ever change a page's title or
  description — they're intentionally duplicated (one server-side, one
  client-side) rather than sharing a bundler-agnostic module.

### Other SEO/GEO/AEO/Entity additions
- **`robots.txt`** now explicitly names and allows GPTBot, ChatGPT-User,
  OAI-SearchBot, ClaudeBot, anthropic-ai, PerplexityBot, Google-Extended,
  CCBot, Applebot-Extended and others — the crawlers behind AI Overviews,
  ChatGPT, Claude, Perplexity, etc. Standard search bots remain fully
  allowed. (Robots.txt is an honor-system convention, not a security
  control — see the Security section below for the actual anti-scraping
  mechanisms.)
- **`sitemap.xml`** refreshed with current `lastmod` dates and `image:image`
  entries for the hero/about/leadership photos (helps Google Images/Discover
  surface these).
- **FAQPage schema + a matching visible FAQ section** added to `/about`
  (`client/src/sections/FAQ.jsx`). Google requires FAQ structured data to
  match real on-page content, not just live in a `<script>` tag — this now
  does both, and the exact Q&A phrasing here is also what AI answer engines
  are most likely to quote/cite directly.
- **BreadcrumbList JSON-LD** on every route (both server- and client-side).
- Added `geo.region`/`geo.placename`/`geo.position` and an `author` meta tag
  to `index.html` for local/entity SEO.

### Still needs you
Same list as before — Search Console/Bing Webmaster verification, real
testimonials, real press coverage, and blog content from your own
experience — plus, if traffic grows, consider image compression (the
gallery is ~33MB uncompressed; a tool like Squoosh or TinyPNG run over
`client/public/images/` before commit would meaningfully help Core Web
Vitals/LCP without any code changes).

## Security (this revision)

A layered, non-destructive setup: it raises the cost of casual scraping/
copying without ever claiming to make the site "impossible to copy" (nothing
can stop a screenshot) and without breaking normal browsing, SEO, or
accessibility.

### Server-side (`server/index.js`) — Option B (Render) deploy only
- **Security headers** via `helmet`: a strict Content-Security-Policy
  (script-src limited to same-origin + a fresh per-request nonce for the one
  inline script this site ships), HSTS, `X-Frame-Options: SAMEORIGIN`,
  `X-Content-Type-Options: nosniff`, `Referrer-Policy:
  strict-origin-when-cross-origin`, and a restrictive `Permissions-Policy`.
- **Rate limiting**: 600 requests/10 min site-wide (absorbs scraping bursts
  without affecting normal visitors or well-behaved crawlers), 5
  submissions/15 min on `/api/contact` specifically (stops spam).
- **Hotlink protection** on `/images/*`: requests with a foreign `Referer`
  header get a 403; requests with no `Referer` (most search/AI image
  crawlers, direct visits, bookmarks) or a same-site `Referer` pass through
  untouched.
- **CORS locked to real origins** (the production domain + localhost dev)
  instead of the previous wildcard `*`.
- `x-powered-by` disabled; long-lived immutable caching for hashed JS/CSS,
  no-cache for HTML (since HTML is now rewritten per-route, see above).
- **Not covered server-side on Vercel (Option A)**: since that's a static
  deploy with no Express process, `client/vercel.json` now carries the
  equivalent security headers (CSP, HSTS, frame options, etc.) so both
  deploy paths get the same header-level protection. Hotlinking/rate-limit
  protection specifically requires a server or edge function — if you go
  static-only and hotlinking becomes a real problem, a CDN like Cloudflare
  in front of the site (free tier) can add that layer.

### Client-side
- **`client/src/lib/protect.js`**: disables the browser's native
  drag-to-save and right-click "Save image as…" *only on `<img>` elements*
  (shows a small toast: "This content is protected by copyright.
  Unauthorized reproduction or distribution is prohibited."). Deliberately
  does **not** disable text selection or right-click site-wide — that would
  break copying your own email/phone number, password managers, and
  screen-reader/translation tooling for every visitor, for a deterrent a
  determined person bypasses in one click anyway (dev tools, screenshots).
- **Watermark badge** (`adhikarichandra.com.np`) overlaid via JS on every
  original portfolio/gallery photo (hero, about portrait, leadership photo,
  project case-file images, gallery grid + lightbox) — implemented as an
  injected element rather than CSS `::after`, since some of those containers
  already use `::after` for their own design (the About photo's marigold
  border), and an element can only have one. Non-destructive: the actual
  image files, `alt` text, and file sizes are untouched, so this has zero
  SEO cost.
- **Expanded footer copyright notice** with a full rights-reserved statement
  (dynamic year, already existed; the statement itself is new).
- **Production build now strips `console`/`debugger` statements**
  (`client/vite.config.js`, via esbuild's `drop` option) — there weren't any
  in this codebase as of this revision, but this is now enforced going
  forward rather than relying on remembering to remove them.

### Still needs you
- **Original high-resolution assets**: this setup optimizes what's already
  in `client/public/images/` (the only copies that exist). The audit's
  recommendation to keep originals private and serve only optimized copies
  requires deciding where "private" storage lives (a separate cloud bucket,
  local backup, etc.) — that's a workflow decision, not something to bake
  into the repo.
- **A CDN/WAF** (Cloudflare, in particular) sitting in front of the domain
  would add a real layer this setup can't: it can challenge/block scrapers
  *before* they reach the server at all, rather than after, and gives you
  bot-fight-mode and image hotlink rules without touching code. Recommended
  if scraping ever becomes a real (not hypothetical) problem — not
  necessary to add pre-emptively for a personal portfolio site.
- **HTTPS enforcement**: both Render and Vercel terminate TLS and serve
  HTTPS automatically; nothing in this repo needs to change for that, but
  confirm your DNS/domain registrar points at the deploy target correctly
  and that "force HTTPS" is on in whichever platform's dashboard.

## Performance (this revision)

**Found during this audit**: several gallery photos were being served at raw
camera resolution — one was 3720×5580px at 9.3MB, several others 4032×3024px
at ~1MB+ each — for images that only ever display as small grid thumbnails
or a modest lightbox view. That's a direct hit to Core Web Vitals (LCP in
particular) and to anyone on a slow or metered connection.

- **All 45 images in `client/public/images/` were resized (max 1600px on the
  long edge) and recompressed (quality 80, progressive JPEG), and had EXIF
  metadata stripped** (camera model, timestamps, and — if present — GPS
  coordinates, which is also a privacy consideration for a personal site).
  Total image payload: **33MB → 8.1MB** (a 75% reduction), same 45 files,
  visually unchanged at the sizes they're actually displayed at.
- **The untouched full-resolution originals are preserved** at
  `originals-backup/images/` (git-ignored — see `.gitignore`). This is also
  the "keep originals private, serve only optimized copies" recommendation
  from the security brief. That folder is *not* committed or deployed;
  move it to real private storage (a private cloud bucket, an external
  drive) before you lose the working copy — it currently only exists on
  this machine.
- If you ever add new photos to the gallery, resize/recompress them the same
  way before committing (e.g. `mogrify -strip -resize "1600x1600>" -quality
  80 -sampling-factor 4:2:0 -interlace Plane yourphoto.jpg`, or any tool you
  prefer — Squoosh.app is a good GUI option) rather than dropping camera
  originals straight into `client/public/images/`.


`client/public/images/` has 35 verified, correctly-captioned photos wired into the gallery
(filterable by Stage / Leadership / Field / Off Duty / Portrait), plus reserve photos not
currently used, available for swapping in via the `gallery` array in `content.json`.

## Gallery
`client/public/images/` has 35 verified, correctly-captioned photos wired into the gallery
(filterable by Stage / Leadership / Field / Off Duty / Portrait), plus reserve photos not
currently used, available for swapping in via the `gallery` array in `content.json`.
(As of this revision, all images in this folder — used and reserve alike — have been
resized/recompressed for web delivery; see "Performance" above.)

## Design system
Navy/blue/red-bright palette, Playfair Display (headings) + Inter (body). Tokens in
`client/src/styles/tokens.css`. Scroll-reveal animations via `components/Reveal.jsx`
(IntersectionObserver-based), page-fade transition on route change, animated nav underline.
