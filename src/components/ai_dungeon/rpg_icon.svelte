<script lang="ts">
  type Props = { icon: string; color?: string };
  let { icon, color = "text-pretty-red" }: Props = $props();
</script>

<span
  font="symbol"
  class="{color} bg-mono-300 border-2px text-2xl border-mono-400 rounded-lg h-40px flex items-center text-center justify-center aspect-square"
>
  {icon}
</span>
