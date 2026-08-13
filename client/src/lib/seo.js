import { useEffect } from "react";

export const SITE_URL = "https://adhikarichandra.com.np";
export const SITE_NAME = "Chandra Bhakta Adhikari";
export const DEFAULT_OG_IMAGE = `${SITE_URL}/images/chandra-bhakta-adhikari-portrait.jpg`;

function setMeta(attr, key, content) {
  if (!content) return;
  let el = document.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setLink(rel, href) {
  let el = document.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

/**
 * Applies per-page title, description, canonical URL and social meta.
 * Runs on every route change. Since this is a client-rendered SPA, the very
 * first HTML Googlebot / social-share bots see before JS executes still uses
 * the defaults baked into index.html — this hook improves the *rendered*
 * snapshot Googlebot indexes (it does execute JS) but does not change what
 * non-JS scrapers (some link-preview bots) see. For guaranteed non-JS
 * previews per page, a prerender/SSR step would be the next upgrade.
 */
export function useSEO({ title, description, path = "/", noindex = false, image }) {
  useEffect(() => {
    const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} | Program Manager & Strategic Partnerships`;
    const url = `${SITE_URL}${path}`;
    const desc = description || "Chandra Bhakta Adhikari is a Nepal-based Program Manager and Strategic Partnerships professional working across youth leadership, entrepreneurship, stakeholder engagement and community development.";
    const img = image || DEFAULT_OG_IMAGE;

    document.title = fullTitle;
    setMeta("name", "description", desc);
    setMeta("name", "robots", noindex ? "noindex, nofollow" : "index, follow");
    setLink("canonical", url);

    setMeta("property", "og:title", fullTitle);
    setMeta("property", "og:description", desc);
    setMeta("property", "og:url", url);
    setMeta("property", "og:image", img);
    setMeta("property", "og:type", "website");
    setMeta("property", "og:site_name", SITE_NAME);

    setMeta("name", "twitter:card", "summary_large_image");
    setMeta("name", "twitter:title", fullTitle);
    setMeta("name", "twitter:description", desc);
    setMeta("name", "twitter:image", img);
  }, [title, description, path, noindex, image]);
}
