<script lang="ts">
  import { Separator } from "bits-ui";

  type Props = { orientation?: "horizontal" | "vertical" };
  let { orientation = "horizontal" }: Props = $props();
</script>

<Separator.Root
  {orientation}
  class="flex flex-shrink-0 bg-mono-0 {orientation === 'horizontal' ? 'w-full h-1px m-t-1 m-b-1' : 'w-1px h-full'}"
></Separator.Root>
