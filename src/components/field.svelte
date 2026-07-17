<script lang="ts">
  import { Tooltip } from "bits-ui";
  import DOMPurify from "dompurify";

  type Props = {
    label: string;
    info?: string;
    children?: any;
  };

  let { label, info, children }: Props = $props();

  // `info` is developer-authored and may contain simple formatting HTML (<b>, <br>, <code>...).
  // Sanitize before rendering so this {@html} sink stays safe if `info` ever becomes dynamic.
  let safeInfo = $derived(info ? DOMPurify.sanitize(info) : "");
</script>

<Tooltip.Provider>
  <Tooltip.Root delayDuration={200}>
    <Tooltip.Trigger class="flex flex-col w-full h-fit gap-2 cursor-default">
      <span class="place-self-start text-theme-neutral-800 uppercase ml-4 font-bold text-xs">{label}</span>
      {@render children?.()}
    </Tooltip.Trigger>
    <Tooltip.Content
      sideOffset={8}
      class="animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--bits-tooltip-content-transform-origin)"
    >
      {#if info}
        <div class="bg-theme-neutral-100 shadow-popover outline-hidden z-0 block text-start p-4 text-sm font-medium rounded-xl">
          {@html safeInfo}
        </div>
      {/if}
    </Tooltip.Content>
  </Tooltip.Root>
</Tooltip.Provider>
