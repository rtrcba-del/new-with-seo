// server/seo-meta.js
//
// Why this file exists:
// This site is a client-rendered React SPA. Googlebot executes JavaScript and
// will see per-page titles/descriptions fine, but most AI/answer-engine
// crawlers (GPTBot, ClaudeBot, PerplexityBot, CCBot, Google-Extended in some
// modes, and most link-preview bots) fetch raw HTML and do NOT run the JS
// bundle. Without this, every route would look identical to those crawlers:
// the homepage's title, description and content, forever.
//
// This module gives server/index.js everything it needs to rewrite the
// served index.html per-route at request time: unique <title>/meta tags,
// canonical URL, Open Graph/Twitter tags, JSON-LD (BreadcrumbList + a
// page-appropriate type), and a short server-rendered text snapshot of the
// page's real content injected into <div id="root"> before the SPA hydrates
// over it. That snapshot is what lets an LLM/AI crawler that never runs JS
// actually read, quote and cite the page.

const SITE_URL = "https://adhikarichandra.com.np";
const SITE_NAME = "Chandra Bhakta Adhikari";
const DEFAULT_IMAGE = `${SITE_URL}/images/chandra-bhakta-adhikari-portrait.jpg`;

const esc = (s = "") =>
  String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

// Keep these titles/descriptions in sync with the useSEO() calls in
// client/src/pages/*.jsx — this is the server-rendered fallback for the same
// per-page metadata.
export const ROUTES = {
  "/": {
    title: "Program Manager & Strategic Partnerships",
    description:
      "Chandra Bhakta Adhikari is a Nepal-based Program Manager and Strategic Partnerships professional working across youth leadership, entrepreneurship, stakeholder engagement and community development.",
    breadcrumb: [{ name: "Home", path: "/" }],
    type: "ProfilePage",
  },
  "/about": {
    title: "About",
    description:
      "About Chandra Bhakta Adhikari: geologist by training, Program Manager and Strategic Partnerships professional based in Bhaktapur, Nepal.",
    breadcrumb: [{ name: "Home", path: "/" }, { name: "About", path: "/about" }],
    type: "AboutPage",
  },
  "/experience": {
    title: "Experience",
    description:
      "Chandra Bhakta Adhikari's professional journey: Program Manager at Nepal Business Institute, Project Coordinator at Asha Project Nepal, and Trainer/Consultant across DRR, MHM and WASH programs.",
    breadcrumb: [{ name: "Home", path: "/" }, { name: "Experience", path: "/experience" }],
    type: "ProfilePage",
  },
  "/journey": {
    title: "Journey",
    description:
      "Chandra Bhakta Adhikari's career journey across thirteen roles: from SAP Coordinator at a single Rotaract club to Program Manager of Nepal's flagship national business summits.",
    breadcrumb: [{ name: "Home", path: "/" }, { name: "Journey", path: "/journey" }],
    type: "CollectionPage",
  },
  "/leadership": {
    title: "Leadership",
    description:
      "Chandra Bhakta Adhikari's leadership history with Rotaract District 3292 (Nepal & Bhutan) as District Secretary, and progression through Rotaract Club of Sukedhara from SAP Coordinator to Club Adviser.",
    breadcrumb: [{ name: "Home", path: "/" }, { name: "Leadership", path: "/leadership" }],
    type: "ProfilePage",
  },
  "/gallery": {
    title: "Gallery",
    description:
      "Photos of Chandra Bhakta Adhikari across national stages, Rotaract District 3292 leadership events, and MHM/WASH field training in rural Nepal.",
    breadcrumb: [{ name: "Home", path: "/" }, { name: "Gallery", path: "/gallery" }],
    type: "CollectionPage",
  },
  "/contact": {
    title: "Contact",
    description:
      "Get in touch with Chandra Bhakta Adhikari for speaking invitations, training requests, program partnerships, or strategic collaboration opportunities.",
    breadcrumb: [{ name: "Home", path: "/" }, { name: "Contact", path: "/contact" }],
    type: "ContactPage",
  },
};

function breadcrumbLD(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}

/**
 * Renders a short, honest, text-only snapshot of a route's real content.
 * Deliberately uses <p>/<ul> only (no headings) so it never introduces a
 * second <h1> alongside the one the React app renders once it hydrates —
 * this snapshot is a pre-hydration stand-in, not additional content.
 */
function snapshot(routePath, content) {
  const p = content?.profile || {};
  const esc_ = esc;
  switch (routePath) {
    case "/":
      return `
        <p><strong>${esc_(p.name)}</strong> — ${esc_(p.positioning?.join(" · ") || p.title)}</p>
        <p>${esc_(p.tagline)}</p>
        <p>${esc_(p.summary)}</p>`;
    case "/about":
      return `
        <p><strong>About ${esc_(p.name)}</strong></p>
        <p>${esc_(p.bioLong || p.summary)}</p>
        <p>Location: ${esc_(p.location)}. Education: ${esc_(p.education)}.</p>`;
    case "/experience":
      return `
        <p><strong>Experience — ${esc_(p.name)}</strong></p>
        <ul>${(content?.experience || [])
          .map((e) => `<li>${esc_(e.role)}, ${esc_(e.org)} (${esc_(e.period)}): ${esc_(e.summary || "")}</li>`)
          .join("")}</ul>`;
    case "/journey":
      return `
        <p><strong>Journey — ${esc_(p.name)}</strong></p>
        <ul>${(content?.journey?.chapters || [])
          .map((c) => `<li>${esc_(c.title)}, ${esc_(c.role)} (${esc_(c.period)}): ${esc_(c.dek || "")}</li>`)
          .join("")}</ul>`;
    case "/leadership":
      return `
        <p><strong>Leadership — ${esc_(p.name)}</strong></p>
        <ul>${(content?.leadership || [])
          .map((l) => `<li>${esc_(l.role)}, ${esc_(l.org)} (${esc_(l.period)})</li>`)
          .join("")}</ul>`;
    case "/gallery":
      return `<p><strong>Gallery — ${esc_(p.name)}</strong></p><p>Photos across national stages, Rotaract District 3292 leadership events, and MHM/WASH field training in rural Nepal.</p>`;
    case "/contact":
      return `
        <p><strong>Contact ${esc_(p.name)}</strong></p>
        <p>Email: ${esc_(p.email || "")}</p>
        <p>Location: ${esc_(p.location || "")}</p>`;
    default:
      return "";
  }
}

/**
 * Builds the full replacement <head> fragment + a body snapshot for a route.
 */
export function renderRouteHTML(routePath, content, nonce = "") {
  const meta = ROUTES[routePath];
  if (!meta) return null;

  const fullTitle = routePath === "/" ? `${SITE_NAME} | ${meta.title}` : `${meta.title} | ${SITE_NAME}`;
  const url = `${SITE_URL}${routePath}`;
  const image = DEFAULT_IMAGE;

  const jsonLdBlocks = [breadcrumbLD(meta.breadcrumb)];

  const headReplacements = {
    title: esc(fullTitle),
    description: esc(meta.description),
    canonical: url,
    ogTitle: esc(fullTitle),
    ogDescription: esc(meta.description),
    ogUrl: url,
    ogImage: image,
    twitterTitle: esc(fullTitle),
    twitterDescription: esc(meta.description),
    twitterImage: image,
    extraJsonLd: jsonLdBlocks
      .map((ld) => `<script type="application/ld+json">${JSON.stringify(ld)}</script>`)
      .join("\n  "),
  };

  // aria-hidden + clipped off-screen: for JS clients this node is removed by
  // the inline script the instant #root mounts (see below), so real users
  // and screen-reader users never see or hear it — it exists only for the
  // brief pre-hydration window and for clients that never execute JS at all.
  const bodySnapshot = `<div id="seo-snapshot" aria-hidden="true" style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap;">${snapshot(
    routePath,
    content
  )}</div>
  <script nonce="${esc(nonce)}">(function(){var n=6;function tick(){var r=document.getElementById("root");var s=document.getElementById("seo-snapshot");if(!s)return;if(r&&r.children.length>0){s.remove();return;}if(n-->0)setTimeout(tick,150);}tick();})();</script>`;

  return { headReplacements, bodySnapshot };
}

export { SITE_URL, SITE_NAME, DEFAULT_IMAGE };
