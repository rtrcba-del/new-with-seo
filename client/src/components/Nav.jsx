import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

const LINKS = [
  { to: "/",           label: "Home" },
  { to: "/about",      label: "About" },
  { to: "/experience", label: "Experience" },
  { to: "/leadership", label: "Leadership" },
  { to: "/projects",   label: "Projects" },
  { to: "/gallery",    label: "Gallery" },

];

export default function Nav({ profile }) {
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(false);

  useEffect(() => { document.body.style.overflow = open ? "hidden" : ""; }, [open]);
  useEffect(() => {
    const fn = () => setSolid(window.scrollY > 40);
    fn();
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const close = () => setOpen(false);

  return (
    <>
      <header className={`nav ${solid ? "solid" : ""}`}>
        <div className="nav-inner">
          <NavLink to="/" className="nav-mark" onClick={close}>
            <span className="nav-mark-initials">C&middot;B&middot;A</span>
            <span className="nav-mark-sub">Portfolio</span>
          </NavLink>

          <nav className="nav-links" aria-label="Primary">
            {LINKS.map(l => (
              <NavLink key={l.to} to={l.to} end={l.to === "/"} className={({isActive}) => isActive ? "active" : ""}>
                {l.label}
              </NavLink>
            ))}
          </nav>

          <div className="nav-right">
            <NavLink to="/contact" className={({isActive}) => `nav-cta-link ${isActive ? "active" : ""}`}>Contact</NavLink>
            <a className="nav-cta" href="/chandra-cv.pdf" download="Chandra_Bhakta_Adhikari_CV.pdf">Download CV</a>
          </div>

          <button className={`nav-toggle ${open ? "open" : ""}`} onClick={() => setOpen(v=>!v)} aria-label="Toggle menu">
            <span/><span/><span/>
          </button>
        </div>
      </header>

      <div className={`nav-mobile ${open ? "open" : ""}`}>
        {LINKS.map(l => (
          <NavLink key={l.to} to={l.to} end={l.to === "/"} onClick={close} className={({isActive}) => isActive ? "active" : ""}>
            {l.label}
          </NavLink>
        ))}
        <NavLink to="/contact" onClick={close} className={({isActive}) => isActive ? "active" : ""}>Contact</NavLink>
        <a className="nav-cta" style={{marginTop:"1.2rem"}} href="/chandra-cv.pdf" download="Chandra_Bhakta_Adhikari_CV.pdf" onClick={close}>
          Download CV
        </a>
      </div>
    </>
  );
}
