<script lang="ts">
  // Basic imports here!
  import { tracks, adventures } from "@/utils/storage";

  // Storage here!
  import { settings } from "@/utils/storage";

  // Components here!
  import Card from "@/components/card.svelte";
  import Dialog from "@/components/dialog.svelte";
  import Grid from "@/components/grid.svelte";
  import Pills from "@/components/pills.svelte";
  import Search from "@/components/search.svelte";

  // Routes here!
  import CardEditor from "./card_editor.svelte";
  import AdventureData from "./adventure_data.svelte";
  import Row from "@/components/row.svelte";
  import Checklist from "@/components/checklist.svelte";
  import ImportTrigger from "@/components/other/import_trigger.svelte";

  let pill = $state<string>("");
  let search = $state<string>("");

  // This is for global audio tracks.
  // For now I just use this workaround till I have a well-done audio manager.
  // So sorry about that :(
  if (!$tracks["default"]) {
    tracks.put("default", { name: "Default Track", data: [] });
  }

  // This is for the default adventure.
  if (!$adventures[$settings.adventureId]) {
    adventures.put($settings.adventureId, { name: `${$settings.adventureId} Adventure`, visualCards: [] });
  }

  // Filters.
  let filters: Record<string, boolean> = $state({
    Character: true,
    Class: true,
    Race: true,
    Location: true,
    Faction: true,
    Custom: true,
  });

  let filteredIn = $derived(
    ($adventures[$settings.adventureId]?.visualCards ?? []).filter((card) => {
      if (search && !card.name.toLowerCase().includes(search.toLowerCase())) return false;

      const type = card.type || "Custom";
      const key = type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();

      return filters[key] ?? filters["Custom"];
    }),
  );
</script>

<Pills
  bind:value={pill}
  pills={[
    { icon: "interests", label: "Visual Cards", extra: `${$adventures[$settings.adventureId]?.visualCards.length ?? 0}` },
    { icon: "database", label: "Manage" },
  ]}
/>

{#if pill === "Visual Cards"}
  <Row>
    <Search bind:value={search} />
    <Checklist bind:values={filters}>
      <ImportTrigger />
    </Checklist>
  </Row>

  <Grid>
    <Dialog bind:open={cardEditorState.open} args="w-full h-full max-w-[512px] flex-col">
      <CardEditor adventureId={$settings.adventureId} />

      {#snippet trigger()}
        <Card
          onclick={() => {
            cardEditorState.cardId = null;
            cardEditorState.open = true;
            debug.log(false, "You opened the visual card editor!");
          }}
          extra="w-full aspect-2/3 p-3"
        >
          <div
            class="flex flex-col items-center justify-center gap-2 text-center w-full h-full text-pretty-brand select-none"
            style="min-height:100%"
          >
            <span class="font-symbol text-4xl">add</span>
            <span class="text-sm">Add characters, locations, and more!</span>
          </div>
        </Card>
      {/snippet}
    </Dialog>

    {#each filteredIn as visualCard (visualCard.id)}
      {@const manyIcons = visualCard.icons.length !== 1}
      {@const manyGraphics = visualCard.graphics.length !== 1}
      <Card
        onclick={() => {
          cardEditorState.cardId = visualCard.id;
          cardEditorState.open = true;
        }}
        url={visualCard.graphics[visualCard.graphic]}
        extra="w-full aspect-2/3 p-3"
      >
        {#if visualCard.graphics?.length > 0}
          <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none"></div>
        {/if}

        <div class="relative flex flex-col w-full m-t-auto text-center text-mono-900 z-10">
          <span text="xl" class="font-bold tracking-widest uppercase select-none">{visualCard.name}</span>
          <span text="sm"
            >{visualCard.icons.length}
            {manyIcons ? "icons" : "icon"} • {visualCard.graphics.length}
            {manyGraphics ? "graphics" : "graphic"}</span
          >
        </div>
      </Card>
    {/each}
  </Grid>
{/if}

{#if pill === "Manage"}
  <AdventureData />
{/if}
