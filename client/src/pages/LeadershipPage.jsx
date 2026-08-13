import PageHeader from "../components/PageHeader.jsx";
import Leadership from "../sections/Leadership.jsx";
import { useSEO } from "../lib/seo.js";

export default function LeadershipPage({ leadership }) {
  useSEO({
    title: "Leadership",
    description: "Chandra Bhakta Adhikari's leadership history with Rotaract District 3292 (Nepal & Bhutan) as District Secretary, and progression through Rotaract Club of Sukedhara from SAP Coordinator to Club Adviser.",
    path: "/leadership",
  });
  return (
    <>
      <PageHeader
        eyebrow="Roles & Responsibilities"
        title="Leadership History"
        subtitle="Six years climbing from Sergeant-at-Arms to District Secretary."
      />
      <Leadership leadership={leadership} embedded />
    </>
  );
}
