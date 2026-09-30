import { useEffect } from "react";
import seo from "../data/seo.json";

export const SITE_URL = seo.siteUrl;
export const SITE_NAME = seo.siteName;
export const DEFAULT_OG_IMAGE = `${SITE_URL}${seo.defaultImage}`;

/** Look up the shared title/description/image for a route (single source of
 *  truth: src/data/seo.json — also read by scripts/prerender.mjs at build). */
export function routeSEO(path) {
  const r = seo.routes[path];
  return { ...r, path };
}

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
 * Keeps <head> correct during client-side navigation. The first load of every
 * page already ships complete, page-specific head tags and JSON-LD from the
 * build-time prerender (scripts/prerender.mjs), so crawlers that never run JS
 * see the right data; this hook only updates title/description/canonical/
 * social tags when a visitor moves between routes without a full reload.
 * Structured data (JSON-LD) is deliberately left to the prerender: a fresh
 * crawl of any URL returns that page's own complete set.
 */
export function useSEO({ title, description, path = "/", noindex = false, image }) {
  useEffect(() => {
    const url = `${SITE_URL}${path}`;
    const img = image ? (image.startsWith("http") ? image : `${SITE_URL}${image}`) : DEFAULT_OG_IMAGE;

    document.title = title;
    setMeta("name", "description", description);
    setMeta(
      "name",
      "robots",
      noindex
        ? "noindex, nofollow"
        : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
    );
    setLink("canonical", url);

    setMeta("property", "og:title", title);
    setMeta("property", "og:description", description);
    setMeta("property", "og:url", url);
    setMeta("property", "og:image", img);
    setMeta("property", "og:type", "website");
    setMeta("property", "og:site_name", SITE_NAME);

    setMeta("name", "twitter:card", "summary_large_image");
    setMeta("name", "twitter:title", title);
    setMeta("name", "twitter:description", description);
    setMeta("name", "twitter:image", img);
  }, [title, description, path, noindex, image]);
}
