# Canopy / Studio — Product Configurator

A responsive React configurator for a custom 10 × 10 logo canopy. It combines per-surface artwork editing, a rotatable Three.js model, a mock pricing service, a local mock Shopify cart, and a downloadable PDF production summary.

## Stack

- React 19, TypeScript, Vite
- Zustand with local storage persistence
- Three.js, React Three Fiber and Drei for the interactive model
- Native pointer based 2D editor (no canvas framework required for the included text/image tools)
- jsPDF for production summaries
- Lucide React icons
- Prettier for consistent source formatting

## Run locally

```bash
npm install
npm run dev
```

Open the local URL printed by Vite. Use `npm run format` to format source files, `npm run build` to create a production build, and `npm run preview` to serve that build.

## Architecture

```text
src/
  components/   focused page sections, controls, editor and 3D preview
  services/     mock pricing and Shopify cart adapters
  state/        shared Zustand configuration store
  types/        product, surface and artwork models
  utils/        formatting and PDF generation
  App.tsx       app state and page composition
  style.css     responsive product configurator styles
```

`ProductConfig` in `src/types/config.ts` is the shared source of truth. It contains product and configuration IDs, selected frame package, wall options, and a customization record for `roof`, `valance`, `left`, `right`, and `back`. Each surface holds its own fabric color and artwork array. Artwork stores text or uploaded image metadata, color, font size, normalized position, scale, and rotation. Zustand actions update one surface at a time; the store persists the current design in local storage.

## Editing and 3D synchronization

Choose a surface in the surface strip, then edit its color and artwork. The 2D editor supports adding editable text, uploading raster/vector image files, selecting and dragging an object, changing text, color, scale, font size and rotation. Design coordinates use percentages relative to the selected panel, so each surface retains independent state when switching. The 3D scene reads the same store and applies each surface's colors and design textures to its canopy/panels. The frame uses four corner legs, perimeter rails, and short roof supports tucked below the fabric. OrbitControls support pointer rotation and wheel zoom.

The editor uses normal browser image decoding and data URLs, keeping uploaded files local to the browser. For a production app, upload originals to object storage and store durable asset URLs instead of data URLs.

## Pricing service

`src/services/pricing.ts` exposes `quoteConfiguration(config)`, an asynchronous API-shaped function. It returns base price, variant adjustment, wall options, printing, artwork preparation and total. The UI requests a new quote when configuration changes and renders a line-by-line estimate. Replace this module with a fetch call to a pricing endpoint without changing the UI contract. Prices are illustrative assessment values.

## Shopify mock

`src/services/shopify.ts` exposes `addConfiguredProduct(config, price)`. It records a mock cart line in local storage, including the selected variant, quoted price, configuration ID, wall options and serialized configuration as line-item properties. No store or credentials are connected. To move to Shopify, replace this adapter with Storefront API cart creation, use a real Shopify variant ID, and send permitted line item attributes or a durable configuration reference. Shopify generally owns product variant pricing; a client-side quote should be validated server-side before checkout.

## PDF summary

“Download spec sheet” creates a PDF containing product/configuration IDs, date, variant and options, each panel's color and artwork details, a simple 2D surface concept, and the price breakdown. The configuration ID is suitable for later association with an order; a real integration should persist the full JSON and artwork assets with that ID.

## Iframe embedding

The `/embed` route removes site navigation/footer and keeps the responsive configurator. Example:

```html
<iframe
  src="https://your-domain.example/embed"
  title="Configure a 10 × 10 logo canopy"
  style="width:100%;min-height:1100px;border:0"
  loading="lazy"
></iframe>
```

For a production domain, configure the host's `Content-Security-Policy: frame-ancestors` to allow the intended embedding origins. This local Vite app is same-origin permissive in development.

## Limitations

- The reference store shows an $849 starting price and package/sidewall choices; this build models those choices with illustrative service prices, not the store's live commerce rules.
- The mock cart does not create a real Shopify checkout or reserve production pricing.
- The 3D model is an assessment-grade geometric approximation. Textures are designed for visual placement preview; it is not a manufacturing CAD file.
- Uploaded artwork is browser-local and stored with the configuration in local storage. Large uploads can exceed browser storage limits; use object storage for production.
- PDF includes a simplified 2D visual rather than a rendered screenshot of the 3D scene.
- Image placement in the 3D texture is best-effort for local preview; final proofing should use a production artwork renderer.

## Replacing the mock integrations

Keep the existing service interfaces and replace their implementations: connect `quoteConfiguration` to a trusted pricing API, `addConfiguredProduct` to Shopify Storefront API, and uploaded artwork handling to authenticated object storage. Persist the configuration JSON under the configuration ID and attach that ID to the Shopify order for production retrieval.
