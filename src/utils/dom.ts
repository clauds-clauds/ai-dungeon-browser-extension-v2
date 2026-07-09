import { mount, unmount } from "svelte";
import { Config } from "./config";
import Response from "@/components/response.svelte";
import { Debug } from "./debug";
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

  static isStoryContainer(element: HTMLElement): boolean {
    return element instanceof HTMLSpanElement && element.getAttribute("aria-label")?.startsWith("Story section:") === true;
  }

  static isAction(element: HTMLElement): boolean {
    if (element.id !== "transition-opacity") return false;
    const childSpan = element.querySelector("span[aria-label]") as HTMLElement;
    return childSpan?.getAttribute("aria-label")?.startsWith("Action") === true;
  }

static prettifyButBetter(gameplayOutput: HTMLElement) {
    // 1. Find all relevant elements, piercing through any Alpha <div> wrappers
    const allLastActions = Array.from(gameplayOutput.querySelectorAll<HTMLElement>(Config.SELECTOR_LAST_ACTION));
    
    // Filter out standard actions so they don't overlap with Last Actions
    const allActions = Array.from(gameplayOutput.querySelectorAll<HTMLElement>('span[aria-label^="Action"]'))
      .filter(el => !el.getAttribute("aria-label")?.startsWith("Last action"));
      
    const allStorySections = Array.from(gameplayOutput.querySelectorAll<HTMLElement>('span[aria-label^="Story section:"]'));

    // 2. Apply formatting ONLY to the 2 most recent elements of each type.
    // This perfectly mimics the original extension's memory footprint and prevents scroll-jumping.

    allLastActions.slice(-2).forEach(el => {
      this.mountResponseOn(el, ResponseType.LastAction);
    });

    allActions.slice(-2).forEach(el => {
      this.mountResponseOn(el, ResponseType.Action);
    });

    allStorySections.slice(-2).forEach(section => {
      const storyContainers = section.querySelectorAll<HTMLElement>("span#transition-opacity:not([aria-label]):not(:has(span))");
      storyContainers.forEach(container => {
        this.mountResponseOn(container, ResponseType.Story);
      });
    });
  }

  static cleanup() {
    for (const [element, component] of this.mountedComponents.entries()) {
      unmount(component);
    }
    this.mountedComponents.clear();
  }
}
