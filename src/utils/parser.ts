import { get } from "svelte/store";
import type { Chunk, VisualCard } from "./types";

/**
 * Empty for now...
 */
class LEParser {
  /**
   *
   */
  #categorize(match: string, markdown: boolean, map: Map<string, VisualCard>): Chunk {
    // Again, I hate switch statements with a passion.
    if (markdown) {
      // Bold formatting.
      if ((match.startsWith("**") && match.endsWith("**")) || (match.startsWith("__") && match.endsWith("__"))) {
        return { type: "bold", text: match.slice(2, -2) };
      }

      // Strikethrough formatting.
      if (match.startsWith("~~") && match.endsWith("~~")) {
        return { type: "strikethrough", text: match.slice(2, -2) };
      }

      // Italic formatting.
      if ((match.startsWith("*") && match.endsWith("*")) || (match.startsWith("_") && match.endsWith("_"))) {
        return { type: "italic", text: match.slice(1, -1) };
      }

      // Underline formatting.
      if (match.startsWith("~") && match.endsWith("~")) {
        return { type: "underline", text: match.slice(1, -1) };
      }
    }

    // I don't really wanna document this.
    // It grabs a card, what more do you want?
    const lookupMatch = match.replace(/('s|'s)$/, "");
    const card = map.get(lookupMatch.toLowerCase());
    if (card) return { type: "card", visualCard: card, text: match };

    // Default to text.
    return { type: "text", text: match };
  }

  /**
   *
   * @param text
   * @returns
   */
  toChunks(text: string, pattern: RegExp, map: Map<string, VisualCard>, markdown: boolean = false): Chunk[] {
    // If there is no text then return an empty array.
    if (!text) return [];

    // Create the initial chunks.
    const chunks: Chunk[] = [];

    // Now we can start parsing the text.
    let lastIndex = 0;

    // Get the current settings.
    // Used to get the markdown setting.
    const currentSettings = get(settings);

    // Iterate over all matches in the text.
    // Do stuff.
    // Solve world hunger.
    // Bring about world peace.
    for (const match of text.matchAll(pattern)) {
      const matchIndex = match.index!;
      const fullMatch = match[0];

      // Push a new text chunk.
      if (matchIndex > lastIndex) chunks.push({ type: "text", text: text.substring(lastIndex, matchIndex) });

      // Now categorize the match.
      const chunk = this.#categorize(fullMatch, markdown, map);
      chunks.push(chunk);

      // Update the last index.
      lastIndex = matchIndex + fullMatch.length;
    }

    if (lastIndex < text.length) {
      chunks.push({ type: "text", text: text.substring(lastIndex) });
    }

    return chunks;
  }
}

export const parser = new LEParser();
