<script lang="ts">
  import { Separator, Slider } from "bits-ui";

  type Props = { value: number; min?: number; max?: number; reset?: number; step?: number };
  let { value = $bindable(), min = 0, max = 100, reset = 50, step = 1 }: Props = $props();

  // svelte-ignore state_referenced_locally
  let resettable = $state<boolean>(value !== reset);
</script>

<div class="flex flex-col w-full h-fit gap-4">
  <div class="flex flex-row gap-2 justify-between">
    <input
      bind:value
      onchange={() => {
        resettable = value !== reset;
      }}
      type="number"
      class="outline-0 w-48px text-sm rounded-lg border-2px p-x-1 border-transparent hover:border-surface-out focus:border-pretty-brand attention"
    />
    <button
      class="text-sm text-pretty-brand cursor-pointer attention"
      onclick={() => {
        value = reset;
        resettable = false;
      }}
    >
      {#if resettable}
        RESET ({reset})
      {/if}
    </button>
  </div>
  <Slider.Root
    type="single"
    bind:value
    {min}
    {max}
    {step}
    onValueCommit={() => {
      resettable = value !== reset;
    }}
    class="relative flex w-full touch-none select-none attention items-center m-b-4"
  >
    <span class="bg-mono-0 relative h-4px w-full cursor-pointer overflow-hidden rounded-full">
      <Slider.Range class="bg-pretty-brand absolute h-full" />
    </span>
    <Slider.Thumb index={0} class="bg-mono-900 block size-6 cursor-pointer rounded-full transition" />
  </Slider.Root>
</div>

<!-- I really do not like using style elements anymore, but it is required to remove the spinners -->
<style>
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  input[type="number"] {
    appearance: textfield;
    -moz-appearance: textfield;
  }
</style>
