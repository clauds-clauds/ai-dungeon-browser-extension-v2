<script lang="ts">
  import { Dialog } from "bits-ui";
  import { fade, fly } from "svelte/transition";

  type Props = { open?: boolean; children?: any; trigger?: any; darken?: boolean; args?: string };
  let { open = $bindable(true), children, trigger, darken = false, args }: Props = $props();

  let backgroundClick = $state<boolean>(false);
</script>

<Dialog.Root bind:open>
  {#if trigger}
    <Dialog.Trigger class="flex w-fit h-fit">
      {@render trigger?.()}
    </Dialog.Trigger>
  {/if}
  <Dialog.Portal disabled={darken}>
    <Dialog.Content
      forceMount
      trapFocus={false}
      onOpenAutoFocus={(e) => {
        e.preventDefault();
      }}
    >
      {#snippet child({ props, open: isOpen })}
        {#if isOpen}
          <div
            {...props}
            transition:fade={{ duration: 200 }}
            class="absolute flex w-full h-full justify-center items-center z-16384 p-2 {darken ? 'bg-mono-0/80' : ''}"
            onclick={(e: MouseEvent) => {
              if (backgroundClick && e.target === e.currentTarget) open = false;
            }}
            onmousedown={(e: MouseEvent) => {
              backgroundClick = e.target === e.currentTarget;
            }}
          >
            <div
              transition:fly={{ duration: 200, y: 32 }}
              onclick={(e: MouseEvent) => e.stopPropagation()}
              onkeydown={() => {}}
              role="dialog"
              tabindex="0"
              class="flex rounded-2xl overflow-hidden bg-mono-0 border-mono-200 border-1px pointer-events-auto {args}"
            >
              {@render children?.()}
            </div>
          </div>
        {/if}
      {/snippet}
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>
