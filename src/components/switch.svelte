<script lang="ts">
  import { Switch } from "bits-ui";
  type Props = { checked: boolean };
  let { checked = $bindable() }: Props = $props();
</script>

<Switch.Root
  bind:checked
  class="flex w-60px h-32px m-l-auto shrink-0 rounded-full p-1 transition attention data-[state=unchecked]:bg-surface data-[state=checked]:bg-pretty-brand cursor-pointer border-2px border-surface-out data-[state=checked]:border-pretty-brand"
>
  <Switch.Thumb
    class="flex h-full aspect-ratio-square bg-mono-900 rounded-full transition {checked ? 'translate-x-28px' : 'translate-x-0'}"
  />
</Switch.Root>
