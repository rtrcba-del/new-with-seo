import { Link } from "react-router-dom";

export default function Hero({ profile }) {
  return (
    <section className="hero" id="top">
      <div className="hero-bg">
        <img src="/images/chandra-bhakta-adhikari-keynote-rotaract-conference.jpg" alt="Chandra Bhakta Adhikari delivering a keynote at the Rotaract District Conference" fetchPriority="high" />
      </div>
      <div className="hero-scrim" />
      <div className="hero-frame" aria-hidden="true">
        <span className="hero-coord">{profile?.coordinates}</span>
        <span className="hero-coord hero-coord--r">{profile?.location?.toUpperCase()}</span>
      </div>

      <div className="hero-inner">
        {profile?.availability && (
          <div className="hero-avail">
            <span className="hero-avail-dot" />
            {profile.availability}
          </div>
        )}
        <h1 className="hero-name">
          CHANDRA<br/>BHAKTA<br/><span>ADHIKARI</span>
        </h1>
        {profile?.positioning?.length > 0 && (
          <p className="hero-positioning">{profile.positioning.join(" \u00b7 ")}</p>
        )}
        <p className="hero-tagline">&ldquo;{profile?.tagline}&rdquo;</p>

        <div className="hero-btns">
          <a className="btn btn--marigold" href="/chandra-cv.pdf" download="Chandra_Bhakta_Adhikari_CV.pdf">
            Download CV
          </a>
          <Link className="btn btn--ghost" to="/contact">
            Get In Touch
          </Link>
        </div>
      </div>

      <div className="hero-scroll" aria-hidden="true">
        <span>Scroll</span>
        <span className="hero-scroll-line" />
      </div>
    </section>
  );
}
