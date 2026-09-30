// client/scripts/prerender.mjs
//
// Runs after `vite build` (see package.json "build"). Turns the single-page
// app shell into one real, fully-described HTML file per route, so that every
// crawler (Google, Bing, Apple, and the AI/answer-engine bots that fetch raw
// HTML and never execute JavaScript) gets page-specific:
//
//   - <title>, meta description, canonical, hreflang, robots directives
//   - Open Graph + Twitter Card tags (with image size/alt)
//   - a schema.org JSON-LD @graph (Person, WebSite, WebPage, BreadcrumbList,
//     FAQPage, ItemList, ImageGallery ... as appropriate for the route)
//   - a semantic, text-only copy of the page's real content inside #root
//     (React replaces it the instant the app mounts; no-JS visitors see it)
//
// It also generates: sitemap.xml (with image entries), robots.txt (explicit
// AI-crawler allowances), llms.txt and llms-full.txt (LLM-readable site
// summary + full text), and a 404.html that returns a real 404 on static hosts.
//
// Single source of truth: src/data/content.json + src/data/seo.json.
// Environment (all optional):
//   GOOGLE_SITE_VERIFICATION, BING_SITE_VERIFICATION  -> verification meta tags
//   SITE_LASTMOD (YYYY-MM-DD)                          -> sitemap/schema date

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const dist = path.join(root, "dist");
const pub = path.join(root, "public");

const content = JSON.parse(fs.readFileSync(path.join(root, "src/data/content.json"), "utf8"));
const seo = JSON.parse(fs.readFileSync(path.join(root, "src/data/seo.json"), "utf8"));
const template = fs.readFileSync(path.join(dist, "index.html"), "utf8");

const SITE = seo.siteUrl;
const NAME = seo.siteName;
const LASTMOD = process.env.SITE_LASTMOD || new Date().toISOString().slice(0, 10);
const { profile: P, social } = content;

/* ───────────────────────── helpers ───────────────────────── */
const esc = (s = "") =>
  String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const abs = (p) => (/^https?:/.test(p) ? p : `${SITE}${p}`);
const ld = (obj) =>
  `<script type="application/ld+json">${JSON.stringify(obj).replace(/</g, "\\u003c")}</script>`;
const paras = (t) => (Array.isArray(t) ? t : String(t || "").split(/\n\n+/)).filter(Boolean);
const imgUrl = (file) => abs(file.startsWith("/") ? file : `/images/${file}`);

// Real pixel sizes for image objects (read from JPEG headers; no dependencies).
function jpegSize(file) {
  try {
    const b = fs.readFileSync(path.join(pub, "images", path.basename(file)));
    let i = 2;
    while (i < b.length) {
      if (b[i] !== 0xff) { i++; continue; }
      const m = b[i + 1];
      if (m >= 0xc0 && m <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(m))
        return { height: b.readUInt16BE(i + 5), width: b.readUInt16BE(i + 7) };
      i += 2 + b.readUInt16BE(i + 2);
    }
  } catch { /* fall through */ }
  return null;
}
const imageObject = (file, caption) => {
  const s = jpegSize(file);
  return {
    "@type": "ImageObject",
    url: imgUrl(file),
    contentUrl: imgUrl(file),
    ...(caption ? { caption, name: caption, description: caption } : {}),
    ...(s || {}),
    creator: { "@id": `${SITE}/#person` },
    creditText: NAME,
    copyrightNotice: `© ${NAME}`,
  };
};

/* ───────────────────────── entity graph ───────────────────────── */
const ID = { person: `${SITE}/#person`, site: `${SITE}/#website` };

const orgs = {
  nbi: { "@type": "Organization", name: "Nepal Business Institute", alternateName: ["NBI", "NBI Nepal"], description: "Organizer of the Nepal Business Summit and Nepal Youth Entrepreneurship Summit." },
  asha: { "@type": "Organization", name: "The Asha Project Nepal", description: "Non-profit working on education, sanitation and community development in Nepal." },
  connection: { "@type": "Organization", name: "Connection Nepal", description: "Nepal organization delivering DRR, climate adaptation, MHM and WASH training." },
  rotaract: { "@type": "Organization", name: "Rotaract District 3292", description: "Rotary International's youth service arm for Nepal and Bhutan (150+ clubs)." },
  sukedhara: { "@type": "Organization", name: "Rotaract Club of Sukedhara" },
  seg: { "@type": "Organization", name: "T.U. SEG Student Chapter (Society of Exploration Geophysicists)" },
};

function personNode({ full = false, route } = {}) {
  const node = {
    "@type": "Person",
    "@id": ID.person,
    name: NAME,
    givenName: "Chandra Bhakta",
    familyName: "Adhikari",
    alternateName: seo.aliases,
    disambiguatingDescription: `Nepal-based Program Manager at Nepal Business Institute (NBI), District Secretary of Rotaract District 3292 (2025–26), based in Bhaktapur, Kathmandu Valley. Not to be confused with other people named Adhikari.`,
    url: `${SITE}/`,
    mainEntityOfPage: `${SITE}/about`,
    image: [
      imageObject("chandra-bhakta-adhikari-portrait.jpg", `${NAME}, ${P.title}`),
      imageObject("chandra-bhakta-adhikari-portrait-lounge.jpg", `${NAME} (Chandra Adhikari), Program Manager in Nepal`),
      imageObject("chandra-bhakta-adhikari-keynote-rotaract-conference.jpg", `${NAME} delivering a keynote at a Rotaract conference`),
    ],
    hasOccupation: {
      "@type": "Occupation",
      name: "Program Manager",
      occupationLocation: { "@type": "Country", name: "Nepal" },
      skills: "Program management, strategic partnerships, stakeholder engagement, event and summit management",
    },
    nationality: { "@type": "Country", name: "Nepal" },
    description: P.summary,
    jobTitle: P.title,
    email: P.email,
    worksFor: [orgs.nbi, orgs.asha],
    affiliation: [orgs.connection, orgs.rotaract, orgs.sukedhara],
    memberOf: [orgs.rotaract, orgs.sukedhara, orgs.seg],
    alumniOf: { "@type": "CollegeOrUniversity", name: "Tribhuvan University", url: "https://tu.edu.np/" },
    birthPlace: { "@type": "Place", name: "Phidim, Panchthar, Nepal" },
    homeLocation: {
      "@type": "Place",
      name: "Bhaktapur, Nepal",
      address: { "@type": "PostalAddress", addressLocality: "Bhaktapur", addressRegion: "Kathmandu Valley", addressCountry: "NP" },
      containedInPlace: { "@type": "Place", name: "Kathmandu Valley, Nepal" },
      geo: { "@type": "GeoCoordinates", latitude: 27.671, longitude: 85.4298 },
    },
    address: { "@type": "PostalAddress", addressLocality: "Bhaktapur", addressCountry: "NP" },
    knowsLanguage: P.languages.map((l) => ({ "@type": "Language", name: l })),
    knowsAbout: [
      "Nepal Business Summit", "Nepal Youth Entrepreneurship Summit (NYES)", "Nepal Business Institute (NBI)",
      "Rotaract District 3292", "Partnership Development", "Youth Development", "Community Development",
      "Program Management", "Strategic Partnerships", "Stakeholder Engagement", "Event Management",
      "Sponsorship and Government Liaison", "Youth Leadership", "Entrepreneurship Development",
      "Menstrual Hygiene Management (MHM)", "WASH (Water, Sanitation and Hygiene)",
      "Disaster Risk Reduction", "Climate Change Adaptation", "Donor Reporting",
      "Monitoring and Evaluation", "Rotaract", "Public Speaking", "GIS", "Geology",
    ],
    award: (content.awards || []).map((a) => `${a.title}, ${a.org} (${a.period})`),
    sameAs: [social.linkedin, social.facebook, social.instagram].filter(Boolean),
  };
  if (route === "/experience" || full) {
    node.hasCredential = (content.certifications?.items || []).map((c) => ({
      "@type": "EducationalOccupationalCredential",
      name: c.title,
      credentialCategory: "certificate",
      identifier: c.credentialId,
      url: c.url,
      dateCreated: c.monthKey,
      recognizedBy: { "@type": "Organization", name: c.issuer },
    }));
  }
  if (route === "/contact") {
    node.contactPoint = {
      "@type": "ContactPoint",
      contactType: "speaking, training and partnership inquiries",
      email: P.email,
      availableLanguage: P.languages,
      areaServed: ["NP", "BT"],
    };
  }
  return node;
}

const websiteNode = () => ({
  "@type": "WebSite",
  "@id": ID.site,
  url: `${SITE}/`,
  name: NAME,
  description: seo.routes["/"].description,
  inLanguage: "en",
  publisher: { "@id": ID.person },
  creator: { "@id": ID.person },
});

const breadcrumbFor = (route) => {
  const items = [{ name: "Home", path: "/" }];
  if (route !== "/") items.push({ name: seo.routes[route].name, path: route });
  return {
    "@type": "BreadcrumbList",
    "@id": `${SITE}${route === "/" ? "/" : route}#breadcrumb`,
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: `${SITE}${it.path}`,
    })),
  };
};

function extraNodes(route) {
  const url = `${SITE}${route}`;
  switch (route) {
    case "/about":
      return [
        {
          "@type": "FAQPage",
          "@id": `${url}#faq`,
          mainEntity: content.faq.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        },
      ];
    case "/experience":
      return [
        {
          "@type": "ItemList",
          "@id": `${url}#roles`,
          name: `Work experience of ${NAME}`,
          itemListElement: content.experience.map((e, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: `${e.role}, ${e.org} (${e.period})`,
            description: e.summary,
          })),
        },
      ];
    case "/journey":
      return [
        {
          "@type": "ItemList",
          "@id": `${url}#chapters`,
          name: `Career journey of ${NAME}: ${content.journey.chapters.length} roles`,
          itemListElement: content.journey.chapters.map((c, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: `${c.title}, ${c.role} (${c.period})`,
            description: c.dek,
          })),
        },
      ];
    case "/leadership":
      return [
        {
          "@type": "ItemList",
          "@id": `${url}#groups`,
          name: `Leadership roles of ${NAME}`,
          itemListElement: content.leadership.flatMap((g) => g.roles).map((r, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: `${r.role}, ${r.org} (${r.period})`,
            description: r.detail,
          })),
        },
      ];
    case "/gallery":
      return [
        {
          "@type": "ImageGallery",
          "@id": `${url}#gallery`,
          name: `Photo gallery of ${NAME}`,
          image: content.gallery
            .filter((g) => fs.existsSync(path.join(pub, "images", g.file)))
            .map((g) => imageObject(g.file, g.caption ? `${g.caption} (${NAME})` : undefined)),
        },
      ];
    default:
      return [];
  }
}

function graphFor(route) {
  const r = seo.routes[route];
  const url = `${SITE}${route === "/" ? "/" : route}`;
  const page = {
    "@type": r.type,
    "@id": `${url}#webpage`,
    url,
    name: r.title,
    description: r.description,
    inLanguage: "en",
    isPartOf: { "@id": ID.site },
    about: { "@id": ID.person },
    breadcrumb: { "@id": `${url}#breadcrumb` },
    primaryImageOfPage: imageObject(r.image, r.imageAlt),
    dateModified: LASTMOD,
    potentialAction: { "@type": "ReadAction", target: [url] },
  };
  if (["ProfilePage", "AboutPage", "ContactPage"].includes(r.type)) page.mainEntity = { "@id": ID.person };
  return {
    "@context": "https://schema.org",
    "@graph": [websiteNode(), personNode({ route }), page, breadcrumbFor(route), ...extraNodes(route)],
  };
}

/* ───────────────────────── page bodies (crawlable text) ───────────────────────── */
const navLinks = () =>
  `<nav aria-label="Site pages"><ul>${Object.entries(seo.routes)
    .map(([p, r]) => `<li><a href="${p}">${esc(r.name)}</a></li>`)
    .join("")}</ul></nav>`;

const list = (items) => `<ul>${items.map((i) => `<li>${i}</li>`).join("")}</ul>`;

function bodyFor(route) {
  const h = (t) => `<h1>${esc(t)}</h1>`;
  switch (route) {
    case "/":
      return `${h(NAME)}
<p><strong>${esc(P.positioning.join(" · "))}</strong> — ${esc(P.location)}</p>
<p>${esc(P.tagline)}</p>
<p>${esc(P.summary)}</p>
<h2>${esc(content.overview.heading)}</h2>
<p>${esc(content.overview.body)}</p>
<p>${esc(content.overview.aka)}</p>
<h2>Impact at a glance</h2>
${list(content.stats.map((s) => `<strong>${esc(s.value)} ${esc(s.unit)}</strong> — ${esc(s.label)}`))}
<h2>Core capabilities</h2>
${list(content.capabilities.map((c) => `<strong>${esc(c.word)}</strong> — ${esc(c.note)}`))}
<h2>Journey highlights</h2>
${list(
  ["trainer-connection-nepal", "district-secretary", "program-manager"]
    .map((id) => content.journey.chapters.find((c) => c.id === id))
    .filter(Boolean)
    .map((c) => `<strong>${esc(c.title)}</strong>, ${esc(c.role)} (${esc(c.period)}). ${esc(c.dek)}`)
)}
<p>Explore: <a href="/about">About</a> · <a href="/experience">Experience &amp; certifications</a> · <a href="/journey">Career journey</a> · <a href="/leadership">Rotaract leadership</a> · <a href="/gallery">Gallery</a> · <a href="/contact">Contact</a></p>`;
    case "/about":
      return `${h(`About ${NAME}`)}
${paras(P.bioLong).map((t) => `<p>${esc(t)}</p>`).join("")}
${list([
  `<strong>Location:</strong> ${esc(P.location)}`,
  `<strong>Education:</strong> ${esc(P.education)}`,
  `<strong>Languages:</strong> ${esc(P.languages.join(", "))}`,
  `<strong>Birthplace:</strong> ${esc(P.birthplace)}`,
  `<strong>Also written as:</strong> ${esc(P.aliases.join(", "))}`,
])}
<h2>References available on request</h2>
${list(content.references.map((r) => `${esc(r.name)} — ${esc(r.title)}`))}
<h2>Frequently asked questions</h2>
${content.faq.map((f) => `<h3>${esc(f.q)}</h3><p>${esc(f.a)}</p>`).join("")}
<p><a href="/experience">View experience</a> · <a href="/chandra-bhakta-adhikari-resume.pdf">Full CV (PDF)</a></p>`;
    case "/experience":
      return `${h(`Experience & Certifications — ${NAME}`)}
<h2>Work experience</h2>
${list(content.experience.map((e) => `<strong>${esc(e.role)}</strong>, ${esc(e.org)} (${esc(e.period)}, ${esc(e.type)}). ${esc(e.summary)}`))}
<h2>Awards &amp; recognition</h2>
${list(content.awards.map((a) => `${esc(a.title)} — ${esc(a.org)} (${esc(a.period)})`))}
<h2>Certifications (${content.certifications.count})</h2>
${list(content.certifications.items.map((c) => `<a href="${esc(c.url)}" rel="noopener">${esc(c.title)}</a> — ${esc(c.issuer)}, ${esc(c.date)} (ID ${esc(c.credentialId)})`))}`;
    case "/journey":
      return `${h(`Career Journey — ${content.journey.chapters.length} Roles`)}
${content.journey.chapters
  .map(
    (c) => `<article><h2>${esc(c.title)} — ${esc(c.role)}</h2><p>${esc(c.period)}</p><p>${esc(c.dek)}</p>${paras(c.body)
      .map((t) => `<p>${esc(t)}</p>`)
      .join("")}${list(c.highlights.map(esc))}</article>`
  )
  .join("")}`;
    case "/leadership":
      return `${h(`Leadership — ${NAME}`)}
${content.leadership
  .map(
    (g) => `<h2>${esc(g.group)}</h2><p>${esc(g.groupSubtitle)}</p>${list(
      g.roles.map((r) => `<strong>${esc(r.role)}</strong> (${esc(r.period)}). ${esc(r.detail)}`)
    )}`
  )
  .join("")}`;
    case "/gallery":
      return `${h(`Photo Gallery — ${NAME}`)}
<p>${esc(seo.routes["/gallery"].description)}</p>
${list(content.gallery.filter((g) => g.caption).map((g) => `${esc(g.caption)} <em>(${esc(g.tag)})</em>`))}`;
    case "/contact":
      return `${h(`Contact ${NAME}`)}
<p>Speaking invitations, training requests, program partnerships and strategic collaboration.</p>
${list([
  `Email: <a href="mailto:${esc(P.email)}">${esc(P.email)}</a>`,
  `Location: ${esc(P.location)}`,
  `Status: ${esc(P.availability)}`,
  `LinkedIn: <a href="${esc(social.linkedin)}" rel="me noopener">${esc(social.linkedin)}</a>`,
])}`;
    default:
      return "";
  }
}

/* ───────────────────────── head + page assembly ───────────────────────── */
const STRIP = [
  /<title>[\s\S]*?<\/title>\s*/i,
  /<meta\s+name="description"[^>]*>\s*/i,
  /<meta\s+name="robots"[^>]*>\s*/i,
  /<link\s+rel="canonical"[^>]*>\s*/i,
  /<meta\s+property="og:[^"]*"[^>]*>\s*/gi,
  /<meta\s+name="twitter:[^"]*"[^>]*>\s*/gi,
  /<script\s+type="application\/ld\+json">[\s\S]*?<\/script>\s*/gi,
  /<!--\s*(Open Graph|Twitter Card|Structured data[^>]*)\s*-->\s*/gi,
];

function headBlock(route, { noindex = false } = {}) {
  const r = route === "__404" ? { ...seo.notFound, image: seo.defaultImage, imageAlt: seo.defaultImageAlt, name: "404" } : seo.routes[route];
  const url = route === "__404" ? `${SITE}/` : `${SITE}${route}`;
  const image = imageUrl(r.image);
  const size = jpegSize(r.image) || { width: 1600, height: 1067 };
  const robots = noindex
    ? "noindex, nofollow"
    : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1";
  const ogType = route === "/" || route === "/about" ? "profile" : "website";
  const lines = [
    `<title>${esc(r.title)}</title>`,
    `<meta name="description" content="${esc(r.description)}"/>`,
    !noindex && r.keywords ? `<meta name="keywords" content="${esc(r.keywords)}"/>` : "",
    `<meta name="robots" content="${robots}"/>`,
    !noindex ? `<meta name="googlebot" content="${robots}"/>` : "",
    !noindex ? `<meta name="bingbot" content="${robots}"/>` : "",
    !noindex ? `<link rel="canonical" href="${url}"/>` : "",
    !noindex ? `<link rel="alternate" hreflang="en" href="${url}"/>` : "",
    !noindex ? `<link rel="alternate" hreflang="x-default" href="${url}"/>` : "",
    `<link rel="alternate" type="text/plain" href="${SITE}/llms.txt" title="Plain-text summary for AI assistants"/>`,
    `<link rel="manifest" href="/site.webmanifest"/>`,
    process.env.GOOGLE_SITE_VERIFICATION ? `<meta name="google-site-verification" content="${esc(process.env.GOOGLE_SITE_VERIFICATION)}"/>` : "",
    process.env.BING_SITE_VERIFICATION ? `<meta name="msvalidate.01" content="${esc(process.env.BING_SITE_VERIFICATION)}"/>` : "",
    route === "/" ? `<link rel="preload" as="image" href="${seo.defaultImage}" fetchpriority="high"/>` : "",
    `<meta property="og:type" content="${ogType}"/>`,
    ogType === "profile" ? `<meta property="profile:first_name" content="Chandra Bhakta"/>\n  <meta property="profile:last_name" content="Adhikari"/>` : "",
    `<meta property="og:site_name" content="${esc(NAME)}"/>`,
    `<meta property="og:locale" content="en_US"/>`,
    `<meta property="og:title" content="${esc(r.title)}"/>`,
    `<meta property="og:description" content="${esc(r.description)}"/>`,
    `<meta property="og:url" content="${url}"/>`,
    `<meta property="og:image" content="${image}"/>`,
    `<meta property="og:image:secure_url" content="${image}"/>`,
    `<meta property="og:image:type" content="image/jpeg"/>`,
    `<meta property="og:image:width" content="${size.width}"/>`,
    `<meta property="og:image:height" content="${size.height}"/>`,
    `<meta property="og:image:alt" content="${esc(r.imageAlt)}"/>`,
    `<meta name="twitter:card" content="summary_large_image"/>`,
    `<meta name="twitter:title" content="${esc(r.title)}"/>`,
    `<meta name="twitter:description" content="${esc(r.description)}"/>`,
    `<meta name="twitter:image" content="${image}"/>`,
    `<meta name="twitter:image:alt" content="${esc(r.imageAlt)}"/>`,
    // Visually hidden copy for non-JS clients; React replaces it on mount.
    `<style>#seo-static{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}</style>`,
    `<noscript><style>#seo-static{position:static;width:auto;height:auto;overflow:visible;clip:auto;white-space:normal;max-width:860px;margin:0 auto;padding:2rem 1.25rem;font:16px/1.6 system-ui,sans-serif}</style></noscript>`,
    !noindex && route !== "__404" ? ld(graphFor(route)) : "",
  ];
  return lines.filter(Boolean).join("\n  ");
}
function imageUrl(p) { return abs(p); }

function buildPage(route, { noindex = false } = {}) {
  let html = template;
  for (const re of STRIP) html = html.replace(re, "");
  html = html.replace("</head>", `  ${headBlock(route, { noindex })}\n</head>`);
  const body = route === "__404"
    ? `<h1>Page not found</h1><p>This page doesn't exist or has moved.</p><p><a href="/">Go to the homepage of ${esc(NAME)}</a></p>`
    : `${bodyFor(route)}${navLinks()}`;
  html = html.replace('<div id="root"></div>', `<div id="root"><div id="seo-static">${body}</div></div>`);
  return html;
}

/* ───────────────────────── write pages ───────────────────────── */
for (const route of Object.keys(seo.routes)) {
  const out = route === "/" ? path.join(dist, "index.html") : path.join(dist, route, "index.html");
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, buildPage(route));
}
fs.writeFileSync(path.join(dist, "404.html"), buildPage("__404", { noindex: true }));

/* ───────────────────────── renamed-image redirects ─────────────────────────
 * Images were renamed to descriptive, name-based filenames (helps image search).
 * Old URLs 301 to the new ones: Netlify via _redirects, Express via this JSON
 * (Vercel reads the same map from vercel.json). */
const renames = JSON.parse(fs.readFileSync(path.join(__dirname, "image-renames.json"), "utf8"));
fs.writeFileSync(path.join(dist, "image-redirects.json"), JSON.stringify(renames));
{
  const rf = path.join(dist, "_redirects");
  const lines = Object.entries(renames).map(([o, n]) => `/images/${o} /images/${n} 301`).join("\n");
  fs.writeFileSync(rf, `${lines}\n/*  /404.html  404\n`);
}

/* ───────────────────────── sitemap.xml ───────────────────────── */
const sitemap = (() => {
  const urls = Object.entries(seo.routes).map(([route, r]) => {
    const imgs = [{ file: r.image, title: r.imageAlt }];
    if (route === "/gallery")
      for (const g of content.gallery)
        if (g.caption && fs.existsSync(path.join(pub, "images", g.file)))
          imgs.push({ file: g.file, title: `${g.caption} (${NAME})` });
    return `  <url>
    <loc>${SITE}${route === "/" ? "/" : route}</loc>
    <lastmod>${LASTMOD}</lastmod>
    <changefreq>${route === "/contact" ? "yearly" : "monthly"}</changefreq>
    <priority>${r.priority}</priority>
${imgs
  .map((i) => `    <image:image>
      <image:loc>${esc(imgUrl(i.file))}</image:loc>
      <image:title>${esc(i.title)}</image:title>
    </image:image>`)
  .join("\n")}
  </url>`;
  });
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls.join("\n")}
</urlset>
`;
})();
fs.writeFileSync(path.join(dist, "sitemap.xml"), sitemap);

/* ───────────────────────── robots.txt ───────────────────────── */
const AI_AND_SEARCH_BOTS = [
  "Googlebot", "Googlebot-Image", "Bingbot", "Applebot", "DuckDuckBot", "YandexBot",
  // AI search / assistant crawlers (retrieval + citation)
  "GPTBot", "ChatGPT-User", "OAI-SearchBot",
  "ClaudeBot", "Claude-User", "Claude-SearchBot", "Claude-Web", "anthropic-ai",
  "PerplexityBot", "Perplexity-User",
  "Google-Extended", "GoogleOther", "Applebot-Extended",
  "Amazonbot", "DuckAssistBot", "MistralAI-User", "cohere-ai", "YouBot",
  "Meta-ExternalAgent", "Meta-ExternalFetcher", "CCBot",
];
const robots = `# ${SITE.replace("https://", "")}
# Everything public is open to search engines and AI answer engines so this site
# can be indexed, retrieved and cited. Only the backend API is excluded.

User-agent: *
Allow: /
Disallow: /api/

# Named search and AI crawlers (explicit, so a future blanket rule can't shadow them)
${AI_AND_SEARCH_BOTS.map((b) => `User-agent: ${b}`).join("\n")}
Allow: /
Disallow: /api/

# Note: robots.txt is an honor-system convention, not a security control.
# Abuse protection (rate limiting, hotlink protection) lives in server/index.js.

Sitemap: ${SITE}/sitemap.xml
`;
fs.writeFileSync(path.join(dist, "robots.txt"), robots);

/* ───────────────────────── llms.txt / llms-full.txt ───────────────────────── */
const llms = `# ${NAME}

> ${P.title} based in ${P.location}. ${P.summary}

${content.overview.body}

## Key pages
${Object.entries(seo.routes)
  .map(([p, r]) => `- [${r.name}](${SITE}${p === "/" ? "/" : p}): ${r.description}`)
  .join("\n")}

## Quick facts
- Full name: ${NAME}
- Also written as: ${P.aliases.join(", ")}
- Identification: Nepal Business Institute (NBI) Program Manager; Rotaract District 3292 District Secretary 2025–26; based in Bhaktapur, Kathmandu Valley. Adhikari is a common surname in Nepal.
- Current role: Program Manager, Nepal Business Institute
- Also: Project Coordinator, The Asha Project Nepal; Trainer (Consultant), Connection Nepal
- Rotaract: District Secretary 2025–26, Rotaract District 3292 (Nepal & Bhutan, 150+ clubs)
- Education: ${P.education}
- Location: ${P.location} (${P.region}), Nepal
- Languages: ${P.languages.join(", ")}
- Training reach: 5,000+ youth, educators and community members (MHM, WASH, DRR, climate adaptation)
- Contact: ${P.email}
- Profiles: ${[social.linkedin, social.facebook, social.instagram].filter(Boolean).join(", ")}

## Optional
- [Full text of this site for AI assistants](${SITE}/llms-full.txt)
- [CV (PDF)](${SITE}/chandra-bhakta-adhikari-resume.pdf)
- [Sitemap](${SITE}/sitemap.xml)
`;
fs.writeFileSync(path.join(dist, "llms.txt"), llms);

const md = (t) => paras(t).join("\n\n");
const llmsFull = `# ${NAME} — full site content

Source: ${SITE}/ (last updated ${LASTMOD}). Plain-text version of every page, for AI assistants and answer engines.

## Profile
${P.title}. ${P.location}. ${P.tagline}

${md(P.bioLong)}

- Education: ${P.education}
- Languages: ${P.languages.join(", ")}
- Birthplace: ${P.birthplace}
- Availability: ${P.availability}
- Email: ${P.email}

## Impact
${content.stats.map((s) => `- ${s.value} ${s.unit}: ${s.label}`).join("\n")}

## Capabilities
${content.capabilities.map((c) => `- ${c.word}: ${c.note}`).join("\n")}

## Work experience (${SITE}/experience)
${content.experience.map((e) => `- ${e.role}, ${e.org} (${e.period}, ${e.type}): ${e.summary}`).join("\n")}

## Case files
${content.projects
  .map((p) => `### ${p.title}\n${p.kicker} · ${p.role} · ${p.period}\n${p.stat.value} — ${p.stat.label}\n\n${p.dek}\n\n${p.body}\n\n${p.highlights.map((h) => `- ${h}`).join("\n")}`)
  .join("\n\n")}

## Leadership (${SITE}/leadership)
${content.leadership
  .map((g) => `### ${g.group}\n${g.groupSubtitle}\n${g.roles.map((r) => `- ${r.role} (${r.period}): ${r.detail}`).join("\n")}`)
  .join("\n\n")}

## Awards
${content.awards.map((a) => `- ${a.title}, ${a.org} (${a.period})`).join("\n")}

## Certifications (${content.certifications.count})
${content.certifications.items.map((c) => `- ${c.title} — ${c.issuer}, ${c.date}. Verify: ${c.url} (ID ${c.credentialId})`).join("\n")}

## Career journey (${SITE}/journey)
${content.journey.chapters
  .map((c) => `### ${c.title} — ${c.role} (${c.period})\n${c.dek}\n\n${md(c.body)}\n\n${c.highlights.map((h) => `- ${h}`).join("\n")}`)
  .join("\n\n")}

## References (available on request)
${content.references.map((r) => `- ${r.name}, ${r.title}`).join("\n")}

## Frequently asked questions
${content.faq.map((f) => `### ${f.q}\n${f.a}`).join("\n\n")}
`;
fs.writeFileSync(path.join(dist, "llms-full.txt"), llmsFull);

console.log(
  `prerender: ${Object.keys(seo.routes).length} routes + 404.html, sitemap.xml, robots.txt, llms.txt, llms-full.txt (lastmod ${LASTMOD})`
);
