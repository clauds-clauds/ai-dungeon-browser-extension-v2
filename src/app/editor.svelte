<script lang="ts">
  import { BitsConfig } from "bits-ui";

  // Components here!
  import Navbar from "@/components/navbar.svelte";
  import ScrollArea from "@/components/scroll_area.svelte";
  import Dialog from "@/components/dialog.svelte";

  // Routes here!
  import Settings from "./routes/editor/settings.svelte";
  import Adventure from "./routes/editor/adventure.svelte";

  // svelte-ignore non_reactive_update
  let portal: HTMLDivElement | undefined;
</script>

<div bind:this={portal} id="portal-editor" class="absolute inset-0 z-999999 pointer-events-none"></div>

<Dialog bind:open={editorState.open} darken={true} args="w-full h-full max-w-[512px] flex-col">
  <BitsConfig defaultPortalTo={portal}>
    <Navbar
      bind:value={editorState.tab}
      buttons={[
        { icon: "swords", label: "Adventure" },
        { icon: "tune", label: "Settings" },
      ]}
      onclose={() => {
        editorState.open = false;
        debug.warn(true, "You left the editor!");
      }}
    />

    <ScrollArea>
      {#if editorState.tab === "Settings"}
        <Settings />
      {:else}
        <Adventure />
      {/if}
    </ScrollArea>
  </BitsConfig>
</Dialog>
