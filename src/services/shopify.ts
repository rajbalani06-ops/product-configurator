import type { PriceBreakdown, ProductConfig } from '../types/config';
export type CartLine = { id: string; title: string; variant: string; price: number; quantity: number; properties: Record<string, string> };
export async function addConfiguredProduct(config: ProductConfig, price: PriceBreakdown): Promise<CartLine> {
  await new Promise(r => setTimeout(r, 350));
  const line: CartLine = { id: crypto.randomUUID(), title: config.productName, variant: config.variant, price: price.total, quantity: 1,
    properties: { Configuration: config.configurationId, Sidewalls: config.sidewalls, 'Half walls': config.halfWalls, 'Configuration JSON': JSON.stringify(config) } };
  const cart = JSON.parse(localStorage.getItem('canopy-mock-cart') || '[]') as CartLine[];
  localStorage.setItem('canopy-mock-cart', JSON.stringify([...cart, line]));
  return line;
}

export function clearMockCart() { localStorage.removeItem('canopy-mock-cart'); }

