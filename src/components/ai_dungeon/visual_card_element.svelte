<script lang="ts">
  // Storage here!
  import { settings, adventures } from "@/utils/storage";

  // Types here!
  import type { VisualCard } from "@/utils/types";
  import Card from "../card.svelte";
  import { fade } from "svelte/transition";

  // Props here!
  type Props = { card: VisualCard; text: string };
  let { card, text }: Props = $props();

  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  let hovering = $state(false);

  let data = $derived.by(() => {
    return {
      icons: card?.icons ?? [],
      icon: card?.icons?.[card?.icon ?? 0] ?? "",
      graphic: card?.graphics?.[card?.graphic ?? 0] ?? "",
      bold: $settings.textBold ? "font-bold" : "",
      border: `${$settings.iconBorderThickness}px solid ${card?.color ?? "transparent"}`,
      color: card?.color ?? "inherit",
      radius: `${$settings.iconRoundness / 2}%`,
    };
  });
</script>

<span
  role="button"
  tabindex="0"
  onclick={(e: MouseEvent) => {
    e.stopPropagation();
  }}
  onkeydown={(e: KeyboardEvent) => {}}
  onmouseenter={() => {
    if (timeoutId) clearTimeout(timeoutId);
    hovering = true;
  }}
  onmouseleave={() => {
    timeoutId = setTimeout(() => {
      hovering = false;
    }, $settings.tooltipDelay);
  }}
  class="relative flex flex-inline items-baseline whitespace-nowrap gap-2 {data.bold}"
  style:color={data.color}
>
  {#if data.graphic && hovering}
    <span class="absolute min-w-fit bottom-[calc(100%+8px)] left-1/2 -translate-x-1/2 z-10" transition:fade>
      <span class="relative">
        <Card
          onclick={(e) => {
            e.stopPropagation();
            adventures.update((s) => ({
              ...s,
              [$settings.adventureId]: {
                ...s[$settings.adventureId],
                visualCards: s[$settings.adventureId].visualCards.map((c) =>
                  c.id === card.id ? { ...c, graphic: ((c.graphic ?? 0) + 1) % (c.graphics?.length || 1) } : c,
                ),
              },
            }));
          }}
        >
          <img
            src={data.graphic}
            alt="Visual Card Graphic"
            class="flex-1 aspect-auto"
            style="max-width: {$settings.tooltipWidth}px; max-height: {$settings.tooltipHeight}px;"
          />
          <div class="flex absolute w-full justify-end p-3 h-fit">
            <span
              onclick={(e: MouseEvent) => {
                e.stopPropagation();
                debug.log(true, `Focusing on ${text}...`);
                hovering = false;
                focusState.card = card;
              }}
              onkeydown={(e: KeyboardEvent) => {}}
              tabindex="0"
              role="button"
              class="font-symbol text-shadow-mono-0/64 text-shadow-md text-xl hover:text-4xl transition-all select-none"
              >visibility</span
            >
          </div>
        </Card>
      </span>
    </span>
  {/if}
  {#if data.icon}
    <img
      src={data.icon}
      alt="Visual Card Icon"
      class="aspect-ratio-square object-cover self-center"
      style="width: {$settings.iconSize}px; height: {$settings.iconSize}px; border: {data.border}; border-radius: {data.radius}"
    />
  {/if}
  {#if hovering && data.icons && data.icons.length > 1}
    <span class="absolute flex min-w-fit top-[calc(100%+8px)] left-1/2 -translate-x-1/2 z-10 gap-2" transition:fade>
      {#each data.icons as icon, i}
        <button
          onclick={(e: MouseEvent) => {
            e.stopPropagation();
            adventures.update((s) => ({
              ...s,
              [$settings.adventureId]: {
                ...s[$settings.adventureId],
                visualCards: s[$settings.adventureId].visualCards.map((c) => (c.id === card.id ? { ...c, icon: i } : c)),
              },
            }));
          }}
        >
          <Card extra="aspect-ratio square min-w-20 min-h-20" url={icon} />
        </button>
      {/each}
    </span>
  {/if}
  <span>{text}</span>
</span>
