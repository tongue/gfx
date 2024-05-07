<script lang="ts">
	let { value = $bindable(), min, max, step = 1 }: {
		value: number;
		min: number;
		max: number;
		step: number;
	} = $props();

	let input_text_size = Math.round(Math.max(max.toString().length, (max * step).toString().length));
</script>

<div>
	<input type="range" bind:value {min} {max} {step} />
	<input type="text" bind:value style="width: {input_text_size}ch" />
</div>

<style>
	div {
		display: flex;
		align-items: center;
		gap: 1ch;
	}

	input[type=range] {
		flex: 1;
	}

	input[type=text] {
		text-align: right;
	}
</style>
