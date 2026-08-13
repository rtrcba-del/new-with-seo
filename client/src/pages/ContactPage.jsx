import PageHeader from "../components/PageHeader.jsx";
import Contact from "../sections/Contact.jsx";
import { useSEO } from "../lib/seo.js";

export default function ContactPage({ profile, social }) {
  useSEO({
    title: "Contact",
    description: "Get in touch with Chandra Bhakta Adhikari for speaking invitations, training requests, program partnerships, or strategic collaboration opportunities.",
    path: "/contact",
  });
  return (
    <>
      <PageHeader
        eyebrow="Get In Touch"
        title="Contact"
        subtitle="Training requests, speaking invitations, or partnership opportunities."
      />
      <Contact profile={profile} social={social} embedded />
    </>
  );
}
