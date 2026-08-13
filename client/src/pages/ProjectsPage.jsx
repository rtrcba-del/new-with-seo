import PageHeader from "../components/PageHeader.jsx";
import Projects from "../sections/Projects.jsx";
import { useSEO } from "../lib/seo.js";

export default function ProjectsPage({ projects }) {
  useSEO({
    title: "Projects & Case Studies",
    description: "Case studies from Chandra Bhakta Adhikari's work: Nepal Business Summit, Rotaract District 3292 leadership, and MHM/WASH field campaigns across 20+ districts of Nepal.",
    path: "/projects",
  });
  return (
    <>
      <PageHeader
        eyebrow="Selected Work"
        title="Projects"
        subtitle="Three projects, told properly. Not a bullet point in sight."
      />
      <Projects projects={projects} embedded />
    </>
  );
}
