import { Truck } from "lucide-react";

export function ProductIntro() {
  return (
    <>
      <div className="breadcrumb">
        <span>Home</span>
        <span>/</span>
        <span>Custom canopies</span>
        <span>/</span>
        <b>10 × 10</b>
      </div>
      <div className="intro-row">
        <div>
          <div className="product-kicker">
            <span className="live-dot" /> MADE FOR YOUR BRAND{" "}
            <span className="divider">/</span> CONFIGURATOR
          </div>
          <h1>
            Make it <em>yours.</em>
          </h1>
          <p className="intro-copy">
            A canopy that carries your brand from the first set-up to the last
            light.
          </p>
        </div>
        <div className="lead-time">
          <span className="lead-icon">
            <Truck size={17} />
          </span>
          <div>
            <strong>Ready in 2 business days</strong>
            <small>Free layout · No setup fees</small>
          </div>
        </div>
      </div>
    </>
  );
}
