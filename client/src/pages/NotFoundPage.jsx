import { Link } from "react-router-dom";
import { useSEO } from "../lib/seo.js";

export default function NotFoundPage() {
  useSEO({
    title: "Page Not Found",
    description: "This page doesn't exist.",
    path: "/404",
    noindex: true,
  });
  return (
    <section className="page-header" style={{ minHeight: "70vh", display: "flex", alignItems: "center" }}>
      <div className="container">
        <span className="sec-eyebrow sec-eyebrow--light">404</span>
        <h1 className="page-header-title">Page Not Found</h1>
        <p className="page-header-sub">
          That page doesn't exist, or moved. Try the homepage, or one of the links in the menu above.
        </p>
        <div style={{ marginTop: "2rem" }}>
          <Link to="/" className="btn btn--marigold">Back To Home</Link>
        </div>
      </div>
    </section>
  );
}
