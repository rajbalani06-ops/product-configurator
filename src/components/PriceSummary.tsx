import { Download, Save, ShieldCheck, ShoppingBag } from "lucide-react";
import { type PriceBreakdown, type ProductConfig } from "../types/config";
import { generateSummary } from "../utils/pdf";
import { formatMoney } from "../utils/format";

type Props = {
  config: ProductConfig;
  price: PriceBreakdown;
  loading: boolean;
  saved: boolean;
  onAddToCart: () => void;
  onSave: () => void;
};

export function PriceSummary({
  config,
  price,
  loading,
  saved,
  onAddToCart,
  onSave,
}: Props) {
  return (
    <section className="price-card">
      <div className="option-card-heading">
        <span className="eyebrow">YOUR ESTIMATE</span>
        <span className="step-number">
          03 <i>/ 03</i>
        </span>
      </div>
      <div className="price-total">
        <span>Estimated total</span>
        <strong>{formatMoney(price.total)}</strong>
      </div>
      <div className="price-breakdown">
        <div>
          <span>Canopy base</span>
          <span>{formatMoney(price.base)}</span>
        </div>
        {price.variant !== 0 && (
          <div>
            <span>
              {config.variant === "light-up"
                ? "Light-up frame"
                : "Canopy only adjustment"}
            </span>
            <span>
              {price.variant < 0
                ? `−${formatMoney(-price.variant)}`
                : formatMoney(price.variant)}
            </span>
          </div>
        )}
        {price.options > 0 && (
          <div>
            <span>Wall options</span>
            <span>{formatMoney(price.options)}</span>
          </div>
        )}
        {price.printing > 0 && (
          <div>
            <span>Panel printing</span>
            <span>{formatMoney(price.printing)}</span>
          </div>
        )}
        {price.artwork > 0 && (
          <div>
            <span>Artwork preparation</span>
            <span>{formatMoney(price.artwork)}</span>
          </div>
        )}
      </div>
      <button className="add-cart" disabled={loading} onClick={onAddToCart}>
        {loading ? (
          "Adding to cart…"
        ) : (
          <>
            Add configured canopy <span>{formatMoney(price.total)}</span>
            <ShoppingBag size={16} />
          </>
        )}
      </button>
      <div className="save-actions">
        <button onClick={onSave}>
          <Save size={14} />
          {saved ? "Saved" : "Save configuration"}
        </button>
        <button onClick={() => generateSummary(config, price)}>
          <Download size={14} />
          Download spec sheet
        </button>
      </div>
      <div className="trust-line">
        <ShieldCheck size={14} /> Secure estimate <span>·</span> No commitment
      </div>
    </section>
  );
}
