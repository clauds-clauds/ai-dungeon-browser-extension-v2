<script lang="ts">
  import Preview from "../preview.svelte";

  let data = $derived.by(() => {
    return {
      graphic: focusState.card?.graphics?.[focusState.card?.graphic ?? 0] ?? "",
    };
  });
</script>

{#if data.graphic}
  <Preview
    ratio={{ x: 21, y: 9 }}
    src={data.graphic}
    onclick={(e: MouseEvent) => {
      e.stopPropagation();
    }}
  >
    <span
      onclick={(e: MouseEvent) => {
        e.stopPropagation();
        focusState.card = null;
      }}
      onkeydown={(e: KeyboardEvent) => {}}
      role="button"
      tabindex="0"
      class="absolute font-symbol right-2 select-none cursor-pointer">close</span
    >
  </Preview>
{/if}
