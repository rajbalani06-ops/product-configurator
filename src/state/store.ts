import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  createInitialConfig,
  type Artwork,
  type ProductConfig,
  type SurfaceId,
} from "../types/config";

type Store = {
  config: ProductConfig;
  activeSurface: SurfaceId;
  selectedArtwork: string | null;
  view: "3d" | "2d";
  setView: (view: "3d" | "2d") => void;
  setSurface: (surface: SurfaceId) => void;
  setColor: (color: string) => void;
  setOption: (
    key: "variant" | "sidewalls" | "halfWalls",
    value: string,
  ) => void;
  addArtwork: (artwork: Artwork) => void;
  updateArtwork: (id: string, patch: Partial<Artwork>) => void;
  removeArtwork: (id: string) => void;
  selectArtwork: (id: string | null) => void;
  resetSurface: () => void;
  resetAll: () => void;
};
export const useConfigurator = create<Store>()(
  persist(
    (set) => ({
      config: createInitialConfig(),
      activeSurface: "roof",
      selectedArtwork: null,
      view: "3d",
      setView: (view) => set({ view }),
      setSurface: (activeSurface) =>
        set({ activeSurface, selectedArtwork: null }),
      setColor: (color) =>
        set((s) => ({
          config: {
            ...s.config,
            surfaces: {
              ...s.config.surfaces,
              [s.activeSurface]: {
                ...s.config.surfaces[s.activeSurface],
                color,
              },
            },
          },
        })),
      setOption: (key, value) =>
        set((s) => ({
          config: { ...s.config, [key]: value } as ProductConfig,
        })),
      addArtwork: (artwork) =>
        set((s) => ({
          config: {
            ...s.config,
            surfaces: {
              ...s.config.surfaces,
              [s.activeSurface]: {
                ...s.config.surfaces[s.activeSurface],
                artworks: [
                  ...s.config.surfaces[s.activeSurface].artworks,
                  artwork,
                ],
              },
            },
          },
          selectedArtwork: artwork.id,
        })),
      updateArtwork: (id, patch) =>
        set((s) => ({
          config: {
            ...s.config,
            surfaces: {
              ...s.config.surfaces,
              [s.activeSurface]: {
                ...s.config.surfaces[s.activeSurface],
                artworks: s.config.surfaces[s.activeSurface].artworks.map(
                  (a) => (a.id === id ? { ...a, ...patch } : a),
                ),
              },
            },
          },
        })),
      removeArtwork: (id) =>
        set((s) => ({
          config: {
            ...s.config,
            surfaces: {
              ...s.config.surfaces,
              [s.activeSurface]: {
                ...s.config.surfaces[s.activeSurface],
                artworks: s.config.surfaces[s.activeSurface].artworks.filter(
                  (a) => a.id !== id,
                ),
              },
            },
          },
          selectedArtwork: null,
        })),
      selectArtwork: (selectedArtwork) => set({ selectedArtwork }),
      resetSurface: () =>
        set((s) => ({
          config: {
            ...s.config,
            surfaces: {
              ...s.config.surfaces,
              [s.activeSurface]: {
                color: s.activeSurface === "valance" ? "#1d403a" : "#e9e4da",
                artworks: [],
              },
            },
          },
          selectedArtwork: null,
        })),
      resetAll: () =>
        set({
          config: createInitialConfig(),
          activeSurface: "roof",
          selectedArtwork: null,
          view: "3d",
        }),
    }),
    {
      name: "canopy-configurator-v1",
      partialize: (s) => ({
        config: s.config,
        activeSurface: s.activeSurface,
        view: s.view,
      }),
    },
  ),
);
