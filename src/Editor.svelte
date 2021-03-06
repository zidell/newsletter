<script>
	import quill from 'quill';
	import jQuery from 'jquery';
	import { editor } from './store.js';
	import { onMount, afterUpdate } from 'svelte';

	window.editor = null;
	onMount(() => {
		var toolbarOptions = [
			['bold', 'strike', 'italic', 'underline'], // toggled buttons
			[{ color: [] }, { background: [] }], // dropdown with defaults from theme
			['clean'], // remove formatting button
		];
		window.editor = new quill('#editor', {
			// debug: 'info',
			modules: {
				toolbar: toolbarOptions,
			},
			placeholder: '',
			theme: 'snow',
		});
		window.editor.id = null;
		window.editor.customFocus = () => {
			if (window.isTouch) {
				if (/iphone|ipad/i.test(navigator.userAgent)) {
					window.editor.root.blur();
				}
			} else {
				if($editor.readonly) {
					jQuery('#editor-textarea').focus().select();
				} else {
					window.editor.focus();
				}
			}
		};
		window.editor.getHtml = () => {
			// we want the content, not some Delta thingy or plain text without the formatting
			return window.editor.root.innerHTML;
		};

		window.editor.setHtml = text => {
			if($editor.readonly) {
				jQuery('#editor-textarea').val(text);
			} else {
				// resets the window.editor to empty
				// console.log('setHtml', text);
				window.editor.setContents([]);
				// initialize the content to exactly what we have in our server (i.e. what we saved the last time as validated/sanitized by our server)
				window.editor.clipboard.dangerouslyPasteHTML(0, text);
				window.editor.beforeContent = window.editor.getHtml();
				window.editor.customFocus();
				window.editor.history.clear();
				window.editor.root.scrollTop = 0;
			}
		};

		window.editor.on('text-change', function() {
			const content = window.editor.getHtml();
			if (window.editor.beforeContent !== content) {
				window.editor.beforeContent = content;
				// currentNote.addSavingStack('content', content);
			}
		});
	});
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
			&.readonly-y {
				#editor-textarea {
					display: block;
				}
				#editor {
					display: none;
				}
				:global(.ql-toolbar) {
					display: none!important;
				}
			}
			&.readonly-n {
				#editor-textarea {
					display: none;
				}
				#editor {
					display: block;
				}
			}
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
	<div class="editor-inner readonly-{$editor.readonly ? 'y' : 'n'}">
		<div id="editor"></div>
		<textarea
			id="editor-textarea"
			cols="30"
			rows="10"
			readonly="readonly"
		/>

		<div class="text-center">
			{#if $editor.readonly === false}
			<button class="btn btn-primary" on:click="{editor.confirm}">
				Confirm
			</button>
			{/if}
			<button class="btn" on:click="{editor.close}">Close</button>
		</div>
	</div>
</div>
