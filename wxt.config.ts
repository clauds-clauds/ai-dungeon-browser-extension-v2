import { defineConfig } from "wxt";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  srcDir: "src",
  modules: ["@wxt-dev/module-svelte"],
  manifest: {
    name: "Dungeon Extension v2",
    permissions: ["storage", "unlimitedStorage"],
    description: "An extension that enhances AI Dungeon with new features (TESTING).",
    version: "1.0.0",
    web_accessible_resources: [{ resources: ["fonts/*"], matches: ["*://*.play.aidungeon.com/*"] }],
  },
  vite: () => ({
    plugins: [tailwindcss()],
  }),
});
