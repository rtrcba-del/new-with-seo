import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

const LINKS = [
  { to: "/",           label: "Home" },
  { to: "/about",      label: "About" },
  { to: "/leadership", label: "Leadership" },
  { to: "/experience", label: "Experience" },
  { to: "/journey",    label: "Journey" },
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
            <NavLink className="nav-cta" to="/contact">Get In Touch</NavLink>
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
        <NavLink to="/contact" onClick={close} className={({isActive}) => `nav-cta ${isActive ? "active" : ""}`} style={{marginTop:"1.2rem"}}>
          Get In Touch
        </NavLink>
      </div>
    </>
  );
}
