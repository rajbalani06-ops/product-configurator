import { Check } from "lucide-react";

export function ProductDetails() {
  return (
    <section id="details" className="details-strip">
      <div>
        <span className="eyebrow">BUILT TO SHOW UP</span>
        <h2>Make the first impression count.</h2>
      </div>
      <p>
        Commercial-grade hardware, full-color dye sublimation and a tailored
        fit. Your custom canopy arrives ready to turn every event into your
        brand’s moment.
      </p>
      <div className="detail-points">
        <span>
          <Check size={14} /> 600D canopy fabric
        </span>
        <span>
          <Check size={14} /> Full-color print
        </span>
        <span>
          <Check size={14} /> Carry bag included
        </span>
      </div>
    </section>
  );
}

export function SiteFooter({ onToggleEmbed }: { onToggleEmbed: () => void }) {
  return (
    <footer className="site-footer">
      <span>© 2026 CANOPY / STUDIO</span>
      <span>Made for the moments that matter.</span>
      <button onClick={onToggleEmbed}>View embed mode</button>
    </footer>
  );
}
