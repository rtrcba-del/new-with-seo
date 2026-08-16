import { Link } from "react-router-dom";
import Hero from "../sections/Hero.jsx";
import ImpactBar from "../sections/ImpactBar.jsx";
import Capabilities from "../sections/Capabilities.jsx";
import Reveal from "../components/Reveal.jsx";
import { useSEO } from "../lib/seo.js";

export default function HomePage({ profile, stats, capabilities, projects }) {
  useSEO({
    title: "Program Manager & Strategic Partnerships",
    description: "Chandra Bhakta Adhikari is a Nepal-based Program Manager and Strategic Partnerships professional working across youth leadership, entrepreneurship, stakeholder engagement and community development.",
    path: "/",
  });
  const preview = projects?.slice(0, 3) ?? [];
  return (
    <>
      <Hero profile={profile} />
      <ImpactBar stats={stats} />
      <Capabilities capabilities={capabilities} />

      <section className="home-teaser">
        <div className="container">
          <Reveal>
            <span className="sec-eyebrow sec-eyebrow--light">Selected Work</span>
            <h2 className="sec-title-light">Three Case Files, Not A Resume Line In Sight.</h2>
          </Reveal>
          <div className="teaser-grid">
            {preview.map((p, i) => (
              <Reveal key={p.id} delay={i * 90} className="teaser-card">
                <img src={`/images/${p.hero}`} alt={`Chandra Bhakta Adhikari: ${p.title}`} loading="lazy" />
                <div className="teaser-card-body">
                  <span className="teaser-kicker">{p.kicker}</span>
                  <h3>{p.title}</h3>
                  <p>{p.dek}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal className="teaser-cta">
            <Link to="/projects" className="btn btn--ghost">View All Projects</Link>
          </Reveal>
        </div>
      </section>

      <section className="home-cta">
        <div className="container home-cta-inner">
          <Reveal>
            <h2 className="sec-title-light"> LET'S TURN IDEAS INTO IMPACT.</h2>
            <p>Have an idea, opportunity, or partnership in mind? Let's make it happen.</p>
            <Link to="/contact" className="btn btn--marigold">Get In Touch</Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
