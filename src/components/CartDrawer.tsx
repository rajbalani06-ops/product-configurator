import { Check, ShoppingBag, X } from "lucide-react";
import { clearMockCart, type CartLine } from "../services/shopify";
import type { ProductConfig } from "../types/config";
import { formatMoney } from "../utils/format";

type Props = {
  cart: CartLine[];
  config: ProductConfig;
  onClose: () => void;
  onClear: () => void;
};

export function CartDrawer({ cart, config, onClose, onClear }: Props) {
  return (
    <div
      className="modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="cart-modal">
        <div className="modal-header">
          <div>
            <span className="eyebrow">MOCK SHOPIFY CART</span>
            <h2>Your configured canopy</h2>
          </div>
          <button className="icon-button" onClick={onClose}>
            <X size={18} />
          </button>
        </div>
        {cart.length === 0 ? (
          <div className="empty-cart">
            <ShoppingBag size={30} />
            <p>Your cart is ready for a configuration.</p>
            <small>
              Add a canopy to see its Shopify line-item details here.
            </small>
          </div>
        ) : (
          <>
            {cart.map((item) => (
              <div className="cart-line" key={item.id}>
                <div className="cart-mini-preview">
                  <div style={{ background: config.surfaces.roof.color }} />
                  <div style={{ background: config.surfaces.valance.color }} />
                </div>
                <div className="cart-line-copy">
                  <b>{item.title}</b>
                  <span>Variant: {item.variant} · Qty 1</span>
                  <small>Config ID · {config.configurationId}</small>
                </div>
                <strong>{formatMoney(item.price)}</strong>
              </div>
            ))}
            <div className="cart-properties">
              <span>Line item properties</span>
              <p>
                Configuration ID and structured configuration JSON are attached
                to each mock Shopify cart line.
              </p>
              <button
                className="text-button"
                onClick={() => {
                  clearMockCart();
                  onClear();
                }}
              >
                Clear demo cart
              </button>
            </div>
            <button className="add-cart" onClick={onClose}>
              Continue designing
              <span>
                {formatMoney(
                  cart.reduce((total, item) => total + item.price, 0),
                )}
              </span>
              <Check size={16} />
            </button>
            <p className="mock-note">
              Demo cart only · no live store or payment credentials connected
            </p>
          </>
        )}
      </div>
    </div>
  );
}
