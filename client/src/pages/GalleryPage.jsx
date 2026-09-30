import PageHeader from "../components/PageHeader.jsx";
import Gallery from "../sections/Gallery.jsx";
import { useSEO, routeSEO } from "../lib/seo.js";

export default function GalleryPage({ gallery }) {
  useSEO(routeSEO("/gallery"));
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
