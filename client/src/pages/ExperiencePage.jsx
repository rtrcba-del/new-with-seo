import PageHeader from "../components/PageHeader.jsx";
import Experience from "../sections/Experience.jsx";
import { useSEO, routeSEO } from "../lib/seo.js";

export default function ExperiencePage({ experience, certifications, awards }) {
  useSEO(routeSEO("/experience"));
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
