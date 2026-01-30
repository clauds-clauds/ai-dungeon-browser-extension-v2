<script lang="ts">
  import { Accordion } from "bits-ui";
  import { slide } from "svelte/transition";

  type Props = { icon?: string; label: string; children: any };
  let { icon, label, children }: Props = $props();
  let open = $state<boolean>(false);
</script>

<Accordion.Root
  type="single"
  class="bg-mono-100 rounded-lg border-2px border-mono-200 transition has-[.group:hover]:attention surface-raised"
>
  <Accordion.Item>
    <Accordion.Header>
      <Accordion.Trigger
        class="group p-2 h-40px flex w-full gap-1 items-center text-mono-subtle cursor-pointer [&[data-state=open]>span:last-child]:rotate-180"
      >
        {#if icon}
          <span font="symbol">{icon}</span>
        {/if}
        <span class="text-sm uppercase">{label}</span>
        <span font="symbol" class="m-l-auto transition">keyboard_arrow_down</span>
      </Accordion.Trigger>
    </Accordion.Header>
    <Accordion.Content forceMount={true} class="flex flex-col gap-2 px-2 pb-2">
      {#snippet child({ props, open })}
        {#if open}
          <div {...props} transition:slide={{ duration: 200 }}>
            {@render children?.()}
          </div>
        {/if}
      {/snippet}
    </Accordion.Content>
  </Accordion.Item>
</Accordion.Root>
