import { Link } from "react-router-dom";
import Reveal from "../components/Reveal.jsx";

export default function About({ profile, references, embedded }) {
  return (
    <section className="about" id="about">
      <div className="container about-grid">
        <Reveal className="about-photo-wrap">
          <img src="/images/chandra-bhakta-adhikari-portrait.jpg" alt="Chandra Bhakta Adhikari, Program Manager and Strategic Partnerships professional" loading="lazy" />
          <div className="about-badge">
            <span className="about-badge-dot" />
            {profile?.availability}
          </div>
        </Reveal>
        <Reveal delay={120}>
          {!embedded && (
            <>
              <span className="sec-eyebrow">Who I Am</span>
              <h2 className="sec-title-dark">About</h2>
            </>
          )}
          <p className="about-body">{profile?.bioLong || profile?.summary}</p>
          <div className="about-facts">
            <div><p className="about-fact-label">Location</p><p className="about-fact-val">{profile?.location}</p></div>
            <div><p className="about-fact-label">Education</p><p className="about-fact-val">{profile?.education}</p></div>
            <div><p className="about-fact-label">Languages</p><p className="about-fact-val">{profile?.languages?.join(", ")}</p></div>
            <div><p className="about-fact-label">Birthplace</p><p className="about-fact-val">{profile?.birthplace}</p></div>
          </div>
          <div className="about-btns">
            <a href="/chandra-bhakta-adhikari-resume.pdf" download="Chandra_Bhakta_Adhikari_Resume.pdf" className="btn btn--marigold">
              View Full CV
            </a>
            <Link to="/experience" className="btn btn--ink">
              View Experience
            </Link>
          </div>
        </Reveal>
      </div>

      {references?.length > 0 && (
        <Reveal className="container about-refs" delay={200}>
          <p className="about-refs-title">References available on request</p>
          <div className="about-refs-row">
            {references.map((r, i) => (
              <div className="about-ref" key={i}>
                <p className="about-ref-name">{r.name}</p>
                <p className="about-ref-title">{r.title}</p>
              </div>
            ))}
          </div>
        </Reveal>
      )}
    </section>
  );
}
