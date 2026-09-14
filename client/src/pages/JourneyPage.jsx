import PageHeader from "../components/PageHeader.jsx";
import Journey from "../sections/Journey.jsx";
import { useSEO } from "../lib/seo.js";

export default function JourneyPage({ journey }) {
  useSEO({
    title: "Journey",
    description: "Chandra Bhakta Adhikari's career journey across thirteen roles: from SAP Coordinator at a single Rotaract club to Program Manager of Nepal's flagship national business summits.",
    path: "/journey",
  });
  return (
    <>
      <PageHeader
        eyebrow="Thirteen Roles, One Throughline"
        title="Journey"
        subtitle="Not a résumé. Thirteen chapters, told in order, each one built on the last."
      />
      <Journey journey={journey?.chapters} throughline={journey?.throughline} embedded />
    </>
  );
}
