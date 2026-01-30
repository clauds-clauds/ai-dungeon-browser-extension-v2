<script lang="ts">
  import { DropdownMenu } from "bits-ui";
  import { fly } from "svelte/transition";

  type DropdownButton = {
    icon?: string;
    label: string;
    onclick?: () => void;
  };

  type DropdownGroup = { name?: string; buttons: DropdownButton[] };

  type Props = { groups: DropdownGroup[]; children?: any };
  let { groups, children }: Props = $props();
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
              <div class="flex flex-col gap-2 surface-raised">
                {#each groups as group}
                  <div class="flex flex-col w-240px h-fit rounded-lg overflow-hidden">
                    {#each group.buttons as button, i}
                      {@const isLast = i === group.buttons.length - 1}
                      <button
                        onclick={button.onclick}
                        class="bg-surface text-mono-900 filter-invert flex flex-row text-align-start p-2 items-center justify-center {!isLast
                          ? 'border-b-1px border-surface-out'
                          : ''} cursor-pointer attention"
                      >
                        <span text="sm">{button.label}</span>
                        <span font="symbol" class="flex m-l-auto text-mono-subtle">{button.icon}</span>
                      </button>
                    {/each}
                  </div>
                {/each}
              </div>
              <DropdownMenu.Arrow width={16} class="text-mono-400 invert" />
            </div>
          </div>
        {/if}
      {/snippet}
    </DropdownMenu.Content>
  </DropdownMenu.Portal>
</DropdownMenu.Root>
