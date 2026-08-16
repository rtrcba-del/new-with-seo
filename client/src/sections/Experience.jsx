import Reveal from "../components/Reveal.jsx";

export default function Experience({ experience, certifications, awards, embedded }) {
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

        {certifications?.featured?.length > 0 && (
          <div className="cert-strip">
            <p className="cert-strip-title">
              {certifications.count}+ Certifications, Six On File
            </p>
            <div className="cert-strip-row">
              {certifications.featured.map((c, i) => (
                <div className="cert-chip" key={i}>
                  <span className="cert-chip-title">{c.title}</span>
                  <span className="cert-chip-meta">{c.issuer} &middot; {c.date}</span>
                </div>
              ))}
            </div>
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

