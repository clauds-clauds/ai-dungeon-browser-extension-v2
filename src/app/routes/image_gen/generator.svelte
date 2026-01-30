<script lang="ts">
  // Storage here!
  import { settings } from "@/utils/storage";

  // Components here!
  import Button from "@/components/button.svelte";
  import Field from "@/components/field.svelte";
  import Input from "@/components/input.svelte";
  import Preview from "@/components/preview.svelte";
  import Row from "@/components/row.svelte";
  import Select from "@/components/select.svelte";
  import Spinner from "@/components/spinner.svelte";
  import Popover from "@/components/popover.svelte";

  // State for all the pretty image stuff here.
  let generating = $state<boolean>(false);
  let url = $state<string | undefined>(undefined);
  let warned = $state<boolean>(false);

  /**
   * Uses the OpenRouter API to generate an image based on the current prompt and settings.
   */
  async function generate() {
    // Print a crucial message to the screen.
    if (generating) {
      debug.warn(false, "You are already generating something! Wait a bit.");
      return;
    }

    let prompt = $settings.imageGenerationPrompt;

    if (prompt.trim() === "") {
      debug.warn(false, "Please enter a prompt before generating an image.");
      return;
    }

    // Flip the generating state!
    generating = true;

    // Debug some stuff.
    debug.log(false, "Generating image with prompt:", prompt);
    debug.log(false, "Using model:", $settings.imageGenerationModel);

    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${$settings.imageGenerationKey}`,
          "Content-Type": "application/json",
          "X-Title": "Mystery Extension (Web Extension)",
        },
        body: JSON.stringify({
          model: $settings.imageGenerationModel,
          messages: [{ role: "user", content: prompt }],
          image_config: {
            aspect_ratio: $settings.imageGenerationRatio,
          },
        }),
      });

      if (!response.ok) debug.error(false, "Failed to generate image! Response not OK:", response);

      const data = await response.json();
      url = data?.choices?.[0]?.message?.images?.[0]?.image_url?.url;

      // Check for usage data!
      if (data?.usage) {
        try {
          const balanceResponse = await fetch("https://openrouter.ai/api/v1/auth/key", {
            headers: { Authorization: `Bearer ${$settings.imageGenerationKey}` },
          });
          const balanceData = await balanceResponse.json();
          const remaining = balanceData?.data?.limit_remaining;
          const cost = data.usage.cost || 0;
          const balanceStr = remaining === null ? "Unlimited" : `$${Number(remaining).toFixed(4)}`;

          debug.success(false, `Cost: $${cost.toFixed(4)} • Remaining: ${balanceStr}`);
        } catch {}
      }

      if (!url) debug.error(false, "Something went very weird! The image is missing!");
    } catch (e) {
      debug.error(false, "Something went seriously wrong while generating an image:", e);
    } finally {
      generating = false;
    }
  }

  async function download() {
    if (url === undefined) {
      debug.warn(false, "You can't download nothing! Generate an image first.");
      return;
    }

    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `generated-image-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(blobUrl);
    } catch (e) {
      debug.error(false, "Failed to download image:", e);
    }
  }
</script>

<Preview ratio={{ x: 16, y: 9 }} src={url}>
  <div class="relative flex items-center justify-center w-full h-full text-mono-subtle text-8xl select-none">
    <button
      class="absolute top-2 right-2 flex items-center justify-center w-10 h-10 rounded-lg attention cursor-pointer transition"
      onclick={() => {
        if (generating && !warned) {
          debug.error(false, "You are generating an image right now! Are you sure you want to close?");
          warned = true;
          return;
        }
        imageGenerationState.open = false;
      }}
    >
      <span class="text-2xl text-mono-subtle" font="symbol">close</span>
    </button>
    {#if url === undefined}
      <span font="symbol" class="animate-breathe animate-ease-in-out animate-duration-16000">lens_blur</span>
    {/if}
  </div>
</Preview>
<div class="flex flex-row gap-2">
  <Field label="Image Model">
    <Select
      bind:value={$settings.imageGenerationModel}
      choices={[
        { icon: "image_arrow_up", label: "Nano Banana", value: "google/gemini-2.5-flash-image" },
        { icon: "image_arrow_up", label: "Nano Banana Pro", value: "google/gemini-3-pro-image-preview" },
        { icon: "image_arrow_up", label: "FLUX.2 Klein 4B", value: "black-forest-labs/flux.2-klein-4b" },
        { icon: "image_arrow_up", label: "FLUX.2 Pro", value: "black-forest-labs/flux.2-pro" },
        { icon: "image_arrow_up", label: "Seedream 4.5", value: "bytedance-seed/seedream-4.5" },
      ]}
    />
  </Field>

  <Field label="Aspect Ratio">
    <Row>
      <Select
        bind:value={$settings.imageGenerationRatio}
        choices={[
          { icon: "aspect_ratio", label: "16:9", value: "16:9" },
          { icon: "aspect_ratio", label: "9:16", value: "9:16" },
          { icon: "aspect_ratio", label: "4:3", value: "4:3" },
          { icon: "aspect_ratio", label: "3:4", value: "3:4" },
          { icon: "aspect_ratio", label: "1:1", value: "1:1" },
          { icon: "aspect_ratio", label: "21:9", value: "21:9" },
          { icon: "aspect_ratio", label: "2:1", value: "2:1" },
          { icon: "aspect_ratio", label: "2:3", value: "2:3" },
          { icon: "aspect_ratio", label: "3:2", value: "3:2" },
          { icon: "aspect_ratio", label: "5:4", value: "5:4" },
          { icon: "aspect_ratio", label: "4:5", value: "4:5" },
        ]}
      />

      <Popover>
        <Button icon="key" label="API Key" onclick={() => {}} />
        {#snippet content()}
          <Input bind:value={$settings.imageGenerationKey} placeholder="Enter your API key here!" />
        {/snippet}
      </Popover>

      <Button
        icon="download"
        label="Download"
        onclick={() => {
          download();
        }}
      />
    </Row>
  </Field>
</div>
<Field label="Prompt">
  <Row>
    <Input bind:value={$settings.imageGenerationPrompt} area={true} placeholder="Prompt the image model here!" />

    <button
      class="flex h-full w-164px p-x-4 p-y-2 cursor-pointer bg-surface text-mono-900 text-mono-0 attention rounded-lg uppercase items-center content-center justify-center transition {!generating
        ? 'filter-invert'
        : ''}"
      onclick={() => {
        generate();
      }}
    >
      {#if generating}
        <Spinner />
      {:else}
        Generate
      {/if}
    </button>
  </Row>
</Field>
