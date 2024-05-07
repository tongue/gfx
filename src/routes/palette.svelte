<script lang="ts">
	let { value = $bindable() }: {
		value: string[];
	} = $props();

	function add_color() {
		value = [...value, '#ffffff'];
	}

	function remove_color(color: string) {
		return () => {
			value = value.filter((c) => c !== color);
		};
	}
</script>
<ol>
	{#each value as color, idx}
		<li>
			<input type="color" bind:value={value[idx]} />
			{#if idx > 0}
				<button onclick={remove_color(color)}>X</button>
			{/if}
		</li>
	{/each}
	<li>
		<button onclick={add_color}>+</button>
	</li>
</ol>

<style>
	ol {
		display: flex;
		gap: 0.5em;
		list-style: none;
		padding: 0;
		flex-wrap: wrap;
		align-items: center;
	}

	ol li {
		position: relative;
	}

	ol li:not(:last-child) button {
		position: absolute;
		right: 0;
		top: 0;
	}
</style>
