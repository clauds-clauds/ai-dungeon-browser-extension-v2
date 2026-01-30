<script lang="ts">
  import { DropdownMenu } from "bits-ui";
  import { fly } from "svelte/transition";
  import Checkbox from "./checkbox.svelte";

  type Props = { values: Record<string, boolean>; children?: any };
  let { values = $bindable(), children }: Props = $props();
</script>

<DropdownMenu.Root>
  <DropdownMenu.Trigger class="flex w-fit h-fit">
    {@render children?.()}
  </DropdownMenu.Trigger>

  <DropdownMenu.Portal>
    <DropdownMenu.Content sideOffset={4} forceMount>
      {#snippet child({ wrapperProps, props, open })}
        {#if open}
          <div {...wrapperProps}>
            <div {...props} transition:fly={{ duration: 150, y: -8 }}>
              <div class="flex flex-col rounded-lg overflow-hidden w-240px surface-raised">
                {#each Object.entries(values) as [key, checked], index (key)}
                  {@const isLast = index === Object.entries(values).length - 1}
                  <span
                    class="bg-surface text-mono-900 select-none flex flex-row p-2 items-center gap-2 {!isLast
                      ? 'border-b-1px border-surface-out'
                      : ''} cursor-pointer attention"
                  >
                    <Checkbox bind:checked={values[key]} />
                    <span text="sm">{key}</span>
                  </span>
                {/each}
              </div>
              <DropdownMenu.Arrow width={16} class="text-mono-400" />
            </div>
          </div>
        {/if}
      {/snippet}
    </DropdownMenu.Content>
  </DropdownMenu.Portal>
</DropdownMenu.Root>
