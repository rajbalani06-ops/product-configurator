export type SurfaceId = 'roof' | 'valance' | 'left' | 'right' | 'back';
export type Artwork = {
  id: string;
  kind: 'text' | 'image';
  text?: string;
  src?: string;
  fileName?: string;
  color: string;
  fontSize: number;
  x: number;
  y: number;
  scale: number;
  rotation: number;
};
export type SurfaceCustomization = { color: string; artworks: Artwork[] };
export type ProductConfig = {
  productId: string;
  productName: string;
  configurationId: string;
  variant: 'frame' | 'canopy-only' | 'light-up';
  sidewalls: 'none' | 'one-single' | 'three-single' | 'one-double' | 'three-double';
  halfWalls: 'none' | 'single' | 'double';
  surfaces: Record<SurfaceId, SurfaceCustomization>;
};
export type PriceBreakdown = { base: number; variant: number; options: number; printing: number; artwork: number; total: number };
export const SURFACES: { id: SurfaceId; label: string; icon: string }[] = [
  { id: 'roof', label: 'Roof top', icon: '⌃' }, { id: 'valance', label: 'Front valance', icon: '▱' },
  { id: 'left', label: 'Left side', icon: '◧' }, { id: 'right', label: 'Right side', icon: '◨' }, { id: 'back', label: 'Back panel', icon: '▰' },
];
export const createInitialConfig = (): ProductConfig => ({
  productId: 'canopy-10x10', productName: '10×10 Logo Canopy Tent', configurationId: `CAN-${new Date().getFullYear()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
  variant: 'frame', sidewalls: 'none', halfWalls: 'none',
  surfaces: { roof: { color: '#e9e4da', artworks: [] }, valance: { color: '#1d403a', artworks: [] }, left: { color: '#e9e4da', artworks: [] }, right: { color: '#e9e4da', artworks: [] }, back: { color: '#e9e4da', artworks: [] } },
});
