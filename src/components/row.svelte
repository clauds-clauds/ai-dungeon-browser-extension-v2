<script lang="ts">
  type Props = { children: any };
  let { children }: Props = $props();
</script>

<div class="flex flex-row gap-2">
  {@render children?.()}
</div>
