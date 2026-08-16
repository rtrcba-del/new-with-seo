import PageHeader from "../components/PageHeader.jsx";
import Experience from "../sections/Experience.jsx";
import { useSEO } from "../lib/seo.js";

export default function ExperiencePage({ experience, certifications, awards }) {
  useSEO({
    title: "Experience",
    description: "Chandra Bhakta Adhikari's professional journey: Program Manager at Nepal Business Institute, Project Coordinator at Asha Project Nepal, and Trainer/Consultant across DRR, MHM and WASH programs.",
    path: "/experience",
  });
  return (
    <>
      <PageHeader
        eyebrow="The Record"
        title="Experience"
        subtitle="Five years across NGOs, government and business."
      />
      <Experience experience={experience} certifications={certifications} awards={awards} embedded />
    </>
  );
}
