import { useState, useMemo, useCallback, useEffect } from "react";
import Reveal from "../components/Reveal.jsx";

export default function Gallery({ gallery, embedded }) {
  const [filter, setFilter] = useState("All");
  const [active, setActive] = useState(null);

  const tags = useMemo(() => {
    const set = new Set((gallery ?? []).map(g => g.tag));
    return ["All", ...Array.from(set)];
  }, [gallery]);

  const filtered = useMemo(
    () => (filter === "All" ? (gallery ?? []) : (gallery ?? []).filter(g => g.tag === filter)),
    [gallery, filter]
  );

  const close = useCallback(() => setActive(null), []);
  const next  = useCallback(() => setActive(i => (i + 1) % filtered.length), [filtered.length]);
  const prev  = useCallback(() => setActive(i => (i - 1 + filtered.length) % filtered.length), [filtered.length]);

  useEffect(() => {
    if (active === null) return;
    const fn = e => {
      if (e.key === "Escape")     close();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft")  prev();
    };
    window.addEventListener("keydown", fn);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", fn); document.body.style.overflow = ""; };
  }, [active, close, next, prev]);

  if (!gallery?.length) return null;

  return (
    <section className={`gallery ${embedded ? "gallery--embedded" : ""}`} id="gallery">
      <div className="container">
        {!embedded && (
          <>
            <span className="sec-eyebrow sec-eyebrow--light">The Field Record</span>
            <h2 className="sec-title-light">Every Frame, No Filler.</h2>
          </>
        )}

        <div className="g-filters">
          {tags.map(t => (
            <button
              key={t}
              className={`g-pill ${filter === t ? "active" : ""}`}
              onClick={() => { setFilter(t); setActive(null); }}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="g-grid">
          {filtered.map((item, i) => (
            <Reveal as="figure" className="g-item" key={item.file} delay={(i % 6) * 60}>
              <button className="g-item-btn" onClick={() => setActive(i)} aria-label={item.caption} />
              <img src={`/images/${item.file}`} alt={`Chandra Bhakta Adhikari: ${item.caption}`} loading="lazy" />
              <div className="g-overlay">
                <span className="g-tag">{item.tag}</span>
                <p className="g-cap">{item.caption}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      {active !== null && (
        <div className="lightbox" role="dialog" aria-modal="true" onClick={e => { if (e.target === e.currentTarget) close(); }}>
          <button className="lb-btn lb-close" onClick={close} aria-label="Close">&#10005;</button>
          {filtered.length > 1 && (
            <>
              <button className="lb-btn lb-prev" onClick={prev} aria-label="Previous">&#8249;</button>
              <button className="lb-btn lb-next" onClick={next} aria-label="Next">&#8250;</button>
            </>
          )}
          <figure className="lb-fig">
            <img src={`/images/${filtered[active].file}`} alt={`Chandra Bhakta Adhikari: ${filtered[active].caption}`} />
            <figcaption className="lb-cap">
              <strong>{filtered[active].tag}</strong>: {filtered[active].caption}
            </figcaption>
          </figure>
        </div>
      )}
    </section>
  );
}
