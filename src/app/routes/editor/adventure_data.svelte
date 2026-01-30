<script lang="ts">
  // Storage here!
  import { settings, adventures } from "@/utils/storage";
  import type { Adventure, VisualCard } from "@/utils/types";

  // Components here!
  import Button from "@/components/button.svelte";
  import Field from "@/components/field.svelte";
  import Foldout from "@/components/foldout.svelte";
  import Input from "@/components/input.svelte";
  import Row from "@/components/row.svelte";
  import Select from "@/components/select.svelte";
  import Separator from "@/components/separator.svelte";

  type Props = {};
  let {}: Props = $props();

  let newAdventureName = $state<string>("");
  let renameTo = $state<string>("");
  let currentAdventureName = $derived($adventures[$settings.adventureId]?.name ?? "Unnamed Adventure");

  let adventureChoices = $derived.by(() => {
    return Object.entries($adventures).map(([id, adv]) => ({
      value: id,
      label: adv.name || id,
      icon: "auto_stories",
    }));
  });

  $effect(() => {
    renameTo = currentAdventureName;
  });

  function createAdventure() {
    if (!newAdventureName.trim()) {
      debug.error(false, "Please enter a name for your new adventure!");
      return;
    }

    const id = crypto.randomUUID();
    adventures.put(id, { name: newAdventureName.trim(), visualCards: [] });
    $settings.adventureId = id;
    debug.success(false, `Created new adventure: ${newAdventureName.trim()}`);
    newAdventureName = "";
  }

  function renameAdventure() {
    if (!renameTo.trim()) {
      debug.error(false, "Adventure name cannot be empty!");
      return;
    }

    adventures.patch($settings.adventureId, { name: renameTo.trim() });
    debug.success(false, `Renamed adventure to: ${renameTo.trim()}`);
  }

  function exportAdventures() {
    const data = JSON.stringify($adventures, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `adventures-export-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    debug.success(false, "Adventures exported successfully!");
  }

  function importAdventures() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      try {
        const text = await file.text();
        const imported = JSON.parse(text) as Record<string, Adventure>;

        // Validate the imported data structure
        for (const [id, adv] of Object.entries(imported)) {
          if (!adv.name || !Array.isArray(adv.visualCards)) {
            debug.error(false, `Invalid adventure data for: ${id}`);
            return;
          }
        }

        // Merge with existing adventures
        let addedCount = 0;
        let skippedCount = 0;

        for (const [id, adv] of Object.entries(imported)) {
          if ($adventures[id]) {
            skippedCount++;
          } else {
            adventures.put(id, adv);
            addedCount++;
          }
        }

        debug.success(false, `Imported ${addedCount} adventures (skipped ${skippedCount} duplicates).`);
      } catch (err) {
        debug.error(false, "Failed to import adventures. Invalid JSON file.");
      }
    };
    input.click();
  }

  async function importFromAIDungeon() {
    // Set some cooldown, I think 15 seconds is fair. Because I can change adventures in about that time.
    // So it's not too spammy.
    const cooldown = 15000;

    // Check if enough time has passed since the last request
    if ($settings.queryLastRequest + cooldown > Date.now()) {
      // Log an error if the user is spamming requests.
      debug.error(false, `Please wait before making another request. Cooldown between requests is ${cooldown / 1000} seconds.`);

      // Abort before attempting to send any query.
      return;
    }

    // Attempt to get the auth token, these are stored based on release channel.
    const token = query.authToken();

    // If there is no token, abort.
    if (!token) {
      debug.error(false, "No auth token found! Cannot proceed.");
      return;
    }

    $settings.queryLastRequest = Date.now(); // Update the last request time.
    const data = await query.adventureData();

    // Abort if no data was found.
    if (!data?.storyCards) {
      debug.error(false, "No story cards found!");
      return;
    }

    // Now convert the story cards to visual cards.
    const newVisualCards: VisualCard[] = [];
    for (const card of data.storyCards) {
      newVisualCards.push({
        id: crypto.randomUUID(),
        name: card.title || "Untitled",
        type: card.type || "character",
        entry: card.value || "",
        triggers: card.keys || "",
        notes: card.description || "",
        icons: [],
        icon: 0,
        graphics: [],
        graphic: 0,
        color: "#f8ae2c",
        limit: "none",
      });
    }

    // Now push the new visual cards to the default adventure.
    adventures.update((advs) => {
      const adventure = advs[$settings.adventureId] || { name: "Default Adventure", visualCards: [] };
      const existingNames = new Set(adventure.visualCards.map((c) => c.name));
      const uniqueNewCards = newVisualCards.filter((c) => !existingNames.has(c.name));

      if (uniqueNewCards.length === 0) {
        debug.warn(false, "No new cards to add (all duplicates).");
        return advs;
      }

      debug.success(
        false,
        `Added ${uniqueNewCards.length} new cards (skipped ${newVisualCards.length - uniqueNewCards.length} duplicates).`,
      );

      return {
        ...advs,
        [$settings.adventureId]: {
          ...adventure,
          visualCards: [...adventure.visualCards, ...uniqueNewCards],
        },
      };
    });
  }

  /**
   * Deletes the current adventure (with confirmation).
   */
  function deleteAdventure() {
    if (Object.keys($adventures).length <= 1) {
      debug.error(false, "You must have at least one adventure!");
      return;
    }

    const name = currentAdventureName;
    const idToDelete = $settings.adventureId;

    // Switch to another adventure first
    const remainingIds = Object.keys($adventures).filter((id) => id !== idToDelete);
    $settings.adventureId = remainingIds[0];

    // Then delete
    adventures.remove(idToDelete);
    debug.success(false, `Deleted adventure: ${name}`);
  }
</script>

<Foldout icon="auto_stories" label="Current Adventure">
  <Field label="Select Adventure" description="Choose which adventure to edit and display.">
    <Select
      bind:value={$settings.adventureId}
      choices={adventureChoices}
      placeholder="Select an adventure..."
      icon="folder_open"
    />
  </Field>

  <Separator />

  <Field label="Rename Adventure" description="Give your current adventure a new name.">
    <Row>
      <Input bind:value={renameTo} placeholder="Enter a new name..." />
      <Button icon="edit" label="Rename" onclick={renameAdventure} />
    </Row>
  </Field>

  <Separator />

  <Field label="Delete Adventure" description="Permanently delete the current adventure. This cannot be undone!">
    <Button icon="delete_forever" label="Delete" onclick={deleteAdventure} />
  </Field>
</Foldout>

<Foldout icon="add_circle" label="Create Adventure">
  <Field label="New Adventure" description="Create a brand new adventure to organize your visual cards.">
    <Row>
      <Input bind:value={newAdventureName} placeholder="Enter adventure name..." />
      <Button icon="add" label="Create" preset="pretty" onclick={createAdventure} />
    </Row>
  </Field>
</Foldout>

<Foldout icon="sync_alt" label="Import & Export">
  <Field label="Export Adventures" description="Download all your adventures as a JSON file for backup or sharing.">
    <Button icon="download" label="Export to JSON" onclick={exportAdventures} />
  </Field>

  <Separator />

  <Field label="Import Adventures" description="Load adventures from a previously exported JSON file.">
    <Button icon="upload" label="Import from JSON" onclick={importAdventures} />
  </Field>

  <Separator />

  <Field label="AI Dungeon Sync" description="Automatically import story cards from your current AI Dungeon adventure.">
    <Button icon="cloud_download" label="Import from AI Dungeon" onclick={importFromAIDungeon} />
  </Field>
</Foldout>
