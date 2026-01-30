<script lang="ts">
  import type { Pill } from "@/utils/types";
  import emblaCarouselSvelte from "embla-carousel-svelte";
  import Separator from "./separator.svelte";

  type Props = { value: string; pills: Pill[] };
  let { value = $bindable(), pills }: Props = $props();

  const emblaConfig = {
    options: {
      dragFree: true,
      containScroll: "trimSnaps" as const,
      duration: 20,
    },
    plugins: [],
  };

  $effect(() => {
    if (!value && pills.length > 0) {
      value = pills[0].label;
    }
  });
</script>

<div class="overflow-hidden cursor-grab active:cursor-grabbing" use:emblaCarouselSvelte={emblaConfig}>
  <div class="flex gap-2">
    <!-- Only render enabled pills! -->
    {#each pills as pill}
      {#if !pill.disabled}
        {@const active = pill.label === value}
        {@const experimental = pill.label === "Experiments"}
        <button
          onclick={() => {
            value = pill.label;

            const message = `You clicked on the ${pill.label.toLowerCase()} pill!`;

            if (experimental) debug.warn(true, message);
            else debug.log(true, message);
          }}
          class="flex shrink-0 h-32px items-center justify-center gap-3 rounded-full cursor-pointer attention transition select-none {active
            ? 'filter-invert'
            : ''}"
          bg="mono-100"
          p="l-4 r-4"
        >
          <span font="symbol" text="mono-subtle">{pill.icon}</span>
          <span class="uppercase" text="sm">{pill.label}</span>
          {#if pill.extra}
            <Separator orientation="vertical" />
            <span class="uppercase" text="sm">{pill.extra}</span>
          {/if}
        </button>
      {/if}
    {/each}
  </div>
</div>
