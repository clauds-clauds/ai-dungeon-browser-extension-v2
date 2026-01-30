<script lang="ts">
  import { Toaster } from "svelte-sonner";

  // Storage here!
  import { settings } from "@/utils/storage";

  type Props = { preset: "dev" | "adventure" };
  let { preset = "dev" }: Props = $props();

  const devIcons: string[] = ["", "check_circle", "emergency_home", "info", "warning"];
  const adventureIcons: string[] = ["", "crown", "swords", "history_edu", "mode_heat"];

  let iconPack: string[] = $derived.by(() => {
    if (preset === "dev") return devIcons;
    return adventureIcons;
  });
</script>

<Toaster
  expand
  position={preset === "dev" ? "bottom-right" : "top-left"}
  visibleToasts={$settings.developerToastLimit}
  toastOptions={{
    unstyled: true,
    classes: {
      toast:
        "group flex flex-row gap-2 items-center justify-center bg-mono-0 p-2 text-sm border-mono-100 border-1px rounded-lg",
      title:
        "group-data-[type=error]:text-pretty-red group-data-[type=success]:text-pretty-green text-pretty-blue group-data-[type=warning]:text-pretty-yellow font-bold",
      description: "text-mono-900",
    },
  }}
>
  {#snippet loadingIcon()}
    <span font="symbol">{iconPack[0]}</span>
  {/snippet}
  {#snippet successIcon()}
    <span font="symbol" text="pretty-green 2xl">{iconPack[1]}</span>
  {/snippet}
  {#snippet errorIcon()}
    <span font="symbol" text="pretty-red 2xl">{iconPack[2]}</span>
  {/snippet}
  {#snippet infoIcon()}
    <span font="symbol" text="pretty-blue 2xl">{iconPack[3]}</span>
  {/snippet}
  {#snippet warningIcon()}
    <span font="symbol" text="pretty-yellow 2xl">{iconPack[4]}</span>
  {/snippet}
</Toaster>
