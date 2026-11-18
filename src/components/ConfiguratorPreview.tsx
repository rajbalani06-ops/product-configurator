import { Box, Check, PenTool } from "lucide-react";
import { lazy, Suspense } from "react";
import { Editor2D } from "./Editor2D";
import { SURFACES, type ProductConfig, type SurfaceId } from "../types/config";

const TentPreview = lazy(() =>
  import("./TentPreview").then((module) => ({ default: module.TentPreview })),
);

type Props = {
  config: ProductConfig;
  activeSurface: SurfaceId;
  view: "2d" | "3d";
  onChangeView: (view: "2d" | "3d") => void;
  onSelectSurface: (surface: SurfaceId) => void;
  onResetSurface: () => void;
};

export function ConfiguratorPreview({
  config,
  activeSurface,
  view,
  onChangeView,
  onSelectSurface,
  onResetSurface,
}: Props) {
  return (
    <section className="preview-column">
      <div className="visual-card">
        <div className="visual-topline">
          <div>
            <span className="eyebrow">LIVE PRODUCT VIEW</span>
            <h2>10 × 10 Logo Canopy Tent</h2>
          </div>
          <div className="view-switch">
            <button
              className={view === "3d" ? "selected" : ""}
              onClick={() => onChangeView("3d")}
            >
              <Box size={15} /> 3D
            </button>
            <button
              className={view === "2d" ? "selected" : ""}
              onClick={() => onChangeView("2d")}
            >
              <PenTool size={15} /> 2D
            </button>
          </div>
        </div>
        {view === "3d" ? (
          <Suspense
            fallback={
              <div className="preview-loading">
                Loading interactive 3D preview…
              </div>
            }
          >
            <TentPreview />
          </Suspense>
        ) : (
          <Editor2D />
        )}
        <div className="preview-footer">
          <div className="finish-status">
            <span
              className="finish-swatch"
              style={{ background: config.surfaces[activeSurface].color }}
            />
            <span>
              <b>{activeSurface.toUpperCase()}</b>
              <small>Surface finish</small>
            </span>
          </div>
          <div className="view-caption">
            <span className="tiny-pulse" /> Changes update live
          </div>
        </div>
      </div>

      <div className="surface-section">
        <div className="section-heading compact">
          <div>
            <span className="eyebrow">CUSTOMIZE BY SURFACE</span>
            <h2>Every panel, considered.</h2>
          </div>
          <button className="text-button" onClick={onResetSurface}>
            Reset this surface
          </button>
        </div>
        <div className="surface-grid">
          {SURFACES.map((surface) => (
            <button
              key={surface.id}
              className={`surface-choice ${activeSurface === surface.id ? "active" : ""}`}
              onClick={() => onSelectSurface(surface.id)}
            >
              <span
                className={`surface-thumb thumb-${surface.id}`}
                style={
                  {
                    "--surface-color": config.surfaces[surface.id].color,
                  } as React.CSSProperties
                }
              >
                {surface.icon}
              </span>
              <span className="surface-label">{surface.label}</span>
              {config.surfaces[surface.id].artworks.length > 0 && (
                <span className="surface-check">
                  <Check size={11} />
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {view === "3d" && (
        <div className="editor-card editor-inline">
          <Editor2D />
        </div>
      )}
    </section>
  );
}
