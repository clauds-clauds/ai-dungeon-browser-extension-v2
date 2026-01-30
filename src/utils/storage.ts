import { derived, get } from "svelte/store";

/**
 * The default storage values.
 */
export const defaults = {
  // Editor settings here!
  developerZenMode: false,
  developerShinyCards: false,
  developerToastLimit: 1, // Default 1 because it can be annoying.
  developerThemeColor: "#f8ae2c",

  // Text settings here!
  textMarkdown: false,
  textBold: true,
  textDefaultColor: "#f8ae2c",
  textIcons: true,

  // Icon settings here!
  iconSize: 28,
  iconRoundness: 0,
  iconBorderThickness: 1,

  // Focus settings here!
  tooltip: true,
  tooltipWidth: 512,
  tooltipHeight: 512,
  tooltipDelay: 250,
  tooltipFocus: true,

  // Interface settings here!
  interfaceShowNotes: false,
  interfaceShowEntry: false,
  interfaceShowMiscFields: true,
  interfaceCardAngle: 12,

  // Query settings here!
  queryLastRequest: 0,

  // Image generation settings here!
  imageGenerationKey: "",
  imageGenerationRatio: "4:3",
  imageGenerationModel: "google/gemini-2.5-flash-image",
  imageGenerationPrompt: "",

  // RPG settings here!
  rpgIntegration: false,
  rpgHealthIcon: "favorite",
  rpgStaminaIcon: "bolt",
  rpgManaIcon: "storm",
  rpgWeightIcon: "weight",
  rpgSanityIcon: "cognition",

  // Compression settings here!
  compressionQuality: 85,
  compressionResolutionGraphic: 768,
  compressionResolutionIcon: 128,

  // Adventure ID here!
  adventureId: "Default",
};
export type Settings = typeof defaults;

export const settings = factory.produceSettings<Settings>("settings", defaults);
export const tracks = factory.produceCollection<Track>("tracks");
export const adventures = factory.produceCollection<Adventure>("adventures");

/**
 *
 */
export const map = derived([adventures, settings], ([$adventures, $settings]) => {
  const map = new Map<string, VisualCard>();
  const defaultAdventure = $adventures[$settings.adventureId];

  if (!defaultAdventure?.visualCards) return map;

  for (const card of defaultAdventure.visualCards) {
    if (!card.triggers) continue;
    const triggers = card.triggers.split(",").map((t) => t.trim().toLowerCase());
    for (const trigger of triggers) {
      if (trigger) map.set(trigger, card);
    }
  }
  return map;
});

/**
 *
 */
export const pattern = derived(map, ($map) => {
  // Sort the triggers by length (longest first).
  // Otherwise if you are unlucky then "dragon" will match before "dragon lord" and that is bad.
  // Very bad even, like catastrophic bad. Like world-ending bad. Like "why did I not do this sooner" bad.
  // I am very bored so I am writing a lot of comments, sorry not sorry.
  const sortedTriggers = Array.from($map.keys()).sort((a, b) => b.length - a.length);

  // OH NO! THE TRIGGERS ARE ESCAPING!!! RUN FOR YOUR LIVES!!!
  // Just kidding, mostly...
  // Do you know that sloths can hold their breath for up to 40 minutes? That is a fun fact.
  // Very, very fun.
  const escapedTriggers = sortedTriggers.map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));

  const patterns: string[] = [
    `(\\*\\*[^*]+\\*\\*)`, // **bold**
    `(__[^_]+__)`, // __bold__
    `(\\*[^*]+\\*)`, // *italic*
    `(_[^_]+_)`, // _italic_
    `(~~[^~]+~~)`, // ~~strikethrough~~
    `(~[^~]+~)`, // ~underline~
  ];

  // This is the single most important line of code in this entire project.
  // Without this, the entire trigger system would be broken beyond all repair.
  // It would be a disaster of epic proportions, a calamity of unimaginable scale.
  // So please, do not remove this line, ever. Thank you.
  if (escapedTriggers.length > 0) {
    patterns.push(`(?<=^|\\s|[^\\p{L}\\p{N}])(${escapedTriggers.join("|")})(?:'s|'s)?(?=$|\\s|[^\\p{L}\\p{N}])`);
  }

  // Now to create the mother of all regex patterns.
  // This regex will match all the formatting patterns and triggers we defined above.
  return new RegExp(patterns.join("|"), "giu");
});
