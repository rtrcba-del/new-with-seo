import PageHeader from "../components/PageHeader.jsx";
import Leadership from "../sections/Leadership.jsx";
import { useSEO, routeSEO } from "../lib/seo.js";

export default function LeadershipPage({ leadership }) {
  useSEO(routeSEO("/leadership"));
  return (
    <>
      <PageHeader
        eyebrow="Roles & Responsibilities"
        title="Leadership History"
        subtitle="Seven years climbing from SAP Coordinator to District Secretary."
      />
      <Leadership leadership={leadership} embedded />
    </>
  );
}
