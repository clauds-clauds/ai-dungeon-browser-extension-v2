/**
 * Empty for now...
 */
class LEEvents {
  /**
   * The **MutationObserver** for DOM changes.
   */
  #observer: MutationObserver | null = null;

  /**
   * The output **HTMLElement** on which AI Dungeon writes its content.
   */
  #output: HTMLElement | null = null;

  /**
   * Whether to apply logic for AI Dungeon adventures.
   */
  #applyDungeonEffects: boolean = false;

  /**
   * `onWake` is called when the extension starts up.
   */
  async onWake() {
    // Create a single observer for the entire document.
    this.#observer = new MutationObserver((mutations) => {
      this.onGenericMutations(mutations);
      this.onDungeonMutations(mutations);
    });

    // Start observing the document thing for changes.
    this.#observer.observe(document.body, { childList: true, subtree: true });

    // Print success message.
    debug.success(true, "DOM observer set up!");
  }

  /**
   * `onGenericMutations` is called for generic mutation events.
   * @param mutations The mutation records.
   */
  onGenericMutations(mutations: MutationRecord[]) {
    dom.addDevButton();
  }

  /**
   * `onDungeonMutations` is called to modify AI Dungeon stuff.
   * @param mutations The mutation records.
   */
  onDungeonMutations(mutations: MutationRecord[]) {
    // Skip invalid adventures.
    if (!query.adventureId()) {
      if (this.#applyDungeonEffects) this.onDungeonCleanup();
      return;
    } else {
      if (!this.#applyDungeonEffects) debug.success(true, "You entered an adventure!");
      this.#applyDungeonEffects = true;
    }

    // Add the buttons for the image editor and the normal editor.
    // This is added to the flamey in-game menu thingamabob.
    dom.addButtons();

    // If the output is already set then skip searching for it.
    if (this.#output) {
      dom.prettify(this.#output);
    } else {
      // Try to find the gameplay output element.
      this.#output = query.gameplayOutput();

      // Print a success message if we found it.
      if (this.#output) {
        debug.success(true, "The gameplay output has been discovered!");
      }
    }
  }

  /**
   * `onDungeonCleanup` is called to clean up AI Dungeon related stuff.
   */
  onDungeonCleanup() {
    debug.warn(true, "You left an adventure!");
    this.#applyDungeonEffects = false;
    this.#output = null;
  }
}

export const events = new LEEvents();
