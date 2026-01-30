<script lang="ts">
  import { ScrollArea } from "bits-ui";

  type Props = { children?: any };
  let { children }: Props = $props();
</script>

<ScrollArea.Root class="relative overflow-hidden">
  <ScrollArea.Viewport class="h-full w-full" ontouchmove={(e: TouchEvent) => e.stopPropagation()}>
    <div class="flex flex-1 p-2 flex-col gap-2">
      {@render children?.()}
    </div>
  </ScrollArea.Viewport>
  <ScrollArea.Scrollbar orientation="vertical">
    <ScrollArea.Thumb />
  </ScrollArea.Scrollbar>
  <ScrollArea.Corner />
</ScrollArea.Root>
