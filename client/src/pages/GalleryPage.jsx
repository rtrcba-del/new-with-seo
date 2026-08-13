import PageHeader from "../components/PageHeader.jsx";
import Gallery from "../sections/Gallery.jsx";
import { useSEO } from "../lib/seo.js";

export default function GalleryPage({ gallery }) {
  useSEO({
    title: "Gallery",
    description: "Photos of Chandra Bhakta Adhikari across national stages, Rotaract District 3292 leadership events, and MHM/WASH field training in rural Nepal.",
    path: "/gallery",
  });
  return (
    <>
      <PageHeader
        eyebrow="The Field Record"
        title="Gallery"
        subtitle="Every frame worth keeping, from national stages to village classrooms."
      />
      <Gallery gallery={gallery} embedded />
    </>
  );
}
