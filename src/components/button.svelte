<script lang="ts">
  import { Button } from "bits-ui";

  type Props = { icon?: string; label?: string; preset?: "pretty" | "mono"; onclick?: () => void };
  let { icon, label, preset = "mono", onclick }: Props = $props();
</script>

<Button.Root
  {onclick}
  class="flex w-fit h-40px p-3 gap-1 {preset === 'pretty'
    ? 'bg-pretty-green'
    : 'bg-surface text-mono-900 filter-invert'} text-mono-0 attention select-none text-sm rounded-lg uppercase justify-center items-center cursor-pointer transition active:scale-[96%] whitespace-nowrap"
>
  {#if icon}
    <span font="symbol" text="base {preset === 'mono' ? 'mono-subtle' : 'mono-0'}">{icon}</span>
  {/if}
  {#if label}
    {label}
  {/if}
</Button.Root>
