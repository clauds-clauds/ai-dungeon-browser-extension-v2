<script lang="ts">
  import { Tooltip } from "bits-ui";
  import { fly } from "svelte/transition";

  type Props = { children: any; content?: any };
  let { children, content }: Props = $props();
</script>

<Tooltip.Provider>
  <Tooltip.Root delayDuration={200}>
    <Tooltip.Trigger class="flex w-fit h-fit">
      {@render children?.()}
    </Tooltip.Trigger>
    <Tooltip.Portal>
      <Tooltip.Content
        sideOffset={8}
        forceMount
        class="flex p-2 bg-surface border-2px border-surface-out rounded-lg text-sm surface-raised"
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
      </Tooltip.Content>
    </Tooltip.Portal>
  </Tooltip.Root>
</Tooltip.Provider>
