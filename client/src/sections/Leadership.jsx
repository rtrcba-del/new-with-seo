import { useState } from "react";
import Reveal from "../components/Reveal.jsx";

function LeadGroup({ group, defaultOpen, delay }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <Reveal as="div" className={`lead-group ${open ? "open" : ""}`} delay={delay}>
      <button className="lead-group-hdr" onClick={() => setOpen(v => !v)} aria-expanded={open}>
        <div>
          <p className="lead-group-name">{group.group}</p>
          <p className="lead-group-sub">{group.groupSubtitle}</p>
        </div>
        <span className="lead-group-meta">
          {group.roles.length} role{group.roles.length > 1 ? "s" : ""}
          <span className="lead-group-chev">⌄</span>
        </span>
      </button>
      <div className="lead-group-body">
        <div className="lead-roles">
          {group.roles.map((r, i) => (
            <div className="lead-role" key={i}>
              <span className="lead-role-dot" />
              <div>
                <div className="lead-role-top">
                  <span className="lead-role-title">{r.role}</span>
                  <span className="lead-role-period">{r.period}</span>
                </div>
                <p className="lead-role-org">{r.org}</p>
                <p className="lead-role-detail">{r.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Reveal>
  );
}

export default function Leadership({ leadership, embedded }) {
  return (
    <section className="lead" id="leadership">
      <div className="container">
        <div className="lead-layout">
          <div className="lead-photo-col">
            <div className="lead-photo">
              <img src="/images/chandra-bhakta-adhikari-rotaract-installation-ceremony.jpg" alt="Chandra Bhakta Adhikari speaking at the 7th Rotaract Club Installation Ceremony" loading="lazy" />
              <p className="lead-photo-cap"></p>
            </div>
          </div>
          <div>
            {!embedded && (
              <>
                <span className="sec-eyebrow">Roles &amp; Responsibilities</span>
                <h2 className="sec-title-dark">Leadership History</h2>
              </>
            )}
            <div className="lead-groups">
              {leadership?.map((group, i) => (
                <LeadGroup key={group.group} group={group} defaultOpen={i === 0} delay={i * 70} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
