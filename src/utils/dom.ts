// Imports here!
import { mount } from "svelte";
import { ActionType } from "./types";
import Action from "@/components/ai_dungeon/action.svelte";
import { isMobile } from "./hooks/is_mobile.svelte";

/**
 * Empty for now...
 */
class LEDom {
  addFonts(shadow: ShadowRoot) {
    // Get the shadow head.
    const head = shadow.querySelector("head");
    if (!head) return;

    // Get font URLs.
    const plexUrl = browser.runtime.getURL("/fonts/plex_sans.ttf");
    const iconUrl = browser.runtime.getURL("/fonts/material_symbols.ttf");

    // Create style thingy.
    const fontStyle = document.createElement("style");
    fontStyle.id = "le-font-style";

    // Set content.
    fontStyle.textContent = `
        @font-face { font-family: 'LePlex Sans'; src: url('${plexUrl}') format('truetype'); }
        @font-face { font-family: 'LeMaterial Symbols'; src: url('${iconUrl}') format('truetype'); font-variation-settings: "FILL" 1; }
    `;

    // Append to document head.
    document.head.appendChild(fontStyle);

    // Create another style for the shadow DOM.
    const shadowStyle = document.createElement("style");
    shadowStyle.textContent = `
      body { all: initial; font-family: 'Le Plex Sans', sans-serif; color: #fff; }
    `;

    // Append to shadow head.
    head.appendChild(shadowStyle);

    // Finally, inject UnoCSS styles.
    // I do not know if this is super safe, I'll have to debug that later.
    // So far I haven't seen any issues.
    this.#addUno();
  }

  #addUno() {
    if (document.getElementById("le-uno-styles")) return;
    const cssUrl = chrome.runtime.getURL("/content-scripts/content.css");
    const link = document.createElement("link");
    link.id = "le-uno-styles";
    link.rel = "stylesheet";
    link.href = cssUrl;
    document.head.appendChild(link);
  }

  #addButton(id: string, icon: string, label: string, onclick?: () => void) {
    if (document.getElementById(id)) return; // Button already exists.
    const baseButton = query.exitButton(); // Find the exit button to anchor to.
    if (!baseButton) return; // Exit button not found.

    // Clone the exit button.
    const button = baseButton.cloneNode(true) as HTMLElement;
    button.id = id; // Set our ID thingy.
    (button.querySelector("p") as HTMLElement).innerText = icon; // Set icon.
    (button.querySelector("span") as HTMLElement).innerText = label; // Set label.
    button.addEventListener("click", () => {
      onclick?.();
    }); // Add clicky stuff.
    baseButton.parentElement?.insertBefore(button, baseButton); // Add to DOM.
  }

  addButtons() {
    if (!isMobile.current) {
      // Button for the custom image generation UI.
      this.#addButton("le-image-editor-button", "w_image", "Image Gen", () => {
        imageGenerationState.open = true;
        debug.log(true, "You opened the image generation UI!");
      });
    }

    // Button for the custom editor UI.
    this.#addButton("le-editor-button", "w_wrench", "Editor", () => {
      debug.log(true, "You opened the editor!");
      editorState.open = true;
    });
  }

  addDevButton() {
    if (document.getElementById("le-dev-button")) return; // Button already exists.
    const baseButton = query.notificationsButton()?.parentElement; // Find the notifications button to base this on.
    if (!baseButton) return; // Rewards button not found.

    // Copy the parent element.
    const button = baseButton.cloneNode(true) as HTMLElement;
    button.id = "le-dev-button"; // Set our ID thingy again.
    (button.querySelector("p") as HTMLElement).innerText = "w_open_book"; // Set icon.

    // Insert it before the rewards button.
    baseButton.parentElement?.insertBefore(button, baseButton);
  }

  /**
   * Checks whether an element has already been prettified before.
   * @param element The element to check.
   * @returns Whether the element is marked as prettified.
   */
  isMarked(element: HTMLElement): boolean {
    return element.getAttribute("data-le-marked") === "true";
  }

  /**
   * Clones the content of an element and hides the original so that React does not get angry with me.
   * @param content The content to clone.
   * @returns The cloned content.
   */
  cloneContent(content: HTMLElement): HTMLElement {
    const clone = content.cloneNode(true) as HTMLElement;
    content.style.display = "none";
    return clone;
  }

  /**
   * Checks if an element is a story section.
   * @param element The element to check.
   * @returns Whether the element is a story section, mind blown, right?
   */
  isStorySection(element: HTMLElement): boolean {
    return element instanceof HTMLSpanElement && (element.getAttribute("aria-label")?.startsWith("Story section") ?? false);
  }

  /**
   * Checks whether an element is an action element.
   * @param element The element to check.
   * @returns Whether the element is an action element.
   */
  isAction(element: HTMLElement): boolean {
    if (element.id !== "transition-opacity") return false;
    const childSpan = element.querySelector("span[aria-label]") as HTMLElement;
    return childSpan?.getAttribute("aria-label")?.startsWith("Action") === true;
  }

  /**
   * Checks whether the `Text Animation` toggle is on, because if it is then we need to wait before prettifying.
   * @param element The element to check for those flags.
   * @returns Whether the element content is animated.
   */
  isAnimated(element: HTMLElement): boolean {
    return element.querySelector(".word-fade") !== null;
  }

  /**
   *
   * @param element
   * @param type
   * @returns
   */
  mountActionOn(element: HTMLElement, type: ActionType) {
    // Check if the action has already been prettified.
    if (this.isMarked(element)) return;

    // Now do stuff based on the action type.
    // I do not use a switch here because those things are ugly, yuckabees.
    if (type === ActionType.Last) {
      // Grab the first element.
      const content = element.firstElementChild as HTMLElement;

      // Return if there is no content.
      if (!content) return;

      // Check if the text animation stuff is there, if so then we need to wait.
      // Otherwise React will freak out and destroy the world or something.
      if (this.isAnimated(content)) {
        debug.warn(true, "Detected text animations, skipping stuff! Will try again later...");
        return;
      }

      // Now clone the content.
      const clone = this.cloneContent(content);

      // Now mount our prettified action.
      mount(Action, { target: element, anchor: content, props: { content: clone.innerHTML, type: ActionType.Last } });
    }

    // Story actions are tricky since they do not have a nice wrapper around them.
    // So I just have to grab the text, and clear it out before mounting the prettified action.
    if (type === ActionType.Story) {
      const originalText = element.innerHTML;
      element.innerHTML = ""; // Clear out the original text.
      console.log("Original text:", originalText);
      mount(Action, { target: element, props: { content: originalText, type: ActionType.Story } });
    }

    if (type === ActionType.Default) {
      // Grab the first element.
      const content = element.firstElementChild as HTMLElement;
      if (!content) return;
      // Now clone the content.
      const clone = this.cloneContent(content);
      // Now mount our prettified action.
      mount(Action, { target: element, anchor: content, props: { content: clone.innerHTML, type: ActionType.Default } });
    }

    // Print success message.
    debug.success(true, "An action was successfully prettified!");

    // Mark the element as prettified.
    // If this is removed then React will get angry again, very, very much.
    element.setAttribute("data-le-marked", "true");
  }

  prettify(output: HTMLElement, lookback: number = 5) {
    if (!output) return;

    const children = Array.from(output.children) as HTMLElement[];
    const nodes = children.slice(-lookback);

    nodes.forEach((node) => {
      if (this.isStorySection(node)) {
        const storyActions = node.querySelectorAll("span#transition-opacity:not([aria-label]):not(:has(span))");
        storyActions.forEach((action) => {
          this.mountActionOn(action as HTMLElement, ActionType.Story);
        });

        const lastAction = query.lastAction(node);
        if (lastAction) {
          this.mountActionOn(lastAction, ActionType.Last);
        }
      } else {
        const actionSpan = node.querySelector('span[aria-label^="Action"]') as HTMLElement;
        if (actionSpan) {
          this.mountActionOn(actionSpan, ActionType.Default);
        }
      }
    });
  }
}

export const dom = new LEDom();
