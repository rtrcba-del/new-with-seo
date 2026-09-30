import { Link } from "react-router-dom";
import Reveal from "../components/Reveal.jsx";

/** Short, self-contained "who is this" answer near the top of the homepage:
 *  the passage search snippets and AI answers most often lift. */
export default function Overview({ overview }) {
  if (!overview?.body) return null;
  return (
    <section className="overview" aria-labelledby="overview-title">
      <div className="container overview-inner">
        <Reveal>
          <span className="sec-eyebrow">At A Glance</span>
          <h2 className="sec-title-dark" id="overview-title">{overview.heading}</h2>
          <p className="overview-body">{overview.body}</p>
          {overview.aka && <p className="overview-aka">{overview.aka}</p>}
          {overview.links?.length > 0 && (
            <ul className="overview-links">
              {overview.links.map((l) => (
                <li key={l.to}><Link to={l.to}>{l.label}</Link></li>
              ))}
            </ul>
          )}
        </Reveal>
      </div>
    </section>
  );
}
