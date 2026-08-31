import { useState } from "react";
import Reveal from "../components/Reveal.jsx";

function LeadGroup({ group, isActive, isOpen, onSelect, delay }) {
  return (
    <Reveal as="div" className={`lead-group ${isOpen ? "open" : ""} ${isActive ? "active" : ""}`} delay={delay}>
      <button
        className="lead-group-hdr"
        onClick={() => onSelect()}
        aria-expanded={isOpen}
        aria-pressed={isActive}
      >
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

const FALLBACK_IMAGE = "/images/chandra-bhakta-adhikari-rotaract-installation-ceremony.jpg";
const FALLBACK_ALT = "Chandra Bhakta Adhikari speaking at the 7th Rotaract Club Installation Ceremony";

export default function Leadership({ leadership, embedded }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const active = leadership?.[activeIdx];

  return (
    <section className="lead" id="leadership">
      <div className="container">
        <div className="lead-layout">
          <div className="lead-photo-col">
            {/* key={activeIdx} forces a remount on selection, which re-runs
                the CSS entrance animation below for a clean crossfade
                between organizations. */}
            <div className="lead-photo" key={activeIdx}>
              <img
                src={active?.image || FALLBACK_IMAGE}
                alt={active?.imageAlt || FALLBACK_ALT}
                loading="lazy"
              />
              <p className="lead-photo-cap">{active?.group}</p>
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
                <LeadGroup
                  key={group.group}
                  group={group}
                  isActive={i === activeIdx}
                  isOpen={i === activeIdx}
                  onSelect={() => setActiveIdx(i)}
                  delay={i * 70}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
