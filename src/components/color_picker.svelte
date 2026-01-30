<script lang="ts">
  import { Popover } from "bits-ui";
  import { fly } from "svelte/transition";

  type Props = { value: string };
  let { value = $bindable("#1fb085") }: Props = $props();

  type ColorPreset = {
    hex: string;
    name: string;
  };

  const colorPresets: ColorPreset[] = [
    { hex: "#d42dc3", name: "Pink" },
    { hex: "#7538c2", name: "Purple" },
    { hex: "#f3194d", name: "Red" },
    { hex: "#f85d2c", name: "Orange" },
    { hex: "#f8ae2c", name: "Yellow" },
    { hex: "#1fb085", name: "Green" },
    { hex: "#317dea", name: "Blue" },
  ];
</script>

<Popover.Root>
  <Popover.Trigger
    aria-label="Open Color Picker"
    class="flex items-center p-2 gap-2 h-40px w-full bg-surface border-surface-out border-2px attention cursor-pointer rounded-lg"
  >
    <span class="size-6 rounded-full" style="background-color: {value};"></span>
    <span class="text-sm uppercase">{value}</span>
    <span class="font-symbol text-mono-subtle ml-auto">colorize</span>
  </Popover.Trigger>
  <Popover.Content sideOffset={8} forceMount class="z-99 bg-mono-100 border-2px border-mono-200 p-2 rounded-lg">
    {#snippet child({ wrapperProps, props, open })}
      {#if open}
        <div {...wrapperProps}>
          <div {...props} transition:fly={{ duration: 200, y: -16 }}>
            <div class="flex flex-col gap-2 w-fit">
              <div class="flex items-center gap-2">
                <label class="relative cursor-pointer">
                  <input
                    type="color"
                    bind:value
                    oninput={(e: Event) => {
                      value = (e.target as HTMLInputElement).value;
                    }}
                    class="absolute inset-0 opacity-0 cursor-pointer"
                    aria-label="Custom Color Picker"
                  />
                  <span class="block w-40px h-40px rounded-full transition-colors" style="background-color: {value};"></span>
                </label>
                <input
                  type="text"
                  {value}
                  oninput={(e: Event) => {
                    value = (e.target as HTMLInputElement).value;
                  }}
                  class="flex-1 h-40px px-3 outline-0 text-sm uppercase bg-mono-300 border-mono-400 border-2px rounded-lg"
                  maxlength="7"
                  aria-label="Hex Color Value"
                />
              </div>

              <div class="flex flex-wrap gap-2">
                {#each colorPresets as color}
                  {@const active = color.hex === value}
                  <button
                    onclick={() => {
                      value = color.hex;
                    }}
                    class="w-40px h-40px rounded-full transition-transform hover:scale-108 cursor-pointer attention {active
                      ? 'border-pretty-brand border-2px'
                      : ''}"
                    style="background-color: {color.hex};"
                    aria-label="Select {color.name}"
                    title={color.name}
                  ></button>
                {/each}
              </div>
            </div>
          </div>
        </div>
      {/if}
    {/snippet}
  </Popover.Content>
</Popover.Root>
