import PageHeader from "../components/PageHeader.jsx";
import About from "../sections/About.jsx";
import FAQ from "../sections/FAQ.jsx";
import { useSEO, routeSEO } from "../lib/seo.js";

export default function AboutPage({ profile, references, faq }) {
  useSEO(routeSEO("/about"));
  return (
    <>
      <PageHeader
        eyebrow="Who I Am"
        title="About"
      />
      <About profile={profile} references={references} embedded />
      <FAQ faq={faq} />
    </>
  );
}
