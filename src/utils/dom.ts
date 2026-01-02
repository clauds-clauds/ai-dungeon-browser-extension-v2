import { mount, unmount } from "svelte";
import { Config } from "./config";
import { Debug } from "./debug";
import { extensionState } from "./state.svelte";
import Response from "@/components/response.svelte";

export class DOM {
  private static mountedComponents = new Map<HTMLElement, ReturnType<typeof mount>>();
  private static readonly LOOKBACK = 4;

  static injectButton() {
    if (document.getElementById(Config.ID_EDITOR_BUTTON)) return;
    const baseButton = document.querySelector(Config.SELECTOR_EXIT_BUTTON);
    if (!baseButton) return;

    const button = baseButton.cloneNode(true) as HTMLElement;
    button.id = Config.ID_EDITOR_BUTTON;
    (button.querySelector("p") as HTMLElement).innerText = "w_wrench";
    (button.querySelector("span") as HTMLElement).innerText = "Editor";
    button.addEventListener("click", (e) => {
      extensionState.isEditorOpen = true;
    });
    baseButton.parentElement?.insertBefore(button, baseButton);
  }

  private static mountResponseOn(
    target: HTMLElement,
    originalContent: HTMLElement,
    type: "last_action" | "story" | "action"
  ): boolean {
    if (!target || !originalContent) return false;
    if (target.hasAttribute(Config.ATTRIBUTE_ALTERED)) return false;

    const html = originalContent.innerHTML;
    if (!html) return false;

    originalContent.style.display = "none";

    const existing = this.mountedComponents.get(target);
    if (existing) {
      unmount(existing);
      this.mountedComponents.delete(target);
    }

    const component = mount(Response, {
      target: target,
      anchor: target.firstChild ?? undefined,
      props: { rawHtml: html, type },
    });

    this.mountedComponents.set(target, component);
    target.setAttribute(Config.ATTRIBUTE_ALTERED, "true");
    return true;
  }

  private static wrapTextContent(container: HTMLElement): HTMLElement | null {
    if (container.children.length > 0) return null;

    const html = container.innerHTML;
    if (!html) return null;

    const wrapper = document.createElement("span");
    wrapper.innerHTML = html;
    container.innerHTML = "";
    container.appendChild(wrapper);
    return wrapper;
  }

  private static isLastAction(element: HTMLElement): boolean {
    const label = element.getAttribute("aria-label") || "";
    return label.startsWith("Last action:");
  }

  private static isPreviousOutput(element: HTMLElement): boolean {
    if (element.tagName !== "SPAN") return false;
    if (element.id !== "transition-opacity") return false;
    if (element.getAttribute("aria-label")) return false;
    if (element.hasAttribute(Config.ATTRIBUTE_ALTERED)) return false;
    if (element.children.length > 0) return false;
    return true;
  }

  private static isActionContainer(element: HTMLElement): boolean {
    return element.id === "transition-opacity" && element.tagName === "DIV";
  }

  private static isStorySectionContainer(element: HTMLElement): boolean {
    const label = element.getAttribute("aria-label") || "";
    return label.startsWith("Story section:");
  }

  private static getActionTextSpan(actionContainer: HTMLElement): HTMLElement | null {
    const thirdChild = actionContainer.children[2] as HTMLElement | undefined;
    if (!thirdChild) return null;

    const label = thirdChild.getAttribute("aria-label") || "";
    if (!label.startsWith("Action")) return null;
    if (thirdChild.hasAttribute(Config.ATTRIBUTE_ALTERED)) return null;

    const actionTextSpan = thirdChild.querySelector("#action-text") as HTMLElement | null;
    if (!actionTextSpan) return null;

    return actionTextSpan;
  }

  static prettify(responses: HTMLElement[]) {
    for (const response of responses) {
      if (response.hasAttribute(Config.ATTRIBUTE_ALTERED)) continue;
      if (!this.isLastAction(response)) continue;

      const originalChild = response.firstElementChild as HTMLElement;
      if (!originalChild) continue;

      this.mountResponseOn(response, originalChild, "last_action");
      this.paintLookback(response);
    }
  }

  private static paintLookback(lastActionElement: HTMLElement) {
    let remaining = this.LOOKBACK - 1;
    if (remaining <= 0) return;

    const storySection = lastActionElement.parentElement;
    if (!storySection) return;
    if (!this.isStorySectionContainer(storySection)) return;

    remaining = this.paintSiblingsAbove(lastActionElement, storySection, remaining);
    if (remaining <= 0) return;

    remaining = this.paintPreviousRootElements(storySection, remaining);
  }

  private static paintSiblingsAbove(anchor: HTMLElement, parent: HTMLElement, remaining: number): number {
    const siblings = Array.from(parent.children) as HTMLElement[];
    const anchorIndex = siblings.indexOf(anchor);

    for (let i = anchorIndex - 1; i >= 0 && remaining > 0; i--) {
      const sibling = siblings[i];
      if (!this.isPreviousOutput(sibling)) continue;

      const wrapper = this.wrapTextContent(sibling);
      if (!wrapper) continue;

      if (this.mountResponseOn(sibling, wrapper, "story")) {
        remaining--;
      }
    }

    return remaining;
  }

  private static paintPreviousRootElements(currentStorySection: HTMLElement, remaining: number): number {
    const gameplayRoot = currentStorySection.parentElement;
    if (!gameplayRoot) return remaining;

    const rootChildren = Array.from(gameplayRoot.children) as HTMLElement[];
    const currentIndex = rootChildren.indexOf(currentStorySection);

    for (let i = currentIndex - 1; i >= 0 && remaining > 0; i--) {
      const rootChild = rootChildren[i];

      if (this.isActionContainer(rootChild)) {
        remaining = this.paintActionContainer(rootChild, remaining);
      } else if (this.isStorySectionContainer(rootChild)) {
        remaining = this.paintStorySection(rootChild, remaining);
      }
    }

    return remaining;
  }

  private static paintActionContainer(actionContainer: HTMLElement, remaining: number): number {
    const actionTextSpan = this.getActionTextSpan(actionContainer);
    if (!actionTextSpan) return remaining;

    const thirdChild = actionContainer.children[2] as HTMLElement;
    if (this.mountResponseOn(thirdChild, actionTextSpan, "action")) {
      remaining--;
    }

    return remaining;
  }

  private static paintStorySection(storySection: HTMLElement, remaining: number): number {
    const children = Array.from(storySection.children) as HTMLElement[];

    for (let i = children.length - 1; i >= 0 && remaining > 0; i--) {
      const child = children[i];
      if (!this.isPreviousOutput(child)) continue;

      const wrapper = this.wrapTextContent(child);
      if (!wrapper) continue;

      if (this.mountResponseOn(child, wrapper, "story")) {
        remaining--;
      }
    }

    return remaining;
  }

  static cleanup() {
    for (const [element, component] of this.mountedComponents.entries()) {
      unmount(component);
      element.removeAttribute(Config.ATTRIBUTE_ALTERED);
    }
    this.mountedComponents.clear();
  }
}
