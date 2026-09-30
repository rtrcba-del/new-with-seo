import PageHeader from "../components/PageHeader.jsx";
import Journey from "../sections/Journey.jsx";
import { useSEO, routeSEO } from "../lib/seo.js";

export default function JourneyPage({ journey }) {
  useSEO(routeSEO("/journey"));
  return (
    <>
      <PageHeader
        eyebrow="Fifteen Roles, Chapter By Chapter"
        title="Journey"
        subtitle="Not a résumé. Fifteen chapters, told in order, each one built on the last."
      />
      <Journey journey={journey?.chapters} embedded />
    </>
  );
}
