import { useState } from "react";
import Reveal from "../components/Reveal.jsx";

// Groups a chronologically-sorted certification list by month, so certs
// earned in the same month cluster together and a visible gap/divider
// separates one month from the next.
function groupByMonth(items) {
  const groups = [];
  let current = null;
  for (const item of items || []) {
    if (!current || current.monthKey !== item.monthKey) {
      current = { monthKey: item.monthKey, label: item.date, items: [] };
      groups.push(current);
    }
    current.items.push(item);
  }
  return groups;
}

const PREVIEW_COUNT = 4;

export default function Experience({ experience, certifications, awards, embedded }) {
  const [showAllCerts, setShowAllCerts] = useState(false);
  const allItems = certifications?.items || [];
  const previewItems = allItems.slice(0, PREVIEW_COUNT);
  const certGroups = groupByMonth(allItems);
  const hasMore = allItems.length > PREVIEW_COUNT;

  return (
    <section className="exp" id="experience">
      <div className="container">
        {!embedded && (
          <>
            <span className="sec-eyebrow">The Record</span>
            <h2 className="sec-title-dark">Experience</h2>
          </>
        )}

        <div className="exp-list">
          {experience?.map((item, i) => (
            <Reveal as="div" className="exp-row" key={item.id} delay={i * 60}>
              <span className="exp-period">{item.period}</span>
              <div className="exp-main">
                <p className="exp-role">{item.role} <span className="exp-org">at {item.org}</span></p>
                <p className="exp-summary">{item.summary}</p>
                <div className="exp-tags">
                  {item.tags?.map(t => <span key={t}>{t}</span>)}
                </div>
              </div>
              <span className="exp-type">{item.type}</span>
            </Reveal>
          ))}
        </div>

        {allItems.length > 0 && (
          <div className="cert-strip">
            <p className="cert-strip-title">{certifications.count} Certifications</p>

            {!showAllCerts ? (
              <div className="cert-strip-row">
                {previewItems.map((c, i) => (
                  <a
                    className="cert-chip"
                    key={i}
                    href={c.url}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                  >
                    <span className="cert-chip-title">{c.title}</span>
                    <span className="cert-chip-meta">{c.issuer} &middot; {c.date}</span>
                  </a>
                ))}
              </div>
            ) : (
              <div className="cert-timeline">
                {certGroups.map((group) => (
                  <div className="cert-month-group" key={group.monthKey}>
                    <span className="cert-month-label">{group.label}</span>
                    <div className="cert-strip-row">
                      {group.items.map((c, i) => (
                        <a
                          className="cert-chip"
                          key={i}
                          href={c.url}
                          target="_blank"
                          rel="noopener noreferrer nofollow"
                        >
                          <span className="cert-chip-title">{c.title}</span>
                          <span className="cert-chip-meta">{c.issuer} &middot; {c.date}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {hasMore && (
              <button
                type="button"
                className="cert-toggle-btn"
                onClick={() => setShowAllCerts((v) => !v)}
                aria-expanded={showAllCerts}
              >
                {showAllCerts ? "Show Less ↑" : `View All ${certifications.count} Certifications ↓`}
              </button>
            )}
          </div>
        )}

        {awards?.length > 0 && (
          <div className="cert-strip">
            <p className="cert-strip-title">Awards &amp; Recognition</p>
            <div className="cert-strip-row">
              {awards.map((a, i) => (
                <div className="cert-chip cert-chip--award" key={i}>
                  <span className="cert-chip-title">{a.title}</span>
                  <span className="cert-chip-meta">{a.org} &middot; {a.period}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

