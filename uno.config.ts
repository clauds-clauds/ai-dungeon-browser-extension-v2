import { defineConfig, presetWind4, presetAttributify } from "unocss";
import extractorSvelte from "@unocss/extractor-svelte";
import { presetAnimations } from "unocss-preset-animations";

export default defineConfig({
  theme: {
    font: {
      plex: "'LePlex Sans', sans-serif",
      symbol: "'LeMaterial Symbols'",
    },
    colors: {
      mono: {
        0: "#000",
        100: "#1b1f22",
        200: "#272c30",
        300: "#2f3539",
        400: "#3a4045",
        500: "#4c535a",
        600: "#586067",
        700: "#666d75",
        800: "#828a92",
        900: "#fff",
        subtle: "#e0f0ff94",
      },
      pretty: {
        pink: "#d42dc3",
        purple: "#7538c2",
        blue: "#317dea",
        green: "#1fb085",
        yellow: "#f8ae2c",
        orange: "#f85d2c",
        red: "#f3194d",
        brand: "var(--le-color-brand, #f8ae2c)",
      },
      surface: {
        DEFAULT: "var(--surface-bg, #1b1f22)",
        out: "var(--surface-border, #272c30)",
      },
    },
    animation: {
      keyframes: {
        breathe: "{0%,100%{transform:scale(1);}50%{transform:scale(1.96);opacity:0.16}}",
      },
      counts: {
        breathe: "infinite",
      },
    },
  },
  shortcuts: {
    attention: "hover:brightness-[116%]",
    "surface-raised": "[--surface-bg:#2f3539] [--surface-border:#3a4045]",
  },
  presets: [presetWind4(), presetAnimations(), presetAttributify()],
  extractors: [extractorSvelte()],
});
