import { useState } from "react";
import Reveal from "../components/Reveal.jsx";

function CaseFile({ project, reverse }) {
  const [open, setOpen] = useState(false);
  return (
    <Reveal as="article" className={`case ${reverse ? "case--rev" : ""}`}>
      <div className="case-media">
        <img src={`/images/${project.hero}`} alt={`Chandra Bhakta Adhikari: ${project.title}`} loading="lazy" />
        <div className="case-stat">
          <span className="case-stat-val">{project.stat.value}</span>
          <span className="case-stat-label">{project.stat.label}</span>
        </div>
      </div>
      <div className="case-copy">
        <span className="case-kicker">{project.kicker}</span>
        <h2 className="case-title">{project.title}</h2>
        <p className="case-role">{project.role} &middot; {project.period}</p>
        <p className="case-dek">{project.dek}</p>

        <div className={`case-body ${open ? "open" : ""}`}>
          <p>{project.body}</p>
          <ul className="case-highlights">
            {project.highlights.map((h,i) => <li key={i}>{h}</li>)}
          </ul>
        </div>

        <button className="case-toggle" onClick={() => setOpen(v=>!v)}>
          {open ? "Close the file" : "Open the file"}
          <span className="case-toggle-icon">{open ? "\u2715" : "+"}</span>
        </button>

        <div className="case-tags">
          {project.tags.map(t => <span key={t}>{t}</span>)}
        </div>
      </div>
    </Reveal>
  );
}

export default function Projects({ projects, embedded }) {
  if (!projects?.length) return null;
  return (
    <section className={`work ${embedded ? "work--embedded" : ""}`} id="work">
      {!embedded && (
        <div className="container">
          <span className="sec-eyebrow sec-eyebrow--light">Selected Work</span>
          <h2 className="sec-title-light">Three Case Files, Not A R&eacute;sum&eacute; Line In Sight.</h2>
        </div>
      )}
      <div className="case-list">
        {projects.map((p, i) => <CaseFile project={p} key={p.id} reverse={i % 2 === 1} />)}
      </div>
    </section>
  );
}

