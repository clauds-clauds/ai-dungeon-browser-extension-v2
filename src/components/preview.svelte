<script lang="ts">
  import type { Vector2 } from "@/utils/types";
  import { AspectRatio } from "bits-ui";

  type Props = { children?: any; ratio: Vector2; src?: string; onclick?: (e: MouseEvent) => void };
  let { children, ratio, src, onclick }: Props = $props();

  let x: number = $derived.by(() => ratio.x);
  let y: number = $derived.by(() => ratio.y);
</script>

<AspectRatio.Root ratio={x / y}>
  <div
    {onclick}
    onkeydown={() => {}}
    role="button"
    tabindex="0"
    class="relative w-full h-full bg-mono-100 border-mono-200 border-2px rounded-xl overflow-hidden cursor-auto"
  >
    {#if src}
      <div class="absolute inset-0 bg-cover bg-center blur-xl scale-110" style="background-image: url({src});"></div>
      <div class="absolute inset-0 flex items-center justify-center">
        <img {src} alt="" class="max-w-full max-h-full object-contain" />
      </div>
    {/if}
    <div class="absolute inset-0 flex w-full h-full">
      {@render children?.()}
    </div>
  </div>
</AspectRatio.Root>
