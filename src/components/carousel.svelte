<script lang="ts">
  import emblaCarouselSvelte from "embla-carousel-svelte";
  import type { EmblaOptionsType, EmblaCarouselType } from "embla-carousel";
  import type { Snippet } from "svelte";

  type Props = {
    children: Snippet;
    options?: EmblaOptionsType;
    class?: string;
    count?: number;
  };

  let { children, options = { loop: true }, class: className = "", count = 128 }: Props = $props();

  let emblaApi: EmblaCarouselType | undefined = $state();

  // State to track if we can scroll (to show/hide arrows)
  let canScrollPrev = $state(false);
  let canScrollNext = $state(false);

  // Your arrow configuration
  type CarouselArrow = {
    direction: "prev" | "next";
    label: string;
    icon: string;
  };

  const arrows: CarouselArrow[] = [
    { direction: "prev", label: "Previous slide", icon: "chevron_left" },
    { direction: "next", label: "Next slide", icon: "chevron_right" },
  ];

  const onInit = (event: CustomEvent<EmblaCarouselType>) => {
    emblaApi = event.detail;

    // Listen to embla events to update arrow visibility
    if (emblaApi) {
      emblaApi.on("select", updateButtons);
      emblaApi.on("reInit", updateButtons);
      updateButtons();
    }
  };

  const updateButtons = () => {
    if (!emblaApi) return;
    canScrollPrev = emblaApi.canScrollPrev();
    canScrollNext = emblaApi.canScrollNext();
  };

  const scrollPrev = () => emblaApi?.scrollPrev();
  const scrollNext = () => emblaApi?.scrollNext();

  let emblaConfig = $derived({
    options,
    plugins: [],
  });
</script>

<div class={`relative group ${className}`}>
  <div class="overflow-hidden" use:emblaCarouselSvelte={emblaConfig} onemblaInit={onInit}>
    <div class="flex touch-pan-y touch-pinch-zoom -ml-4 [&>*]:flex-[0_0_100%] [&>*]:min-w-0 [&>*]:pl-4">
      {@render children()}
    </div>
  </div>

  {#if count > 1}
    {#each arrows as arrow}
      {#if (arrow.direction === "prev" && (canScrollPrev || options.loop)) || (arrow.direction === "next" && (canScrollNext || options.loop))}
        <button
          class="absolute {arrow.direction === 'prev'
            ? 'left-4'
            : 'right-4'} top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-surface border-surface-out border-2px text-mono-900 attention opacity-0 transition-opacity group-hover:opacity-100 disabled:opacity-24 cursor-pointer select-none shadow-sm"
          aria-label={arrow.label}
          onclick={arrow.direction === "prev" ? scrollPrev : scrollNext}
        >
          <span font="symbol" class="text-xl leading-none">{arrow.icon}</span>
        </button>
      {/if}
    {/each}
  {/if}
</div>
