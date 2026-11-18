import { jsPDF } from "jspdf";
import type { PriceBreakdown, ProductConfig } from "../types/config";
export function generateSummary(config: ProductConfig, price: PriceBreakdown) {
  const pdf = new jsPDF({ unit: "pt", format: "a4" });
  const w = pdf.internal.pageSize.getWidth();
  pdf.setFillColor(29, 64, 58);
  pdf.rect(0, 0, w, 94, "F");
  pdf.setTextColor(255, 255, 255);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(18);
  pdf.text("CANOPY / STUDIO", 42, 42);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(10);
  pdf.text("CONFIGURATION SUMMARY", 42, 63);
  pdf.setTextColor(28, 39, 34);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(22);
  pdf.text(config.productName, 42, 132);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(10);
  pdf.text(`Configuration ID  ${config.configurationId}`, 42, 155);
  pdf.text(`Prepared  ${new Date().toLocaleDateString()}`, 42, 171);
  pdf.setFillColor(241, 240, 235);
  pdf.roundedRect(42, 195, w - 84, 156, 10, 10, "F");
  pdf.setFillColor(233, 228, 218);
  pdf.rect(78, 222, 190, 12, "F");
  pdf.setFillColor(29, 64, 58);
  pdf.rect(78, 238, 190, 27, "F");
  pdf.setTextColor(255, 255, 255);
  pdf.setFont("helvetica", "bold");
  pdf.text("YOUR BRAND", 137, 257);
  pdf.setTextColor(28, 39, 34);
  pdf.setFontSize(9);
  pdf.setFont("helvetica", "normal");
  pdf.text("2D surface concept", 78, 289);
  let y = 386;
  const row = (label: string, value: string) => {
    pdf.setTextColor(35, 45, 40);
    pdf.text(label, 48, y);
    pdf.text(value, w - 48, y, { align: "right" });
    pdf.setDrawColor(228, 228, 222);
    pdf.line(42, y + 9, w - 42, y + 9);
    y += 25;
  };
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(12);
  pdf.text("PRODUCT & OPTIONS", 42, 373);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(10);
  row("Package", config.variant);
  row("Printed side walls", config.sidewalls);
  row("Half walls", config.halfWalls);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(12);
  pdf.text("SURFACE FINISHES", 42, y + 2);
  y += 25;
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(10);
  for (const [id, s] of Object.entries(config.surfaces)) {
    row(
      `${id[0].toUpperCase() + id.slice(1)} · ${s.color.toUpperCase()}`,
      s.artworks.length ? `${s.artworks.length} artwork item(s)` : "No artwork",
    );
    for (const art of s.artworks) {
      if (art.kind === "text") row("  Text", art.text || "");
      else row("  Uploaded file", art.fileName || "Artwork image");
    }
  }
  y += 4;
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(12);
  pdf.text("PRICE BREAKDOWN", 42, y);
  y += 23;
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(10);
  row("Canopy base", `$${price.base.toFixed(2)}`);
  if (price.variant) row("Variant adjustment", `$${price.variant.toFixed(2)}`);
  if (price.options) row("Wall options", `$${price.options.toFixed(2)}`);
  if (price.printing) row("Printing", `$${price.printing.toFixed(2)}`);
  if (price.artwork) row("Artwork preparation", `$${price.artwork.toFixed(2)}`);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(15);
  pdf.text("Estimated total", 48, y + 7);
  pdf.text(`$${price.total.toFixed(2)}`, w - 48, y + 7, { align: "right" });
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(8);
  pdf.setTextColor(120, 125, 120);
  pdf.text(
    "Prepared for production review. Artwork placement shown as a design reference.",
    42,
    790,
  );
  pdf.save(`${config.configurationId}-summary.pdf`);
}
