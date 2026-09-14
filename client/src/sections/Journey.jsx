import { useState } from "react";
import Reveal from "../components/Reveal.jsx";

function Chapter({ role, reverse }) {
  const [open, setOpen] = useState(false);
  const bodyParas = Array.isArray(role.body) ? role.body : role.body.split("\n\n");
  return (
    <Reveal as="article" className={`case case--journey ${reverse ? "case--rev" : ""}`}>
      <div className="case-media">
        <img src={`/images/${role.hero}`} alt={`Chandra Bhakta Adhikari: ${role.title}`} loading="lazy" />
        <div className="case-stat case-stat--chip">
          <span className="case-stat-val">{role.chapter}</span>
          <span className="case-stat-label">{role.stat.label}</span>
        </div>
      </div>
      <div className="case-copy">
        <span className="case-kicker">{role.kicker}</span>
        <h2 className="case-title">{role.title}</h2>
        <p className="case-role">{role.role} &middot; {role.period}</p>
        <p className="case-dek">{role.dek}</p>

        <div className={`case-body ${open ? "open" : ""}`}>
          {bodyParas.map((p, i) => <p key={i}>{p}</p>)}
          <ul className="case-highlights">
            {role.highlights.map((h,i) => <li key={i}>{h}</li>)}
          </ul>
        </div>

        <button className="case-toggle" onClick={() => setOpen(v=>!v)}>
          {open ? "Close the chapter" : "Read the chapter"}
          <span className="case-toggle-icon">{open ? "\u2715" : "+"}</span>
        </button>

        <div className="case-tags">
          {role.tags.map(t => <span key={t}>{t}</span>)}
        </div>
      </div>
    </Reveal>
  );
}

export default function Journey({ journey, embedded }) {
  if (!journey?.length) return null;
  return (
    <section className={`work work--journey ${embedded ? "work--embedded" : ""}`} id="journey">
      {!embedded && (
        <div className="container">
          <span className="sec-eyebrow sec-eyebrow--light">Fifteen Roles, Chapter By Chapter</span>
          <h2 className="sec-title-light">The Journey, One Role At A Time.</h2>
        </div>
      )}
      <div className="case-list case-list--journey">
        {journey.map((r, i) => <Chapter role={r} key={r.id} reverse={i % 2 === 1} />)}
      </div>
    </section>
  );
}
