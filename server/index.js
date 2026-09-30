import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import path from "node:path";
import fs from "node:fs";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import { ROUTES, renderRouteHTML, SITE_URL } from "./seo-meta.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 4000;

// Render/Heroku/etc. sit behind a reverse proxy — needed for correct client
// IPs in rate limiting and for req.secure to reflect the real protocol.
app.set("trust proxy", 1);
app.disable("x-powered-by");

/* ── Canonical URL hygiene (SEO) ──
 * www -> apex and /about/ -> /about, both 301, so link equity and crawl budget
 * go to exactly one URL per page. */
app.use((req, res, next) => {
  const host = (req.headers.host || "").toLowerCase();
  if (host === "www.adhikarichandra.com.np") {
    return res.redirect(301, `${SITE_URL}${req.originalUrl}`);
  }
  if (req.path.length > 1 && req.path.endsWith("/") && req.method === "GET") {
    const q = req.originalUrl.slice(req.path.length);
    return res.redirect(301, req.path.replace(/\/+$/, "") + q);
  }
  next();
});

/* ── Security headers ──
 * CSP is deliberately without 'unsafe-inline'/'unsafe-eval' for scripts.
 * JSON-LD <script type="application/ld+json"> blocks aren't executable so
 * script-src doesn't apply to them, but the one genuinely executable inline
 * script this site injects (the snapshot-removal snippet, see seo-meta.js)
 * gets a fresh per-request nonce instead of a blanket 'unsafe-inline'. */
app.use((req, res, next) => {
  res.locals.cspNonce = crypto.randomBytes(16).toString("base64");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=(), interest-cohort=()");
  next();
});
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", (req, res) => `'nonce-${res.locals.cspNonce}'`],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:"],
        connectSrc: ["'self'"],
        objectSrc: ["'none'"],
        baseUri: ["'self'"],
        frameAncestors: ["'none'"],
        upgradeInsecureRequests: [],
      },
    },
    crossOriginEmbedderPolicy: false,
    referrerPolicy: { policy: "strict-origin-when-cross-origin" },
  })
);

/* ── CORS: restrict to the real site + local dev, not "*" ── */
const allowedOrigins = [
  SITE_URL,
  "https://www.adhikarichandra.com.np",
  "http://localhost:5173",
  "http://localhost:4000",
];
app.use(
  cors({
    origin(origin, cb) {
      if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
      cb(new Error("Not allowed by CORS"));
    },
  })
);

app.use(express.json({ limit: "100kb" }));

/* ── Rate limiting ──
 * A lenient site-wide limit absorbs scraping/abusive bursts without
 * affecting normal browsing or well-behaved search/AI crawlers, plus a
 * strict limit on the contact form to stop spam submissions. */
app.use(
  rateLimit({
    windowMs: 10 * 60 * 1000,
    limit: 600,
    standardHeaders: true,
    legacyHeaders: false,
  })
);
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { ok: false, message: "Too many messages sent — please try again later." },
});

const dataPath = (f) => path.join(__dirname, "data", f);
const readJSON = (f) => { try { return JSON.parse(fs.readFileSync(dataPath(f), "utf-8")); } catch { return null; } };
const writeJSON = (f, d) => fs.writeFileSync(dataPath(f), JSON.stringify(d, null, 2));

/* ── Hotlink protection for images ──
 * Blocks other sites from embedding these images directly (bandwidth theft /
 * unauthorized reuse) while leaving normal visits, bookmarks, and crawlers
 * that don't send a Referer (most search/AI image crawlers, curl, social
 * link-preview bots) untouched. */
const ownHosts = new Set(["adhikarichandra.com.np", "www.adhikarichandra.com.np", "localhost", "127.0.0.1"]);
let imageRedirects = {};
try { imageRedirects = JSON.parse(fs.readFileSync(path.join(__dirname, "../client/dist/image-redirects.json"), "utf-8")); } catch { /* none */ }
app.use("/images", (req, res, next) => {
  const moved = imageRedirects[req.path.replace(/^\//, "")];
  if (moved) return res.redirect(301, `/images/${moved}`);
  next();
});
app.use("/images", (req, res, next) => {
  const referer = req.headers["referer"] || req.headers["referrer"];
  if (referer) {
    try {
      const host = new URL(referer).hostname;
      if (!ownHosts.has(host)) {
        res.status(403).type("text/plain").send("Hotlinking of this image is not permitted.");
        return;
      }
    } catch {
      /* unparsable referer — let it through rather than risk false positives */
    }
  }
  next();
});

/* ── Visitor counter ── */
app.get("/api/visit", (req, res) => {
  const ip = (req.headers["x-forwarded-for"] || "").split(",")[0].trim() || req.socket.remoteAddress || "unknown";
  const v = readJSON("visitors.json") || { count: 10001, ips: [] };
  if (!v.ips.includes(ip)) {
    v.ips.push(ip);
    if (v.ips.length > 50000) v.ips = v.ips.slice(-50000);
    v.count += 1;
    writeJSON("visitors.json", v);
  }
  res.json({ count: v.count });
});

/* ── Content ── */
app.get("/api/content", (_req, res) => {
  const c = readJSON("content.json");
  if (!c) return res.status(500).json({ error: "unavailable" });
  res.json(c);
});

/* ── Contact (backup storage) ── */
app.post("/api/contact", contactLimiter, (req, res) => {
  const { name, email, message, topic } = req.body ?? {};
  const errs = {};
  if (!name || name.trim().length < 2) errs.name = "Enter your name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((email || "").trim())) errs.email = "Enter a valid email.";
  if (!message || message.trim().length < 10) errs.message = "Write at least 10 characters.";
  if (Object.keys(errs).length) return res.status(400).json({ ok: false, errors: errs });
  const msgs = readJSON("messages.json") || [];
  msgs.push({ id: Date.now().toString(36), name: name.trim(), email: email.trim(), topic, message: message.trim(), at: new Date().toISOString() });
  writeJSON("messages.json", msgs);
  res.status(201).json({ ok: true, message: "Received — Chandra will reply soon." });
});

app.get("/api/health", (_req, res) => res.json({ ok: true }));

/* ── Serve built frontend, with per-route SEO/GEO HTML injection ──
 * For each known route, rewrite the shipped index.html's <title>, meta
 * description/canonical/OG/Twitter tags, add BreadcrumbList JSON-LD, and
 * inject a short crawlable text snapshot of the page's real content. This
 * is what makes the page legible to AI/answer-engine crawlers that fetch
 * raw HTML and never execute the JS bundle — see seo-meta.js for the full
 * rationale. */
const dist = path.join(__dirname, "../client/dist");
const indexHtmlPath = path.join(dist, "index.html");
let indexHtmlTemplate = null;
if (fs.existsSync(indexHtmlPath)) indexHtmlTemplate = fs.readFileSync(indexHtmlPath, "utf-8");

function buildHtmlForRoute(routePath, content, nonce) {
  if (!indexHtmlTemplate) return null;
  const rendered = renderRouteHTML(routePath, content, nonce);
  if (!rendered) return indexHtmlTemplate;
  const { headReplacements: h, bodySnapshot } = rendered;

  let html = indexHtmlTemplate;
  html = html.replace(/<title>.*?<\/title>/s, `<title>${h.title}</title>`);
  html = html.replace(/(<meta name="description" content=")[^"]*(")/, `$1${h.description}$2`);
  html = html.replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${h.canonical}$2`);
  html = html.replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${h.ogTitle}$2`);
  html = html.replace(/(<meta property="og:description" content=")[^"]*(")/, `$1${h.ogDescription}$2`);
  html = html.replace(/(<meta property="og:url" content=")[^"]*(")/, `$1${h.ogUrl}$2`);
  html = html.replace(/(<meta property="og:image" content=")[^"]*(")/, `$1${h.ogImage}$2`);
  html = html.replace(/(<meta name="twitter:title" content=")[^"]*(")/, `$1${h.twitterTitle}$2`);
  html = html.replace(/(<meta name="twitter:description" content=")[^"]*(")/, `$1${h.twitterDescription}$2`);
  html = html.replace(/(<meta name="twitter:image" content=")[^"]*(")/, `$1${h.twitterImage}$2`);
  html = html.replace("</head>", `  ${h.extraJsonLd}\n</head>`);
  html = html.replace('<div id="root"></div>', `<div id="root"></div>\n  ${bodySnapshot}`);
  return html;
}

// Prerendered mode: `npm run build` (client) emits dist/<route>/index.html for
// every route plus dist/404.html — complete per-page HTML for crawlers that
// never run JS. If those files are missing (someone ran a bare `vite build`),
// fall back to the older per-request head/snapshot injection below.
const prerenderedFile = (routePath) => {
  const f = routePath === "/" ? indexHtmlPath : path.join(dist, routePath, "index.html");
  return fs.existsSync(f) ? f : null;
};
const isPrerendered = fs.existsSync(path.join(dist, "about", "index.html"));

if (fs.existsSync(dist)) {
  // Long cache for hashed static assets; HTML itself is handled below and
  // must never be cached long since it's rewritten per route.
  app.use(
    express.static(dist, {
      index: false,
      // Don't let express.static 301 /about -> /about/ (dist/about/ is a
      // directory); the route handler below serves dist/about/index.html.
      redirect: false,
      setHeaders: (res, filePath) => {
        if (/\.[a-f0-9]{8,}\.(js|css)$/i.test(filePath)) {
          res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
        }
      },
    })
  );

  app.get("*", (req, res) => {
    const routePath = req.path === "" ? "/" : req.path;
    const known = Boolean(ROUTES[routePath]);

    if (isPrerendered) {
      res.setHeader("Cache-Control", "no-cache");
      if (known) return res.type("html").send(fs.readFileSync(prerenderedFile(routePath), "utf-8"));
      const nf = path.join(dist, "404.html");
      return res.status(404).type("html").send(fs.readFileSync(fs.existsSync(nf) ? nf : indexHtmlPath, "utf-8"));
    }

    const content = readJSON("content.json");
    let html = buildHtmlForRoute(known ? routePath : "/", content, res.locals.cspNonce) || fs.readFileSync(indexHtmlPath, "utf-8");
    res.setHeader("Cache-Control", "no-cache");
    if (!known) {
      // Unknown path: React Router will render NotFoundPage client-side, but
      // give non-JS crawlers an honest 404 + noindex instead of a 200 OK
      // that looks like a duplicate homepage.
      html = html.replace('<meta name="robots" content="index, follow"/>', '<meta name="robots" content="noindex, nofollow"/>');
      res.status(404);
    }
    res.type("html").send(html);
  });
}

app.listen(PORT, () => console.log(`API on http://localhost:${PORT}`));
