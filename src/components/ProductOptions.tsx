import { PenTool } from "lucide-react";
import { SURFACES, type ProductConfig, type SurfaceId } from "../types/config";

type ProductOptionKey = "variant" | "sidewalls" | "halfWalls";

type Props = {
  config: ProductConfig;
  activeSurface: SurfaceId;
  onSetColor: (color: string) => void;
  onSetOption: (key: ProductOptionKey, value: string) => void;
  onOpenEditor: () => void;
};

const colors = [
  "#e9e4da",
  "#1d403a",
  "#132f55",
  "#cc482e",
  "#f4bd32",
  "#aebcb2",
  "#d6c4a5",
  "#242b2a",
  "#ffffff",
  "#d98258",
];

const variants = [
  {
    value: "frame",
    title: "Canopy + frame",
    description: "Classic aluminum frame",
    price: "849",
  },
  {
    value: "canopy-only",
    title: "Canopy only",
    description: "Fabric top, no frame",
    price: "569",
  },
  {
    value: "light-up",
    title: "Light-up frame",
    description: "Integrated LED frame",
    price: "1,239",
  },
];

export function ProductOptions({
  config,
  activeSurface,
  onSetColor,
  onSetOption,
  onOpenEditor,
}: Props) {
  const activeSurfaceLabel = SURFACES.find(
    (surface) => surface.id === activeSurface,
  )?.label;

  return (
    <>
      <section className="option-card">
        <div className="option-card-heading">
          <span className="eyebrow">BUILD YOUR CANOPY</span>
          <span className="step-number">
            01 <i>/ 03</i>
          </span>
        </div>
        <h2>Choose your setup</h2>
        <p className="subtle">
          Start with your frame, then make it unmistakably yours.
        </p>

        <div className="control-group">
          <label className="control-label">Canopy package</label>
          <div className="choice-list">
            {variants.map((variant) => (
              <button
                key={variant.value}
                className={`choice-row ${config.variant === variant.value ? "checked" : ""}`}
                onClick={() => onSetOption("variant", variant.value)}
              >
                <span className="radio-dot" />
                <span className="choice-copy">
                  <b>{variant.title}</b>
                  <small>{variant.description}</small>
                </span>
                <strong>${variant.price}</strong>
              </button>
            ))}
          </div>
        </div>

        <div className="control-group">
          <div className="label-line">
            <label className="control-label">Printed side walls</label>
            <span className="optional-tag">OPTIONAL</span>
          </div>
          <select
            value={config.sidewalls}
            onChange={(event) => onSetOption("sidewalls", event.target.value)}
          >
            <option value="none">None</option>
            <option value="one-single">1 wall · single sided (+$165)</option>
            <option value="three-single">3 walls · single sided (+$435)</option>
            <option value="one-double">1 wall · double sided (+$245)</option>
            <option value="three-double">3 walls · double sided (+$660)</option>
          </select>
        </div>

        <div className="control-group">
          <div className="label-line">
            <label className="control-label">Half walls · set of 2</label>
            <span className="optional-tag">OPTIONAL</span>
          </div>
          <select
            value={config.halfWalls}
            onChange={(event) => onSetOption("halfWalls", event.target.value)}
          >
            <option value="none">None</option>
            <option value="single">Single sided (+$210)</option>
            <option value="double">Double sided (+$285)</option>
          </select>
        </div>
      </section>

      <section className="option-card customization-card">
        <div className="option-card-heading">
          <span className="eyebrow">SURFACE FINISH</span>
          <span className="step-number">
            02 <i>/ 03</i>
          </span>
        </div>
        <h2>Set your colors</h2>
        <p className="subtle">
          Editing <strong>{activeSurfaceLabel}</strong>. Other panels stay
          independent.
        </p>
        <div className="swatch-row">
          {colors.map((color) => (
            <button
              aria-label={`Set ${color}`}
              key={color}
              onClick={() => onSetColor(color)}
              className={`color-swatch ${config.surfaces[activeSurface].color === color ? "swatch-selected" : ""}`}
              style={{ background: color }}
            />
          ))}
          <label className="custom-color" title="Custom color">
            <input
              type="color"
              value={config.surfaces[activeSurface].color}
              onChange={(event) => onSetColor(event.target.value)}
            />
            ＋
          </label>
        </div>
        <div className="current-color">
          <span
            className="current-color-box"
            style={{ background: config.surfaces[activeSurface].color }}
          />
          {config.surfaces[activeSurface].color.toUpperCase()}{" "}
          <span>· custom finish</span>
        </div>
        <div className="soft-divider" />
        <div className="editor-shortcut">
          <div className="mini-icon">
            <PenTool size={17} />
          </div>
          <div>
            <b>Add your logo or message</b>
            <small>Upload artwork, add editable text</small>
          </div>
          <button onClick={onOpenEditor}>
            Open editor <span>↗</span>
          </button>
        </div>
      </section>
    </>
  );
}
