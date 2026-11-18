import { useEffect, useState } from "react";
import { useConfigurator } from "./state/store";
import type { PriceBreakdown } from "./types/config";
import type { CartLine } from "./services/shopify";
import { addConfiguredProduct } from "./services/shopify";
import { quoteConfiguration } from "./services/pricing";
import { CartDrawer } from "./components/CartDrawer";
import { ConfiguratorPreview } from "./components/ConfiguratorPreview";
import { PriceSummary } from "./components/PriceSummary";
import { ProductDetails, SiteFooter } from "./components/ProductDetails";
import { ProductIntro } from "./components/ProductIntro";
import { ProductOptions } from "./components/ProductOptions";
import { SiteHeader } from "./components/SiteHeader";
import "./style.css";

const emptyPrice: PriceBreakdown = {
  base: 849,
  variant: 0,
  options: 0,
  printing: 0,
  artwork: 0,
  total: 849,
};

function App() {
  const {
    config,
    activeSurface,
    setSurface,
    setColor,
    setOption,
    view,
    setView,
    resetSurface,
    resetAll,
  } = useConfigurator();
  const [price, setPrice] = useState(emptyPrice);
  const [cart, setCart] = useState<CartLine[]>(() =>
    JSON.parse(localStorage.getItem("canopy-mock-cart") || "[]"),
  );
  const [cartOpen, setCartOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [embed, setEmbed] = useState(location.pathname.startsWith("/embed"));

  useEffect(() => {
    let isCurrent = true;
    quoteConfiguration(config).then((nextPrice) => {
      if (isCurrent) setPrice(nextPrice);
    });
    return () => {
      isCurrent = false;
    };
  }, [config]);

  useEffect(() => {
    const handlePopState = () => {
      setEmbed(location.pathname.startsWith("/embed"));
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const changeEmbedMode = () => {
    const nextEmbedMode = !embed;
    history.pushState({}, "", nextEmbedMode ? "/embed" : "/");
    setEmbed(nextEmbedMode);
  };

  const returnHome = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    history.pushState({}, "", "/");
    setEmbed(false);
  };

  const addToCart = async () => {
    setLoading(true);
    try {
      const line = await addConfiguredProduct(config, price);
      setCart((currentCart) => [...currentCart, line]);
      setCartOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const saveConfiguration = () => {
    localStorage.setItem("canopy-config-saved", JSON.stringify(config));
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1800);
  };

  const openEditor = () => {
    setView("2d");
    document
      .querySelector(".editor-card")
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const resetConfiguration = () => {
    if (window.confirm("Reset the full configuration?")) resetAll();
  };

  return (
    <div className={`app-shell ${embed ? "embed-mode" : ""}`}>
      {!embed && (
        <SiteHeader
          cartCount={cart.length}
          onReset={resetConfiguration}
          onOpenCart={() => setCartOpen(true)}
          onToggleEmbed={changeEmbedMode}
          onReturnHome={returnHome}
        />
      )}
      <main className="page-wrap">
        {!embed && <ProductIntro />}
        <div className="config-layout">
          <ConfiguratorPreview
            config={config}
            activeSurface={activeSurface}
            view={view}
            onChangeView={setView}
            onSelectSurface={setSurface}
            onResetSurface={resetSurface}
          />
          <aside className="options-column">
            <ProductOptions
              config={config}
              activeSurface={activeSurface}
              onSetColor={setColor}
              onSetOption={setOption}
              onOpenEditor={openEditor}
            />
            <PriceSummary
              config={config}
              price={price}
              loading={loading}
              saved={saved}
              onAddToCart={addToCart}
              onSave={saveConfiguration}
            />
          </aside>
        </div>
        <ProductDetails />
      </main>
      {!embed && <SiteFooter onToggleEmbed={changeEmbedMode} />}
      {cartOpen && (
        <CartDrawer
          cart={cart}
          config={config}
          onClose={() => setCartOpen(false)}
          onClear={() => setCart([])}
        />
      )}
    </div>
  );
}

export default App;
