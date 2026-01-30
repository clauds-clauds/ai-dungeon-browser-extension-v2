<script lang="ts">
  // Basic imports here!
  import { BitsConfig } from "bits-ui";
  import { VisualCard } from "@/utils/types";

  // Storage here!
  import { settings, adventures } from "@/utils/storage";

  // Components here!
  import Button from "@/components/button.svelte";
  import Field from "@/components/field.svelte";
  import Foldout from "@/components/foldout.svelte";
  import Input from "@/components/input.svelte";
  import Pills from "@/components/pills.svelte";
  import ScrollArea from "@/components/scroll_area.svelte";
  import Select from "@/components/select.svelte";
  import FileDrop from "@/components/file_drop.svelte";
  import ColorPicker from "@/components/color_picker.svelte";
  import Row from "@/components/row.svelte";
  import Dropdown from "@/components/dropdown.svelte";
  import Carousel from "@/components/carousel.svelte";
  import Preview from "@/components/preview.svelte";

  // Props here!
  type Props = { adventureId?: string };
  let { adventureId = "default" }: Props = $props();

  // Pills here!
  let pills: Pill[] = [
    { icon: "notes", label: "Details" },
    { icon: "design_services", label: "Visuals" },
  ];
  let pill = $state(pills[0].label);

  // Visual card data here!
  const templateCard: VisualCard = {
    id: "",
    name: "",
    type: "character",
    entry: "",
    triggers: "",
    notes: "",
    icons: [],
    icon: 0,
    graphics: [],
    graphic: 0,
    color: $settings.textDefaultColor,
    limit: "none",
  };
  let draft = $state<VisualCard>({ ...templateCard });

  type MediaSection = {
    key: "icons" | "graphics";
    icon: string;
    label: string;
    onCompress: (file: string) => void;
  };

  const mediaSections: MediaSection[] = [
    {
      key: "icons",
      icon: "sticker",
      label: "Icons",
      onCompress: async (file) => {
        try {
          const compressed = await data.compressImage(
            file,
            $settings.compressionResolutionIcon,
            $settings.compressionQuality,
            true,
          );
          const index = draft.icons.indexOf(file);
          if (index !== -1) draft.icons[index] = compressed;
        } catch (error) {
          debug.error(false, "Failed to compress icon:", error);
        }
      },
    },
    {
      key: "graphics",
      icon: "texture",
      label: "Graphics",
      onCompress: async (file) => {
        try {
          const compressed = await data.compressImage(
            file,
            $settings.compressionResolutionGraphic,
            $settings.compressionQuality,
            false,
          );
          const index = draft.graphics.indexOf(file);
          if (index !== -1) draft.graphics[index] = compressed;
        } catch (error) {
          debug.error(false, "Failed to compress graphic:", error);
        }
      },
    },
  ];

  $effect(() => {
    if (cardEditorState.open) {
      const adventure = $adventures[adventureId];
      const existing = cardEditorState.cardId ? adventure?.visualCards.find((c) => c.id === cardEditorState.cardId) : null;
      Object.assign(draft, existing ? JSON.parse(JSON.stringify(existing)) : templateCard);
    }
  });

  // svelte-ignore non_reactive_update
  let portal: HTMLDivElement | undefined;
</script>

<div bind:this={portal} id="portal-card-editor" class="absolute inset-0 z-999999 pointer-events-none"></div>

<BitsConfig defaultPortalTo={portal}>
  <div class="flex items-center justify-between flex-row gap-2 p-2 border-b-1px border-mono-100 relative">
    <Dropdown
      groups={[
        {
          name: "Group 1",
          buttons: [
            { icon: "copy_all", label: "Duplicate" },
            { icon: "frame_bug", label: "Debug" },
          ],
        },
        {
          name: "Group 2",
          buttons: [
            {
              icon: "delete_forever",
              label: "Delete",
              onclick: () => {
                const adventure = $adventures[adventureId];
                if (!adventure || !cardEditorState.cardId) {
                  cardEditorState.open = false;
                  return;
                }
                const cards = adventure.visualCards.filter((c) => c.id !== cardEditorState.cardId);
                adventures.patch(adventureId, { visualCards: cards });
                debug.success(false, `You have successfully deleted ${draft.name || "Untitled Card"}!`);
                cardEditorState.open = false;
              },
            },
          ],
        },
      ]}
    >
      <button class="w-40px h-40px bg-surface border-surface-out border-2px rounded-full text-center attention cursor-pointer">
        <span font="symbol" text="mono-900">more_horiz</span>
      </button>
    </Dropdown>
    <span text="sm" class="absolute left-1/2 -translate-x-1/2">{draft.name ? draft.name : "New Visual Card"}</span>
    <Button
      icon="select_check_box"
      label="Finish"
      onclick={() => {
        const adventure = $adventures[adventureId];
        if (!adventure) return;
        draft.id = draft.id || crypto.randomUUID();
        draft.name = draft.name || "Untitled Card";
        const cards = cardEditorState.cardId
          ? adventure.visualCards.map((c) => (c.id === cardEditorState.cardId ? draft : c))
          : [...adventure.visualCards, draft];
        adventures.patch(adventureId, { visualCards: cards });
        cardEditorState.open = false;
      }}
    />
  </div>

  <ScrollArea>
    <Pills bind:value={pill} {pills} />

    {#if pill === "Details"}
      <Row>
        <Field label="Type">
          <Select
            bind:value={draft.type}
            choices={[
              { icon: "person", label: "Character", value: "character" },
              { icon: "swords", label: "Class", value: "class" },
              { icon: "genetics", label: "Race", value: "race" },
              { icon: "explore", label: "Location", value: "location" },
              { icon: "chess", label: "Faction", value: "faction" },
              { icon: "build", label: "Custom", value: "custom" },
            ]}
          />
        </Field>

        <Field label="Limit">
          <Select
            bind:value={draft.limit}
            choices={[
              { icon: "remove_selection", label: "None", value: "none" },
              { icon: "book_2", label: "Story", value: "story" },
              { icon: "bolt", label: "Action", value: "action" },
              { icon: "robot", label: "Protagonist", value: "protagonist" },
            ]}
          />
        </Field>
      </Row>

      <Field label="Name">
        <Input bind:value={draft.name} placeholder="Enter a name..." />
      </Field>

      {#if $settings.interfaceShowMiscFields}
        <Field label="Entry">
          <Input bind:value={draft.entry} placeholder="Enter some detais..." area={true} />
          <span text="sm" class="m-l-auto">
            {draft.entry.length}
            <span text="mono-subtle" class="inline-block text-[0.65em] translate-y-[-0.35em] line-height-1"> /1000 </span>
          </span>
        </Field>
      {/if}

      <Field label="Triggers">
        <Input bind:value={draft.triggers} placeholder="Enter some triggers..." />
      </Field>

      <Field label="Color">
        <ColorPicker bind:value={draft.color} />
      </Field>

      {#if $settings.interfaceShowMiscFields}
        <Field label="Notes">
          <Input bind:value={draft.notes} placeholder="Enter some notes..." area={true} />
        </Field>
      {/if}
    {/if}

    {#if pill === "Visuals"}
      {#each mediaSections as section}
        <Foldout icon={section.icon} label={section.label}>
          <FileDrop bind:files={draft[section.key]} />

          {#if draft[section.key]?.length > 0}
            <Carousel count={draft[section.key].length}>
              {#each draft[section.key] as file}
                <div class="h-64 w-full flex">
                  <Preview src={file} ratio={{ x: 21, y: 9 }}>
                    <div class="relative flex items-end justify-end w-full h-full p-2 gap-2">
                      <Dropdown
                        groups={[
                          {
                            name: "Group 1",
                            buttons: [
                              {
                                icon: "folder_zip",
                                label: "Compress",
                                onclick: () => section.onCompress(file),
                              },
                              {
                                icon: "select",
                                label: "Select",
                                onclick: () => {
                                  const idx = draft[section.key].indexOf(file);
                                  if (section.key === "icons") draft.icon = idx;
                                  if (section.key === "graphics") draft.graphic = idx;
                                  debug.success(
                                    false,
                                    `${section.label.slice(0, -1)} ${idx + 1} is now the active ${section.key.slice(0, -1)}!`,
                                  );
                                },
                              },
                            ],
                          },
                          {
                            name: "Group 2",
                            buttons: [
                              {
                                icon: "delete_forever",
                                label: "Delete",
                                onclick: () => {
                                  draft[section.key] = draft[section.key].filter((f) => f !== file);
                                },
                              },
                            ],
                          },
                        ]}
                      >
                        <Button icon="edit_square" label="Edit" />
                      </Dropdown>
                    </div>
                  </Preview>
                </div>
              {/each}
            </Carousel>
          {/if}
        </Foldout>
      {/each}
    {/if}
  </ScrollArea>
</BitsConfig>
