/**
 * Lightweight, scoped content-protection deterrents.
 *
 * Deliberately conservative: this raises the bar for casual image-saving
 * without breaking normal browsing. It does NOT:
 *  - disable text selection site-wide (people need to copy the email/phone
 *    number, and screen readers / translation tools rely on selectable text)
 *  - disable right-click globally (breaks "open in new tab", password
 *    managers, and browser accessibility menus)
 *  - claim to make images "impossible" to copy — screenshots always work,
 *    and no client-side script can prevent that. This only discourages the
 *    one-click "save image as" / drag-out path.
 */
// Containers that wrap an original portfolio/gallery photo. Kept in sync
// with the classnames used in Hero.jsx, About.jsx, Leadership.jsx,
// Projects.jsx and Gallery.jsx.
const WATERMARK_SELECTORS = [
  ".hero-bg", ".about-photo-wrap", ".lead-photo", ".case-media", ".g-item", ".lb-fig",
];

function applyWatermarks() {
  for (const sel of WATERMARK_SELECTORS) {
    document.querySelectorAll(sel).forEach((el) => {
      if (el.querySelector(":scope > .wm-badge")) return;
      if (getComputedStyle(el).position === "static") el.style.position = "relative";
      const badge = document.createElement("span");
      badge.className = "wm-badge";
      badge.setAttribute("aria-hidden", "true");
      badge.textContent = "adhikarichandra.com.np";
      el.appendChild(badge);
    });
  }
}

export function initContentProtection() {
  if (typeof window === "undefined" || typeof document === "undefined") return;

  // Apply on load, then keep re-applying as React mounts/unmounts pages
  // (route changes swap DOM nodes, so watermark badges need reattaching).
  applyWatermarks();
  const root = document.getElementById("root") || document.body;
  const observer = new MutationObserver(() => applyWatermarks());
  observer.observe(root, { childList: true, subtree: true });

  let toastTimer = null;
  function showNotice(message) {
    let el = document.getElementById("copy-notice");
    if (!el) {
      el = document.createElement("div");
      el.id = "copy-notice";
      el.setAttribute("role", "status");
      el.setAttribute("aria-live", "polite");
      el.style.cssText = [
        "position:fixed", "left:50%", "bottom:24px", "transform:translateX(-50%)",
        "background:#0B3048", "color:#fff", "padding:10px 18px", "border-radius:8px",
        "font:500 13px/1.4 Inter,sans-serif", "z-index:9999",
        "box-shadow:0 6px 24px rgba(0,0,0,.25)", "opacity:0",
        "transition:opacity .2s ease", "pointer-events:none", "max-width:86vw",
        "text-align:center",
      ].join(";");
      document.body.appendChild(el);
    }
    el.textContent = message;
    el.style.opacity = "1";
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { el.style.opacity = "0"; }, 2800);
  }

  const NOTICE =
    "This content is protected by copyright. Unauthorized reproduction or distribution is prohibited.";

  // Prevent the native drag-to-save-desktop gesture on images only.
  document.addEventListener(
    "dragstart",
    (e) => { if (e.target instanceof HTMLImageElement) e.preventDefault(); },
    true
  );

  // Prevent the context menu ("Save image as…") on images only — every
  // other element (body text, links, form fields) keeps its normal menu.
  document.addEventListener(
    "contextmenu",
    (e) => {
      if (e.target instanceof HTMLImageElement) {
        e.preventDefault();
        showNotice(NOTICE);
      }
    },
    true
  );
}
