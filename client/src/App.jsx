import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { apiUrl } from "./lib/api.js";
import bundledContent from "./data/content.json";
import Nav          from "./components/Nav.jsx";
import Footer       from "./sections/Footer.jsx";
import ScrollToTop  from "./components/ScrollToTop.jsx";
import HomePage        from "./pages/HomePage.jsx";
import ProjectsPage     from "./pages/ProjectsPage.jsx";
import GalleryPage     from "./pages/GalleryPage.jsx";
import ExperiencePage  from "./pages/ExperiencePage.jsx";
import LeadershipPage  from "./pages/LeadershipPage.jsx";
import AboutPage       from "./pages/AboutPage.jsx";
import ContactPage     from "./pages/ContactPage.jsx";
import NotFoundPage    from "./pages/NotFoundPage.jsx";

function PageFade({ children }) {
  const location = useLocation();
  return (
    <div className="page-fade" key={location.pathname}>
      {children}
    </div>
  );
}

export default function App() {
  // Content ships bundled with the client build, so the site is fully
  // functional as a static deploy with zero backend. If an API server is
  // also deployed (e.g. Render), its response overrides the bundled copy,
  // which lets content.json be edited live without a client rebuild.
  const [content,  setContent]  = useState(bundledContent);
  const [visitors, setVisitors] = useState(null);

  useEffect(() => {
    fetch(apiUrl("/api/content"))
      .then(r => r.ok ? r.json() : null).then(d => { if (d) setContent(d); }).catch(()=>{});
    fetch(apiUrl("/api/visit"))
      .then(r => r.ok ? r.json() : null).then(d => { if (d) setVisitors(d.count); }).catch(()=>{});
  }, []);

  const { profile, stats, capabilities, projects, experience, leadership, certifications, gallery, social, awards, references } = content;

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Nav profile={profile} />
      <PageFade>
        <main>
          <Routes>
            <Route path="/" element={<HomePage profile={profile} stats={stats} capabilities={capabilities} projects={projects} />} />
            <Route path="/projects" element={<ProjectsPage projects={projects} />} />
            <Route path="/gallery" element={<GalleryPage gallery={gallery} />} />
            <Route path="/experience" element={<ExperiencePage experience={experience} certifications={certifications} awards={awards} />} />
            <Route path="/leadership" element={<LeadershipPage leadership={leadership} />} />
            <Route path="/about" element={<AboutPage profile={profile} references={references} />} />
            <Route path="/contact" element={<ContactPage profile={profile} social={social} />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
      </PageFade>
      <Footer profile={profile} social={social} visitors={visitors} />
    </BrowserRouter>
  );
}
