# Chandra Bhakta Adhikari — Portfolio

Multi-page React (Vite) site + Express API. Brand: Playfair Display (headings) + Inter (body),
refined navy/muted-blue/coral-red palette per a professional color audit.

## Name-search & photo visibility update (latest)

Goal: make the site and its photos appear for every spelling of the name (Chandra Adhikari,
Bhakta Adhikari, C.B. Adhikari, ...) and for the "who is / what does ... do" questions people ask
Google, Bing and AI assistants. Done the way search engines reward — identity signals and real
answers — not by stuffing keyword lists (hidden or repeated keyword blocks are penalized).

- **Name variants as identity data**: all 8 spellings are in the Person schema `alternateName`,
  in a visible "Also written as" line on /about and the homepage overview, in `llms.txt`, and in
  natural sentences in titles/descriptions. Stored in `content.json` -> `profile.aliases`.
- **9 new FAQ answers** phrased like real searches ("What does Chandra Adhikari do?", "What is
  Chandra Adhikari's role at NBI and in NYES?", "Is he on LinkedIn/Instagram/Facebook?", "Does he
  have a personal website?", "Are Chandra Adhikari, Bhakta Adhikari and C.B. Adhikari the same
  person?") — 19 total, all answered only from facts already on the site. The last one also
  disambiguates him from other people with the common surname Adhikari.
- **Titles, descriptions and meta keywords rewritten per page** around your keyword groups
  (name, program manager, NBI, NYES, Nepal Business Summit, Rotaract 3292, youth
  entrepreneurship, strategic partnerships). Edit in `client/src/data/seo.json`. Note: Google and
  Bing ignore the keywords meta tag; titles, headings and on-page text are what count.
- **Photos**: 35 gallery images renamed from `g-bungee.jpg`-style to
  `chandra-bhakta-adhikari-<what-it-shows>.jpg` (old URLs 301-redirect — Express, Vercel,
  Netlify); 3 portraits listed in the Person schema so engines can pick a profile photo; 42
  captioned images in `sitemap.xml`; a missing caption that produced alt text "...: undefined"
  fixed. Rename map: `client/scripts/image-renames.json`.
- **Kathmandu Valley**: Bhaktapur is in the Kathmandu Valley, so copy and schema say so
  (`addressRegion`, `containedInPlace`). The site does not claim he is *in* Kathmandu city.
- **Left out on purpose** (not stated anywhere on the site, so not asserted): "Nepal Business Summit /
  NYES 2026", "NextGen Nepal", "entrepreneur" (he develops entrepreneurship programs; the site
  doesn't say he founded a business), "investment ecosystem", "private sector", "business
  development". Add them via `content.json` once you can back them with real facts.

**What will and won't happen:** these steps make the site eligible and easy to understand.
Ranking for a common name ("Chandra Adhikari") depends on off-site signals too: use the exact
name and website link on LinkedIn/Facebook/Instagram bios, get pages from NBI, Rotaract 3292,
Connection Nepal and Asha Project that name and link to him, and submit the sitemap in Search
Console and Bing Webmaster Tools. Google Images/Bing Images take days to weeks to pick up new
filenames — expect gradual change, not overnight.

## SEO / GEO / AEO overhaul (latest revision — read this first)

**The problem this fixes:** the site is a client-rendered SPA, so Google (which runs JS) saw each
page correctly, but Bing, Apple and nearly all AI crawlers (GPTBot, ClaudeBot, PerplexityBot,
CCBot ...) fetch raw HTML and saw the *same* homepage tags and an empty `<div id="root">` on every
URL. That is now fixed at build time, for **every** deploy option (Vercel, Render, Netlify, any
static host) — no longer only the Express one.

### What `npm run build` now produces (`client/scripts/prerender.mjs`)
- **One real HTML file per route** (`dist/about/index.html`, ...) with its own `<title>`, meta
  description, canonical, hreflang, robots directives (`max-image-preview:large, max-snippet:-1`),
  Open Graph + Twitter tags (with image size + alt), and a **crawlable text copy of the page's
  real content** inside `#root` (React replaces it on mount; visitors with JS off see it).
- **schema.org JSON-LD `@graph` per page**: `Person` (full entity: roles, orgs, education,
  languages, awards, `knowsAbout`, `sameAs`, 21 `hasCredential` entries on /experience), `WebSite`,
  page type (`ProfilePage` / `AboutPage` / `CollectionPage` / `ContactPage`), `BreadcrumbList`,
  `FAQPage` (/about — matches the visible FAQ), `ItemList` (experience, journey, leadership) and
  `ImageGallery` with captioned `ImageObject`s (/gallery).
- **`sitemap.xml`** with image entries (all captioned gallery photos), **`robots.txt`** naming
  Googlebot, Bingbot and ~25 AI/answer-engine crawlers (and blocking only `/api/`),
  **`llms.txt`** + **`llms-full.txt`** (LLM-readable summary and the full site text),
  **`404.html`** (real 404 status instead of a soft-404 homepage clone), `site.webmanifest`.
- Single source of truth for titles/descriptions/images: `client/src/data/seo.json` (read by both
  the React `useSEO` hook and the prerender). Edit it in one place.

### New visible content (search + AI answers quote this)
- **"Who is Chandra Bhakta Adhikari?"** overview block on the homepage (a self-contained answer
  paragraph plus descriptive internal links to About, Experience, Leadership, Contact).
- **10-question FAQ** on `/about` (role, Nepal Business Summit, MHM/WASH/DRR training, Rotaract
  3292, Asha Project, education, certifications, awards, speaking availability). Every answer is
  built only from facts already in `content.json` — nothing invented.
- Rewritten titles (≤ ~65 chars) and descriptions (≤ 160 chars) for all 7 pages.
- Both live in `content.json` (`overview`, `faq`) — kept identical in `client/src/data/` and
  `server/data/`.

### Server / hosting changes
- `server/index.js`: serves the prerendered page for each route, a true `404` for unknown URLs,
  301 `www` -> apex and `/about/` -> `/about`. (Falls back to the older injection if `dist/` was
  built without the prerender step.)
- `client/vercel.json`: `cleanUrls`, no catch-all rewrite (unknown URLs now get `404.html`),
  cache headers, same security headers as before. `client/public/_redirects` (Netlify) likewise.
- **`client/dist/` is committed and pre-built** — Render's `buildCommand` only runs `npm install`,
  so after any content/SEO change run `npm run build` (root) and commit `client/dist/`.
- Because pages are now baked at build time, editing `server/data/content.json` alone updates the
  in-app text after hydration but **not** the crawler-facing HTML. Rebuild to update both.

### Do these after deploying (only you can)
1. **Google Search Console** -> add the domain -> submit `https://adhikarichandra.com.np/sitemap.xml`
   -> "Request indexing" on the 7 URLs.
2. **Bing Webmaster Tools** -> add site (or import from Search Console) -> submit the sitemap.
   Then run `npm run indexnow --prefix client` after each deploy (key file already included at
   `client/public/5bd907f035ebd516c63e037265f36cdb.txt`) for fast Bing/Yandex re-crawls.
3. Optional verification tags: set `GOOGLE_SITE_VERIFICATION` / `BING_SITE_VERIFICATION` env vars
   in your build environment; the prerender adds the meta tags automatically.
4. Validate with Google's Rich Results Test and validator.schema.org on `/about` and `/`.
5. Off-site signals matter as much as on-site: make the LinkedIn/Facebook/Instagram bios use the
   exact name "Chandra Bhakta Adhikari" and link to the site; get real press/partner mentions
   (Nepal Business Institute, Rotaract 3292, Connection Nepal, Asha Project pages linking to you).

### Content consistency to review (found while reading `content.json`)
- Reach figures differ across the site: "62 districts" (stats bar), "10+ districts" (summary,
  Connection Nepal), "20+ districts" (MHM case file). The new copy uses the conservative
  "5,000+ trained" and avoids repeating a district count. Pick one and align them.
- Program Manager start date: "Sep 2025" (leadership, journey) vs "Nov 2025" (experience).
- The District Secretary term (Jul 2025 – Jun 2026) has ended; several older lines are still in
  present tense. New copy says "served ... in 2025–26".

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
- **`robots.txt`** and **`sitemap.xml`** are now generated into `dist/` by the prerender step (see top).
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
- **No visible watermark**: an earlier revision overlaid a small
  `adhikarichandra.com.np` badge on every portfolio/gallery photo; removed
  by request. Image protection is now purely behavioral (blocked
  drag/right-click-save, above) rather than visual — the images themselves,
  their `alt` text, and file sizes remain untouched either way. Server-side
  hotlink protection (blocking other sites from embedding these images
  directly) still applies regardless of this and is unaffected.
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

## Certifications (this revision)
The Experience page's "Certifications" strip now lists **all 21 verified
certifications** (previously only 6 of 20+ were shown, per a hardcoded
`featured` list) — grouped by month issued, with a visible gap between
different months and no gap between certs earned in the same month. Every
certificate title is a link that opens its real verification page in a new
tab:
- **Udemy certificates** (credential IDs starting `UC-`, including the two
  MTF Institute–branded courses that were delivered via Udemy) link to
  `https://www.udemy.com/certificate/{credential-id}/` — Udemy's real,
  public verification URL pattern.
- **Oxford Home Study Center** certs link to `oxfordhomestudy.com`.
- **eLearning College** certs link to `elearningcollege.com`.
- **Simplilearn** certs link to `verify.simplilearn.com`, their public
  credential-verification portal (their verification URLs require entering
  the Credential ID manually rather than a direct deep link, so this points
  to the portal itself rather than a fabricated deep link).

Certification data lives in `certifications.items` in `content.json` (both
copies). To add a new certificate, append an object with `title`, `issuer`,
`date` (e.g. `"Mar 2026"`), `monthKey` (e.g. `"2026-03"`, used for grouping/
sorting — keep this in `YYYY-MM` format), `credentialId`, and `url`.

## Leadership page (this revision)
Clicking an organization name in the Leadership History list now swaps the
portrait photo next to it (with a crossfade/scale-in animation) to a photo
relevant to that organization, and highlights the selected row with a
marigold outline — previously the photo was static regardless of which
organization was open. Each group's image lives in `content.json` under
`leadership[].image` / `leadership[].imageAlt`; add those two fields to any
new group you add, or it falls back to the original installation-ceremony
photo.

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
