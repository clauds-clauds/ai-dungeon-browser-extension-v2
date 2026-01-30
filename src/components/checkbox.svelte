<script lang="ts">
  import { Checkbox } from "bits-ui";
  type Props = { checked: boolean };
  let { checked = $bindable() }: Props = $props();
</script>

<Checkbox.Root
  bind:checked
  class="flex items-center justify-center text-center bg-surface data-[state=checked]:bg-pretty-brand attention w-24px h-24px aspect-square rounded-lg transition border-2px data-[state=checked]:border-pretty-brand border-surface-out cursor-pointer"
>
  {#snippet children({ checked, indeterminate })}
    <span font="symbol" text="xl center" class={checked ? "text-mono-0" : "text-mono-900"}>
      {#if checked}
        check
      {:else}
        close_small
      {/if}
    </span>
  {/snippet}
</Checkbox.Root>
