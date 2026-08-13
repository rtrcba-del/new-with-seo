import PageHeader from "../components/PageHeader.jsx";
import About from "../sections/About.jsx";
import { useSEO } from "../lib/seo.js";

export default function AboutPage({ profile }) {
  useSEO({
    title: "About",
    description: "About Chandra Bhakta Adhikari: geologist by training, Program Manager and Strategic Partnerships professional based in Bhaktapur, Nepal.",
    path: "/about",
  });
  return (
    <>
      <PageHeader
        eyebrow="Who I Am"
        title="About"
      />
      <About profile={profile} embedded />
    </>
  );
}
