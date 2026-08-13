import Reveal from "../components/Reveal.jsx";

export default function Capabilities({ capabilities }) {
  if (!capabilities?.length) return null;
  return (
    <section className="capabilities">
      <div className="container">
        <span className="sec-eyebrow">What I Bring To The Room</span>
        <div className="cap-list">
          {capabilities.map((c, i) => (
            <Reveal as="div" className="cap-row" key={i} delay={i * 60}>
              <span className="cap-index">{String(i+1).padStart(2,"0")}</span>
              <span className="cap-word">{c.word}</span>
              <span className="cap-note">{c.note}</span>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
