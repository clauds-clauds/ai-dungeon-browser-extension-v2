<script lang="ts">
  import { Popover } from "bits-ui";
  import { fly } from "svelte/transition";
  type Props = { children?: any; content?: any };
  let { children, content }: Props = $props();
</script>

<Popover.Root>
  <Popover.Trigger class="flex w-fit h-fit">
    {@render children?.()}
  </Popover.Trigger>
  <Popover.Portal>
    <Popover.Overlay />
    <Popover.Content
      sideOffset={8}
      side="top"
      forceMount
      trapFocus={false}
      class="flex p-2 w-fit bg-surface border-2px border-surface-out rounded-lg text-sm"
    >
      {#snippet child({ wrapperProps, props, open })}
        {#if open}
          <div {...wrapperProps}>
            <div {...props} transition:fly={{ duration: 200, y: 16 }}>
              {@render content?.()}
            </div>
          </div>
        {/if}
      {/snippet}
    </Popover.Content>
  </Popover.Portal>
</Popover.Root>
