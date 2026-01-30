<script lang="ts">
  import { slide } from "svelte/transition";

  type NavbarButton = {
    icon: string;
    label: string;
  };

  type Props = {
    value: string;
    buttons: NavbarButton[];
    closeable?: boolean;
    onclose?: () => void;
  };
  let { value = $bindable(), buttons, closeable = true, onclose }: Props = $props();

  $effect(() => {
    if (!value && buttons.length > 0) {
      value = buttons[0].label;
    }
  });
</script>

<div class="flex w-full h-fit" border="b-1px mono-100">
  {#each buttons as button}
    {@const active = button.label === value}
    <button
      onclick={() => {
        value = button.label;
      }}
      class="flex flex-1 flex-row items-center p-3 gap-1 justify-center transition uppercase cursor-pointer"
      bg="hover:mono-100"
      border="b-4px transparent {!active ? 'hover:mono-200' : 'pretty-brand!'}"
    >
      <span font="symbol" text="mono-600">{button.icon}</span>
      {#if active}
        <span class="text-sm">{button.label}</span>
      {/if}
    </button>
  {/each}
  {#if closeable}
    <button onclick={onclose} class="w-48px h-48px cursor-pointer" bg="hover:mono-100">
      <span font="symbol">close</span>
    </button>
  {/if}
</div>
