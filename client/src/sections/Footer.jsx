const FB = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>;
const LI = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>;
const IG = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>;
const WA = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>;

export default function Footer({ profile, social, visitors }) {
  const year = new Date().getFullYear();
  const top = () => window.scrollTo({top:0,behavior:"smooth"});
  return (
    <footer>
      <div className="footer-main">
        <div className="footer-inner">
          <div>
            <p className="footer-name">{profile?.name}</p>
            <p className="footer-email">
              <a href={`mailto:${profile?.email}`}>{profile?.email}</a>
            </p>
          </div>
          <div className="footer-right">
            <div className="footer-social">
              {social?.facebook  && <a href={social.facebook}  target="_blank" rel="noopener noreferrer" className="soc-btn" aria-label="Facebook"><FB /></a>}
              {social?.linkedin  && <a href={social.linkedin}  target="_blank" rel="noopener noreferrer" className="soc-btn" aria-label="LinkedIn"><LI /></a>}
              {social?.instagram && <a href={social.instagram} target="_blank" rel="noopener noreferrer" className="soc-btn" aria-label="Instagram"><IG /></a>}
              {social?.whatsapp  && <a href={social.whatsapp}  target="_blank" rel="noopener noreferrer" className="soc-btn" aria-label="WhatsApp"><WA /></a>}
            </div>
            {visitors && (
              <p className="footer-visitor">{visitors.toLocaleString()} total views</p>
            )}
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="footer-bottom-inner">
          <p className="footer-copy">© {year} {profile?.name}. All rights reserved.</p>
          <button className="footer-bottom-link" onClick={top}>↑ Back to top</button>
        </div>
      </div>
    </footer>
  );
}
