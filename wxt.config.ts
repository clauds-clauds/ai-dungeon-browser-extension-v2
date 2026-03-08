import { defineConfig } from "wxt";

// See https://wxt.dev/api/config.html
export default defineConfig({
  srcDir: "src",
  modules: ["@wxt-dev/module-svelte", "@wxt-dev/unocss"],
  manifest: {
    name: "Dungeon Extension V3",
    description: "Customize your AI Dungeon experience with fancy colors, icons and more!",
    version: "0.1.2",
    permissions: ["storage", "unlimitedStorage"],
    web_accessible_resources: [
      {
        resources: ["fonts/*"],
        matches: ["https://*.aidungeon.com/*"],
      },
    ],
    browser_specific_settings: {
      gecko: {
        id: "dungeon-extension-v3@clauds.dev",
        // @ts-expect-error
        data_collection_permissions: {
          required: ["none"],
        },
      },
    },
  },
  webExt: {
    disabled: true,
  },
});
