import type { PriceBreakdown, ProductConfig } from '../types/config';
const pause = (ms: number) => new Promise(r => setTimeout(r, ms));
export async function quoteConfiguration(config: ProductConfig): Promise<PriceBreakdown> {
  await pause(160);
  const base = 849;
  const variant = config.variant === 'canopy-only' ? -280 : config.variant === 'light-up' ? 390 : 0;
  const sidewallPrices: Record<ProductConfig['sidewalls'], number> = { none: 0, 'one-single': 165, 'three-single': 435, 'one-double': 245, 'three-double': 660 };
  const halfPrices: Record<ProductConfig['halfWalls'], number> = { none: 0, single: 210, double: 285 };
  const options = sidewallPrices[config.sidewalls] + halfPrices[config.halfWalls];
  const printedSurfaces = Object.values(config.surfaces).filter(s => s.artworks.length > 0).length;
  const printing = printedSurfaces * 45 + (config.sidewalls.includes('double') ? 85 : 0);
  const artworkCount = Object.values(config.surfaces).reduce((n, s) => n + s.artworks.length, 0);
  const artwork = artworkCount * 18;
  return { base, variant, options, printing, artwork, total: base + variant + options + printing + artwork };
}
