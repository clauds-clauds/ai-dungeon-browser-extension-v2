import { mount, unmount } from "svelte";
import { Config } from "./config";
import Response from "@/components/response.svelte";
import { ResponseType } from "./types";

export class DOM {
  private static mountedComponents = new Map<HTMLElement, ReturnType<typeof mount>>();

  static injectButton() {
    if (document.getElementById(Config.ID_EDITOR_BUTTON)) return;
    const baseButton = document.querySelector(Config.SELECTOR_EXIT_BUTTON);
    if (!baseButton) return;

    const button = baseButton.cloneNode(true) as HTMLElement;
    button.id = Config.ID_EDITOR_BUTTON;
    (button.querySelector("div > span") as HTMLElement).innerText = "w_wrench";
    (button.querySelector(":scope > span") as HTMLElement).innerText = "Editor";
    button.addEventListener("click", (e) => {
      extensionState.isEditorOpen = true;
    });
    baseButton.parentElement?.insertBefore(button, baseButton);
  }

  static mountResponseOn(element: HTMLElement, type: ResponseType) {
    // Check if the elemnt is already altered.
    if (element.hasAttribute(Config.ATTRIBUTE_ALTERED)) return;

    // Handling for the last actions:
    if (type === ResponseType.LastAction) {
      // The last action always has a span inside it with the actual text.
      const original = element.firstElementChild as HTMLElement;

      if (original) {
        if (original.querySelector(".word-fade")) {
          console.warn(
            "[Dungeon Extension v2] Detected text animation... skipping for now... this might cause issues in the future.\n\nTo disable text animations navigate to: Gameplay > Appearance > Accessibility > Text Animation"
          );
          return;
        }

        // Clone the original first before hiding it.
        const originalClone = original.cloneNode(true) as HTMLElement;
        original.style.display = "none";

        // Then we can mount our Svelte component.
        const component = mount(Response, {
          target: element,
          anchor: original,
          props: { rawHtml: originalClone.innerHTML, type: type },
        });

        this.mountedComponents.set(element, component);
      }
    }

    // Story response types are very tricky. You can't simply hide the first child elements because they do not have any. They're just spans with text inside.
    if (type === ResponseType.Story) {
      const originalHtml = element.innerHTML; // Grab the inner HTML directly.
      element.innerHTML = ""; // Clear the old unstyled stuff.
      const component = mount(Response, {
        target: element,
        props: { rawHtml: originalHtml, type: type },
      });
      this.mountedComponents.set(element, component);
    }

    if (type === ResponseType.Action) {
      const original = element.firstElementChild as HTMLElement;
      if (original) {
        // Clone the original first before hiding it.
        const originalClone = original.cloneNode(true) as HTMLElement;
        original.style.display = "none";
        const component = mount(Response, {
          target: element,
          anchor: original,
          props: { rawHtml: originalClone.innerHTML, type: type },
        });
        this.mountedComponents.set(element, component);
      }
    }

    element.setAttribute(Config.ATTRIBUTE_ALTERED, "true");
  }

  static prettifyButBetter(gameplayOutput: HTMLElement) {
    // AI Dungeon keeps restructuring the gameplay DOM (extra wrapper divs, per-section wrappers,
    // moved aria-labels...), so we no longer rely on a fixed parent/sibling shape. Every piece of
    // renderable text (story paragraphs, the last action, and player actions) lives in a
    // "span#transition-opacity" element that has an element first child holding the actual text.
    // We simply find all of them anywhere under #gameplay-output and mount on each. mountResponseOn
    // is idempotent (guarded by ATTRIBUTE_ALTERED), so re-running on every mutation is safe and cheap.

    // AI Dungeon virtualizes the story list: older sections get removed from the DOM as you scroll.
    // Drop any component whose element is no longer connected before mounting the current ones.
    this.pruneDetached();

    const containers = gameplayOutput.querySelectorAll<HTMLElement>(Config.SELECTOR_RESPONSE);

    containers.forEach((container) => {
      // Must have an element first child; that inner span is what mountResponseOn hides & renders.
      if (!container.firstElementChild) return;

      const ariaLabel = container.getAttribute("aria-label") ?? "";

      // The newest response is the "Last action:" one. It needs the LastAction type so the <Focus>
      // component renders above it. Everything else (older story paragraphs and player actions)
      // uses the Action type, which is the same non-destructive clone-and-hide mount path.
      const type = ariaLabel.startsWith("Last action:") ? ResponseType.LastAction : ResponseType.Action;

      this.mountResponseOn(container, type);
    });
  }

  // Unmounts and drops any tracked component whose element has been detached from the document
  // (e.g. AI Dungeon virtualized away an old story section). Prevents a session-long memory leak
  // of detached DOM nodes and their Svelte components.
  static pruneDetached() {
    for (const [element, component] of this.mountedComponents.entries()) {
      if (element.isConnected) continue;
      unmount(component);
      // Clear the altered marker so this node is re-mounted cleanly if it ever reconnects.
      element.removeAttribute(Config.ATTRIBUTE_ALTERED);
      this.mountedComponents.delete(element);
    }
  }

  static cleanup() {
    for (const [element, component] of this.mountedComponents.entries()) {
      unmount(component);
    }
    this.mountedComponents.clear();
  }
}
