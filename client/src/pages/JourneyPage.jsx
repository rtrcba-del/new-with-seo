import PageHeader from "../components/PageHeader.jsx";
import Journey from "../sections/Journey.jsx";
import { useSEO } from "../lib/seo.js";

export default function JourneyPage({ journey }) {
  useSEO({
    title: "Journey",
    description: "Chandra Bhakta Adhikari's career journey across fifteen roles: from grassroots training and Rotaract club committees to Program Manager of Nepal's flagship national business summits.",
    path: "/journey",
  });
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
