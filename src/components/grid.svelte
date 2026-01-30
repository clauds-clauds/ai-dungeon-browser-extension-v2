<script lang="ts">
  type Props = { children?: any; count?: number };
  let { children, count = 2 }: Props = $props();
</script>

<div class="grid gap-2 w-full h-fit flex-1 box-border" style="grid-template-columns: repeat({count}, minmax(0, 1fr))">
  {@render children?.()}
</div>
