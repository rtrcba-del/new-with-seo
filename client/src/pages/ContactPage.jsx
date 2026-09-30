import PageHeader from "../components/PageHeader.jsx";
import Contact from "../sections/Contact.jsx";
import { useSEO, routeSEO } from "../lib/seo.js";

export default function ContactPage({ profile, social }) {
  useSEO(routeSEO("/contact"));
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
