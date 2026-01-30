<script lang="ts">
  import type { Pill } from "@/utils/types";

  // Storage here!
  import { settings } from "@/utils/storage";

  // Components here!
  import Foldout from "@/components/foldout.svelte";
  import Pills from "@/components/pills.svelte";
  import Field from "@/components/field.svelte";
  import Switch from "@/components/switch.svelte";
  import ColorPicker from "@/components/color_picker.svelte";
  import Separator from "@/components/separator.svelte";
  import Slider from "@/components/slider.svelte";
  import Input from "@/components/input.svelte";
  import Row from "@/components/row.svelte";
  import RPGIcon from "@/components/ai_dungeon/rpg_icon.svelte";

  let pills: Pill[] = $derived.by(() => {
    return [
      { icon: "format_paint", label: "Appearance" },
      { icon: "cadence", label: "Audio", disabled: true },
      { icon: "videogame_asset", label: "RPG Mode", disabled: !$settings.rpgIntegration },
      { icon: "dashboard_2", label: "Interface" },
    ];
  });

  // svelte-ignore state_referenced_locally
  let pill = $state(pills[0].label);
</script>

<Pills bind:value={pill} {pills} />

{#if pill === "Appearance"}
  <Foldout icon="text_fields" label="Text">
    <Field
      label="Markdown"
      orientation="row"
      description="Toggle whether Markdown formatting rules are applied to the outputs. Text will not be bold, italic, strikethrough or underlined if this is disabled!"
    >
      <Switch bind:checked={$settings.textMarkdown} />
    </Field>

    <Field
      label="Bold Triggers"
      orientation="row"
      description="Toggle whether highlighted entries are displayed with bold formatting!"
    >
      <Switch bind:checked={$settings.textBold} />
    </Field>

    <Separator />

    <Field label="Default Color" description="Choose the default color for newly added entries!">
      <ColorPicker bind:value={$settings.textDefaultColor} />
    </Field>
  </Foldout>

  <Foldout icon="sticker" label="Icons">
    <Field
      label="Enabled"
      orientation="row"
      description="Toggle whether the icons are visible in your adventure. Text will not have inline icons if this is disabled!"
    >
      <Switch bind:checked={$settings.textIcons} />
    </Field>

    <Separator />

    <Field label="Icon Size" description="Set the pixel size of the inline icons!">
      <Slider bind:value={$settings.iconSize} min={0} max={40} reset={defaults.iconSize} />
    </Field>

    <Field label="Icon Roundness" description="Set the roundness (%) of the inline icons!">
      <Slider bind:value={$settings.iconRoundness} min={0} max={100} reset={defaults.iconRoundness} />
    </Field>

    <Field label="Icon Border Thickness" description="Set the pixel border thickness of the inline icons!">
      <Slider bind:value={$settings.iconBorderThickness} min={0} max={16} reset={defaults.iconBorderThickness} />
    </Field>
  </Foldout>

  <Foldout icon="tooltip" label="Tooltip">
    <Field
      label="Focus"
      orientation="row"
      description="Toggle whether tooltips are enabled! If you hover over highlights or tap on names then they will show up!"
    >
      <Switch bind:checked={$settings.tooltip} />
    </Field>

    {#if $settings.tooltip}
      <Field
        label="Focus"
        orientation="row"
        description="Toggle whether the focus feature is enabled! If this is on then an eye icon will appear in the top right corner of tooltips. Clicking it will focus the tooltip, keeping it open even when you move your mouse away."
      >
        <Switch bind:checked={$settings.tooltipFocus} />
      </Field>
    {/if}

    <Separator />

    <Field label="Delay" description="Set the delay (in milliseconds) before a tooltip disappears!">
      <Slider bind:value={$settings.tooltipDelay} min={0} max={2000} reset={defaults.tooltipDelay} step={50} />
    </Field>

    <Field label="Max Width" description="Set the maximum width (in pixels) of the tooltip!">
      <Slider bind:value={$settings.tooltipWidth} min={0} max={2048} reset={defaults.tooltipWidth} step={32} />
    </Field>

    <Field label="Max Height" description="Set the maximum height (in pixels) of the tooltip!">
      <Slider bind:value={$settings.tooltipHeight} min={0} max={2048} reset={defaults.tooltipHeight} step={32} />
    </Field>
  </Foldout>

  <Foldout icon="motion_mode" label="Effects">
    <Field label="Shiny Cards" orientation="row" description="Toggle whether cards in the adventure panel have a shiny effect!">
      <Switch bind:checked={$settings.developerShinyCards} />
    </Field>

    <Field label="Card Angle" description="Set the maximum tilt angle (in degrees) for the tilting 3D effect!">
      <Slider bind:value={$settings.interfaceCardAngle} min={0} max={45} reset={defaults.interfaceCardAngle} />
    </Field>
  </Foldout>

  <Foldout icon="folder_zip" label="Compression">
    <Field
      label="Quality"
      description="Set the compression quality for images (0 = worst, 100 = best)! You can apply this by adding a graphic or icon, clicking edit, and then selecting the compress option!"
    >
      <Slider bind:value={$settings.compressionQuality} min={0} max={100} reset={defaults.compressionQuality} />
    </Field>

    <Field label="Compression Resolution (Icon)" description="Set the maximum resolution for icon compression!">
      <Slider
        bind:value={$settings.compressionResolutionIcon}
        min={0}
        max={512}
        reset={defaults.compressionResolutionIcon}
        step={4}
      />
    </Field>

    <Field label="Compression Resolution (Graphics)" description="Set the maximum resolution for graphic compression!">
      <Slider
        bind:value={$settings.compressionResolutionGraphic}
        min={0}
        max={2048}
        reset={defaults.compressionResolutionGraphic}
        step={16}
      />
    </Field>
  </Foldout>
{/if}

{#if pill === "RPG Mode"}
  <Foldout icon="chess" label="Icons">
    <Field label="Hit Points" description="Set the icon used for hit points!">
      <Row>
        <RPGIcon icon={$settings.rpgHealthIcon} />
        <Input bind:value={$settings.rpgHealthIcon} />
      </Row>
    </Field>

    <Field label="Stamina" description="Set the icon used for stamina!">
      <Row>
        <RPGIcon icon={$settings.rpgStaminaIcon} color="text-pretty-yellow" />
        <Input bind:value={$settings.rpgStaminaIcon} />
      </Row>
    </Field>

    <Field label="Mana" description="Set the icon used for mana!">
      <Row>
        <RPGIcon icon={$settings.rpgManaIcon} color="text-pretty-blue" />
        <Input bind:value={$settings.rpgManaIcon} />
      </Row>
    </Field>

    <Field label="Weight" description="Set the icon used for weight!">
      <Row>
        <RPGIcon icon={$settings.rpgWeightIcon} color="text-mono-800" />
        <Input bind:value={$settings.rpgWeightIcon} />
      </Row>
    </Field>

    <Field label="Sanity" description="Set the icon used for sanity!">
      <Row>
        <RPGIcon icon={$settings.rpgSanityIcon} color="text-pretty-purple" />
        <Input bind:value={$settings.rpgSanityIcon} />
      </Row>
    </Field>
  </Foldout>
{/if}

{#if pill === "Interface"}
  <Foldout icon="moon_stars" label="Theme">
    <Field label="Zen Mode" orientation="row" description="Toggle whether all the descriptions (such as this one) are hidden!">
      <Switch bind:checked={$settings.developerZenMode} />
    </Field>

    <Field label="Theme Color" description="Set the main theme color!">
      <ColorPicker bind:value={$settings.developerThemeColor} />
    </Field>
  </Foldout>

  <Foldout icon="interests" label="Editor">
    <Field
      label="Show Misc Fields"
      orientation="row"
      description="Toggle whether miscellaneous fields (such as notes and entry) are shown in the card editor!"
    >
      <Switch bind:checked={$settings.interfaceShowMiscFields} />
    </Field>
  </Foldout>

  <Foldout icon="toast" label="Toasts">
    <Field label="Limit" description="Set the maximum number of toasts that can be displayed at once!">
      <Slider bind:value={$settings.developerToastLimit} min={0} max={10} reset={defaults.developerToastLimit} />
    </Field>
  </Foldout>
{/if}
