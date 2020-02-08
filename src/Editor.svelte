<script>
	import { editor } from './store.js';
</script>

<style lang="scss">
	.editor {
		display: none;
		position: fixed;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.8);
		z-index: 100;
		align-items: center;
		justify-content: center;
		&.enabled-true {
			display: flex;
		}
		.editor-inner {
			background: #fff;
			padding: 20px;
			width: 100%;
			height: 100%;
			max-width: 400px;
			max-height: 300px;
			box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
			display: flex;
			flex-direction: column;
			textarea {
				width: 100%;
				flex: 1;
				border: 0;
				padding: 15px;
				font-size: 0.9rem;
				line-height: 1.6em;
			}
			.text-center {
				text-align: center;
				padding-top: 15px;
			}
		}
	}
</style>

<div class="editor enabled-{$editor.enabled}">
	<div class="editor-inner">
		<textarea
			id="editor-textarea"
			cols="30"
			rows="10"
			readonly="{$editor.readonly}"
			bind:value={$editor.content}
		/>
		<div class="text-center">
			{#if $editor.readonly === false}
			<button class="btn btn-primary" on:click="{editor.confirm}">Confirm</button>
			{/if}
			<button class="btn" on:click="{editor.close}">Close</button>
		</div>
	</div>
</div>
