// UnoCSS stuff here!
import "virtual:uno.css";

// Svelte stuff here!
import { mount } from "svelte";

// Components here!
import Sonner from "@/components/sonner.svelte";

// App stuff here!
import Editor from "@/app/editor.svelte";
import ImageGen from "@/app/image_gen.svelte";

export default defineContentScript({
  matches: ["https://*.aidungeon.com/*"],
  cssInjectionMode: "ui",
  async main(ctx) {
    debug.log(false, "Content script starting...");
    events.onWake();
    const ui = await createShadowRootUi(ctx, {
      name: "le-ui",
      position: "inline",
      anchor: "body",
      onMount: (container, shadow) => {
        debug.log(false, "Adding fonts to shadow DOM...");
        dom.addFonts(shadow);

        // For the theming.
        settings.subscribe((s) => container.style.setProperty("--le-color-brand", s.developerThemeColor));

        mount(Sonner, { target: container, props: { preset: "dev" } }); // Mount the sonner.
        mount(Editor, { target: container }); // Mount the normal editor.
        mount(ImageGen, { target: container }); // Mount the image generator.
      },
    });
    ui.mount();
    // debug.welcome();
  },
});
