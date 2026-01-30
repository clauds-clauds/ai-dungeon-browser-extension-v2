<script lang="ts">
  import { Select } from "bits-ui";
  import { fly } from "svelte/transition"; // Import the transition

  interface Choice {
    value: string;
    label: string;
    icon?: string;
  }

  type Props = { value?: string; choices: Choice[]; placeholder?: string; icon?: string };
  let { value = $bindable(), choices, placeholder = "Make a choice!", icon }: Props = $props();

  const selected = $derived(choices.find((choice) => choice.value === value)?.label);
  const valid = $derived(selected ? true : false);
</script>

<Select.Root bind:value items={choices} type="single">
  <Select.Trigger
    class="bg-surface flex attention gap-2 transition w-full h-40px border-2px border-surface-out focus-within:border-pretty-brand rounded-lg cursor-pointer p-2 items-center"
    aria-label={placeholder}
  >
    {#if icon}
      <span font="symbol" class="text-mono-subtle">{icon}</span>
    {/if}
    <span class="{valid ? 'text-mono-900' : 'text-mono-subtle'} text-sm">{valid ? selected : placeholder}</span>
    <span font="symbol" class="text-mono-subtle m-l-auto">expand_all</span>
  </Select.Trigger>
  <Select.Portal>
    <Select.Content
      forceMount
      sideOffset={4}
      class="w-[var(--bits-select-anchor-width)] min-w-[var(--bits-select-anchor-width)]"
    >
      {#snippet child({ wrapperProps, props, open })}
        {#if open}
          <div {...wrapperProps}>
            <div {...props} transition:fly={{ duration: 200, y: 10 }}>
              <Select.ScrollUpButton />
              <Select.Viewport class="bg-surface attention border-2px border-surface-out rounded-lg transition">
                {#each choices as choice}
                  {@const chosen = choice.value === value}
                  <Select.Item
                    value={choice.value}
                    label={choice.label}
                    class="flex p-2 gap-2 items-center hover:bg-surface-out cursor-pointer items-center"
                  >
                    {#if choice.icon}
                      <span font="symbol" text="mono-subtle">{choice.icon}</span>
                    {/if}
                    <span text="sm">{choice.label}</span>
                    {#if chosen}
                      <span font="symbol" text="mono-subtle" class="m-l-auto">check</span>
                    {/if}
                  </Select.Item>
                {/each}
                <Select.ScrollDownButton />
              </Select.Viewport>
            </div>
          </div>
        {/if}
      {/snippet}
    </Select.Content>
  </Select.Portal>
</Select.Root>
