export default function ImpactBar({ stats }) {
  if (!stats?.length) return null;
  return (
    <section className="impact-bar">
      <div className="container impact-grid">
        {stats.map((s, i) => (
          <div className="impact-stat" key={i}>
            <span className="impact-val">{s.value}</span>
            <span className="impact-unit">{s.unit}</span>
            <span className="impact-label">{s.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
