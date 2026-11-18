import { RotateCcw, ShoppingBag } from "lucide-react";
import type { MouseEvent } from "react";

type Props = {
  cartCount: number;
  onReset: () => void;
  onOpenCart: () => void;
  onToggleEmbed: () => void;
  onReturnHome: (event: MouseEvent<HTMLAnchorElement>) => void;
};

export function SiteHeader({
  cartCount,
  onReset,
  onOpenCart,
  onToggleEmbed,
  onReturnHome,
}: Props) {
  return (
    <header className="topbar">
      <a className="brand" href="/" onClick={onReturnHome}>
        <span className="brand-mark">C</span>
        <span>
          CANOPY<span className="brand-light"> / STUDIO</span>
        </span>
      </a>
      <nav>
        <a className="nav-active">Configurator</a>
        <a href="#details">Details</a>
        <button className="embed-link" onClick={onToggleEmbed}>
          Embed preview ↗
        </button>
      </nav>
      <div className="header-actions">
        <button className="icon-button" title="Reset all" onClick={onReset}>
          <RotateCcw size={17} />
        </button>
        <button className="cart-button" onClick={onOpenCart}>
          <ShoppingBag size={16} /> <span>Cart</span>
          <b>{cartCount}</b>
        </button>
      </div>
    </header>
  );
}
