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

## Gallery
`client/public/images/` has 35 verified, correctly-captioned photos wired into the gallery
(filterable by Stage / Leadership / Field / Off Duty / Portrait), plus reserve photos not
currently used, available for swapping in via the `gallery` array in `content.json`.

## Design system
Navy/blue/red-bright palette, Playfair Display (headings) + Inter (body). Tokens in
`client/src/styles/tokens.css`. Scroll-reveal animations via `components/Reveal.jsx`
(IntersectionObserver-based), page-fade transition on route change, animated nav underline.
