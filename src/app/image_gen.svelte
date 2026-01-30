<script lang="ts">
  import { BitsConfig } from "bits-ui";

  // Components here!
  import Dialog from "@/components/dialog.svelte";

  // Routes here!
  import Generator from "./routes/image_gen/generator.svelte";

  // svelte-ignore non_reactive_update
  let portal: HTMLDivElement | undefined;
</script>

<div bind:this={portal} id="portal-image-generator" class="absolute inset-0 z-999999 pointer-events-none"></div>

<Dialog bind:open={imageGenerationState.open} args="w-full max-w-[1280px] h-fit p-2" darken={true}>
  <BitsConfig defaultPortalTo={portal}>
    <div class="flex flex-col gap-2 flex-1">
      <Generator />
    </div>
  </BitsConfig>
</Dialog>
