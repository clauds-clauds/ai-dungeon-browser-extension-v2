<script lang="ts">
  import { Storage } from "@/utils/storage";
  import type { StoryCard } from "@/utils/types";
  import DOMPurify from "dompurify";
  import { parseResponse, buildCardMap } from "@/utils/parser";
  import Highlight from "./highlight.svelte";
  import Focus from "./focus.svelte";
  import { extensionState } from "@/utils/state.svelte";

  type Props = {
    rawHtml: string;
    type: "last_action" | "story" | "action";
  };

  let { rawHtml, type }: Props = $props();

  let text = $derived(DOMPurify.sanitize(rawHtml));
  let map = $state(new Map<string, StoryCard>());

  $effect(() => {
    const updateCardMap = () => {
      const adventure = Storage.getSelectedAdventure();
      if (adventure) {
        const allCards = buildCardMap(adventure.storyCards);
        const filtered = new Map<string, StoryCard>();

        for (const [trigger, card] of allCards) {
          if (card.limit === "none") {
            filtered.set(trigger, card);
          } else if (card.limit === "story_only" && (type === "last_action" || type === "story")) {
            filtered.set(trigger, card);
          } else if (card.limit === "action_only" && type === "action") {
            filtered.set(trigger, card);
          }
        }

        map = filtered;
      } else {
        map = new Map();
      }
    };

    updateCardMap();

    const unsubAdventure = Storage.selectedAdventureId.subscribe(() => updateCardMap());
    const unsubAdventures = Storage.adventures.subscribe(() => updateCardMap());

    return () => {
      unsubAdventure();
      unsubAdventures();
    };
  });

  let chunks = $derived(parseResponse(text, map));
  $effect(() => {
    if (extensionState.focusCardId && chunks.length > 0 && chunks[0].content.startsWith(" ")) {
      chunks[0].content = chunks[0].content.trimStart();
    }
  });
</script>

{#if type === "last_action"}<Focus />{/if}<span>
  {#each chunks as chunk, i (i)}
    {#if chunk.type === "card"}
      <Highlight card={chunk.card} text={chunk.content} />
    {:else if chunk.type === "bold"}
      <b>{chunk.content}</b>
    {:else if chunk.type === "italic"}
      <em>{chunk.content}</em>
    {:else if chunk.type === "underline"}
      <u>{chunk.content}</u>
    {:else if chunk.type === "strikethrough"}
      <s>{chunk.content}</s>
    {:else}
      {chunk.content}
    {/if}
  {/each}
</span>
