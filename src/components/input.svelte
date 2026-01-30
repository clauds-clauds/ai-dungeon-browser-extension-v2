<script lang="ts">
  type Props = { value: string; placeholder?: string; area?: boolean; readonly?: boolean };
  let { value = $bindable(), placeholder = "Enter some text!", area = false, readonly = false }: Props = $props();
</script>

{#if area}
  <textarea
    bind:value
    {placeholder}
    {readonly}
    class="flex w-full h-80px bg-surface placeholder-mono-subtle justify-center items-center outline-0 rounded-lg attention border-2px border-surface-out focus:border-pretty-brand p-l-2 p-t-2 min-h-40px text-sm read-only:text-mono-subtle"
  ></textarea>
{:else}
  <input
    bind:value
    {placeholder}
    {readonly}
    class="flex w-full h-40px bg-surface placeholder-mono-subtle justify-center items-center outline-0 rounded-lg attention border-2px border-surface-out focus:border-pretty-brand p-l-2 text-sm read-only:text-mono-subtle"
  />
{/if}
