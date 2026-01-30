<script lang="ts">
  import { settings } from "@/utils/storage";

  type Props = {
    url?: string;
    children?: any;
    onclick?: (e: MouseEvent) => void;
    extra?: string;
  };

  let { url, children, onclick, extra }: Props = $props();

  let card: HTMLDivElement;
  const angle = $settings.interfaceCardAngle;
  let rotateX = $state(0);
  let rotateY = $state(0);
  let scale = $state(1);
  let isHovering = $state(false);
  let glareX = $state(50);
  let glareY = $state(50);
</script>

<div
  class="relative flex-col transform-gpu rounded-lg overflow-hidden cursor-pointer attention b-0 bg-cover bg-center bg-pretty-brand/16 flex {extra}"
  class:transition-transform={!isHovering}
  style="transition-property: transform, filter, border-color;"
  class:duration-300={!isHovering}
  class:ease-out={!isHovering}
  style:background-image={url ? `url(${url})` : undefined}
  style:transform="perspective(1000px) rotateX({rotateX}deg) rotateY({rotateY}deg) scale({scale})"
  bind:this={card}
  onmousemove={(e: MouseEvent) => {
    if (!card || $settings.interfaceCardAngle === 0) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    rotateY = ((x - centerX) / centerX) * angle;
    rotateX = ((centerY - y) / centerY) * angle;

    glareX = (x / rect.width) * 100;
    glareY = (y / rect.height) * 100;
  }}
  onmouseenter={() => {
    isHovering = true;
    scale = 1.02;
  }}
  onmouseleave={() => {
    isHovering = false;
    rotateX = 0;
    rotateY = 0;
    scale = 1;
  }}
  {onclick}
  onkeydown={(e: KeyboardEvent) => {}}
  role="button"
  tabindex="0"
>
  {#if $settings.developerShinyCards}
    <div
      class="absolute inset-0 pointer-events-none opacity-0 transition-opacity duration-300"
      class:opacity-70={isHovering}
      style:background="radial-gradient(circle at {glareX}% {glareY}%, rgba(255,255,255,0.4) 0%, rgba(209,77,218,0.3) 15%,
      rgba(115,56,194,0.3) 30%, rgba(49,125,234,0.3) 45%, rgba(31,176,133,0.3) 60%, rgba(248,174,44,0.2) 75%, transparent 90%)"
      style:mix-blend-mode="color-dodge"
    ></div>

    <div
      class="absolute inset-0 pointer-events-none opacity-0 transition-opacity duration-300"
      class:opacity-50={isHovering}
      style:background="radial-gradient(circle at {glareX}% {glareY}%, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.2) 20%,
      transparent 50%)"
    ></div>
  {/if}

  {#if children}
    {@render children()}
  {/if}
</div>
