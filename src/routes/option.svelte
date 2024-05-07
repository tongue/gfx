<script lang="ts">
	import Palette from './palette.svelte';
	import Range from './range.svelte';

	let { title, controls, value = $bindable() }: {
		title: string;
		controls: { type: string; min?: number; max?: number; step?: number }[];
		value: any;
	} = $props();
</script>

<fieldset>
	<legend>{title}</legend>
	{#each controls as { type, min, max, step }, i}
		{#if type === 'range'}
			{#if controls.length > 1}
				<Range bind:value={value[i]} min={min ?? 0} max={max ?? 100} step={step ?? 1} />
			{:else}
				<Range bind:value={value} min={min ?? 0} max={max ?? 100} step={step ?? 1} />
			{/if}
		{:else if type === 'color'}
			<Palette bind:value={value} />
		{:else if type === 'checkbox'}
			<input type="checkbox" bind:checked={value} />
		{:else}
			<p>Unknown control type: {type}</p>
		{/if}
	{/each}
</fieldset>
