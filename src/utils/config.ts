export class Config {
  static readonly ID_EDITOR_ANCHOR: string = "de-editor-anchor";
  static readonly ID_EDITOR_BUTTON: string = "de-editor-button";
  static readonly ID_EDITOR: string = "de-editor";
  static readonly ID_RESPONSE: string = "transition-opacity";
  static readonly SELECTOR_RESPONSE: string = "#transition-opacity";
  static readonly SELECTOR_LAST_ACTION: string = 'span[aria-label^="Last action:"]';
  static readonly SELECTOR_EXIT_BUTTON: string = 'div[role="button"][aria-label="Exit game"]';
  static readonly SELECTOR_OUTPUT: string = "#gameplay-output";
  static readonly ATTRIBUTE_HIDDEN: string = "data-de-hidden";
  static readonly ATTRIBUTE_ALTERED: string = "data-de-altered";
}
