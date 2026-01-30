<script lang="ts">
  import { settings } from "@/utils/storage";

  type Props = { label?: string; orientation?: "column" | "row"; description?: string; children?: any };
  let { label, description, orientation = "column", children }: Props = $props();
</script>

<div class="flex flex-col gap-1 w-full h-fit">
  <span class="uppercase text-xs text-mono-subtle">{label}</span>

  {#if orientation === "row"}
    <div class="flex flex-row gap-3 w-full h-fit items-center justify-between">
      {#if description && !$settings.developerZenMode}
        <span class="text-sm">{description}</span>
      {/if}
      {@render children?.()}
    </div>
  {:else}
    {#if description && !$settings.developerZenMode}
      <span class="text-sm">{description}</span>
    {/if}
    {@render children?.()}
  {/if}
</div>
