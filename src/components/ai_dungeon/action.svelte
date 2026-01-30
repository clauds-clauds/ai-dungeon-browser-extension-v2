<script lang="ts">
  import DOMPurify from "dompurify";
  import { ActionType } from "@/utils/types";

  import { settings, pattern, map } from "@/utils/storage";
  import VisualCardElement from "./visual_card_element.svelte";
  import Preview from "../preview.svelte";
  import Focus from "./focus.svelte";

  type Props = { content: string; type?: ActionType };
  let { content, type = ActionType.Default }: Props = $props();

  // I do not think this is required, considering AID just creates a new action when you edit an old one.
  // But just in case, we will keep it here.
  // The sanitization is also not strictly required, but it is a good safety step thingy.
  let sanitizedContent = $derived(DOMPurify.sanitize(content));
  let chunks = $derived(parser.toChunks(sanitizedContent, $pattern, $map, $settings.textMarkdown));
  const showFocus = $derived.by(() => type === ActionType.Last && focusState.card !== null);
</script>

{#if showFocus}
  <Focus />
{/if}{#each chunks as chunk, i (i)}
  {#if chunk.type === "card"}
    {@const allowed =
      chunk.visualCard.limit === "none" ||
      (chunk.visualCard.limit === "action" && type === ActionType.Default) ||
      (chunk.visualCard.limit === "story" && type !== ActionType.Default) ||
      (chunk.visualCard.limit === "protagonist" && type === ActionType.Default && i === 0)}
    {#if allowed}
      <VisualCardElement card={chunk.visualCard} text={chunk.text} />
    {:else}
      {@html chunk.text}
    {/if}
  {:else if chunk.type === "bold"}
    <b>{@html chunk.text}</b>
  {:else if chunk.type === "italic"}
    <em>{@html chunk.text}</em>
  {:else if chunk.type === "underline"}
    <u>{@html chunk.text}</u>
  {:else if chunk.type === "strikethrough"}
    <s>{@html chunk.text}</s>
  {:else}
    {@html showFocus && i === 0 && chunk.text && chunk.text[0] === " " ? chunk.text.slice(1) : chunk.text}
  {/if}
{/each}
