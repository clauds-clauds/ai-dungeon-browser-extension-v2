/**
 *
 */
export type Pill = {
  icon: string;
  label: string;
  extra?: string;
  disabled?: boolean;
};

export type Track = {
  name: string;
  data: string[];
};

/**
 * The different chunk types for action parsing.
 * - `text:` Standard text.
 * - `bold:` Bold text.
 * - `italic:` Italic text.
 * - `underline:` Underlined text.
 * - `strikethrough:` Strikethrough text.
 */
export type Chunk =
  | { type: "text"; text: string }
  | { type: "bold"; text: string }
  | { type: "italic"; text: string }
  | { type: "underline"; text: string }
  | { type: "strikethrough"; text: string }
  | { type: "card"; visualCard: VisualCard; text: string };

export type Adventure = {
  name: string;
  visualCards: VisualCard[];
};

export type VisualCard = {
  id: string;
  name: string;
  type: string;
  entry: string;
  triggers: string;
  notes: string;
  icons: string[];
  icon: number;
  graphics: string[];
  graphic: number;
  color: string;
  limit: "story" | "action" | "protagonist" | "none";
};

/**
 * `ActionType` has all the different response types for AI Dungeon.
 * - `Default:` A standard user action.
 * - `Story:` A story action (either user or AI).
 * - `Last:` The last action returned by the AI.
 */
export enum ActionType {
  Default,
  Story,
  Last,
}

/**
 * A simple 2D vector type.
 */
export type Vector2 = {
  x: number;
  y: number;
};
