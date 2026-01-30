<script lang="ts">
  type Props = { value: string };
  let { value = $bindable() }: Props = $props();
</script>

<div
  class="flex flex-row gap-2 w-full max-h-40px bg-surface rounded-lg justify-center items-center attention border-2px border-surface-out focus-within:border-pretty-brand"
>
  <span font="symbol" p="l-2" class="select-none text-mono-subtle">search</span>
  <input
    bind:value
    placeholder="Search"
    class="flex-1 flex-grow min-h-40px text-sm outline-0 placeholder-mono-subtle b-0"
    id="le-search"
    aria-label="Search"
  />
</div>
