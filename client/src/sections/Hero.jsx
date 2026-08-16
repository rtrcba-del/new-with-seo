import { Link } from "react-router-dom";

export default function Hero({ profile }) {
  return (
    <section className="hero" id="top">
      <div className="hero-bg">
        <img src="/images/chandra-bhakta-adhikari-portrait-lounge.jpg" alt="Chandra Bhakta Adhikari, Program Manager and Strategic Partnerships professional" fetchPriority="high" />
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
          <Link className="btn btn--marigold" to="/contact">
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
