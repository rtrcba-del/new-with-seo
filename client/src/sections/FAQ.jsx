import Reveal from "../components/Reveal.jsx";

/** Visible FAQ. The same Q&A is emitted as FAQPage JSON-LD by the prerender
 *  (scripts/prerender.mjs), so what search engines read matches what people see. */
export default function FAQ({ faq }) {
  if (!faq?.length) return null;
  return (
    <section className="faq" id="faq" aria-labelledby="faq-title">
      <div className="container faq-inner">
        <Reveal>
          <span className="sec-eyebrow">Quick Answers</span>
          <h2 className="sec-title-dark" id="faq-title">Frequently Asked Questions</h2>
        </Reveal>
        <div className="faq-list">
          {faq.map((item, i) => (
            <Reveal key={i} delay={Math.min(i, 5) * 40} className="faq-item">
              <h3 className="faq-q">{item.q}</h3>
              <p className="faq-a">{item.a}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
