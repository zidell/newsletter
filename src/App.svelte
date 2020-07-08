<script>
	import { restoreFromHash, updateToHash } from './store.js';
	import { onMount } from 'svelte';
	import Header from './Header.svelte';
	import Frame from './Frame.svelte';
	import Editor from './Editor.svelte';

	onMount(() => {
		if (location.hash.length > 200) {
			restoreFromHash();
		} else {
			// updateToHash();
		}
	});
</script>

<style lang="scss">
	#app {
		position: fixed;
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
	}
	:global(.btn) {
		display: inline-block;
		padding: 10px 23px;
		font-size: 0.8rem;
		border-radius: 2em;
		font-weight: bold;
		border: 1px solid #666;
		cursor: pointer;
		opacity: 0.8;
		&:hover,
		&:active {
			opacity: 1;
		}
		&:active,
		&:focus {
			outline: none;
			box-shadow: none;
		}
		&.btn-primary {
			background: #1c7cff;
			color: #fff;
			border: 0;
		}
		&.btn-outline {
			background: transparent;
			border: 1px solid #fff;
			color: #fff;
		}
		&.btn-xs {
			padding: 5px 8px;
		}
	}
</style>

<div id="app">
	<Header />
	<Frame />
	<Editor />
</div>
