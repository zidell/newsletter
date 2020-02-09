<script>
	import { mode, content, editor } from './store.js';
	import jQuery from 'jquery';
	import { onMount } from 'svelte';

	const fetchCss = async url => {
		const response = await fetch(`/${url}`);
		const css = await response.text();
		jQuery('#template-css').html(css);
	};

	const remove = rowId => {
		if (confirm('Do you really want to delete it?')) {
			content.remove(rowId);
		}
	};

	const br = value => {
		return value.replace(/\n/g, '<br />');
	};

	onMount(() => {
		jQuery('head').append('<style id="template-css"></style>');
		fetchCss('template-1.css');
	});
</script>

<style lang="scss">
	.frame {
		flex: 1;
		display: flex;
		width: 100%;
		align-items: center;
		justify-content: center;

		.frame-inner {
			border: 3px solid #bbb;
			border-top: 30px solid #bbb;
			width: 100%;
			max-width: 800px;
			height: calc(100vh - 100px);
			max-height: 700px;
			margin: 20px;
			border-radius: 5px;
			box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
			&.mobile {
				border: 10px solid #222;
				border-top: 40px solid #222;
				border-bottom: 40px solid #222;
				border-radius: 30px;
				width: 340px;
			}

			.content {
				width: 100%;
				height: 100%;
				overflow: auto;

				.manage {
					display: block;
				}

				table {
					position: relative;

					h2,
					.desc,
					a {
						&:empty {
							background: #f0f0f0;
							height: 30px;
						}
					}
				}

				.btn-remove {
					position: absolute;
					right: 10px;
					top: 10px;
				}

				.btn-create {
					margin: 40px auto;
					background: #1c7cff;
					border-radius: 100%;
					line-height: 1;
					display: block;
					width: 60px;
					height: 60px;
					box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
					> span {
						font-size: 4em;
						color: #fff;
						position: relative;
						top: -4px;
					}
				}
			}
		}
	}
</style>

<div class="frame">
	<div class="frame-inner {$mode}">
		<div id="body" class="content">
			<div class="m-wrapper">
				<div class="m-header">
					<div class="m-inner">
						<img
							src="{$content.intro_image}"
							on:click="{editor.open.bind(null, 'intro_image', '', $content.intro_image)}"
						/>
						<div
							class="lead"
							on:click="{editor.open.bind(null, 'intro', '', $content.intro)}"
						>
							{@html br($content.intro)}
						</div>
					</div>
				</div>
				<div class="m-body">
					<div class="m-inner">
						{#each $content.rows as row (row._id)}
						<table
							cellpadding="0"
							cellspacing="0"
							border="0"
							class="image-{row.image !== '' ? 'y' : 'n'}"
						>
							<tbody>
								<tr>
									<td class="l">
										<img
											src="{row.image}"
											on:click="{editor.open.bind(null, 'image', row._id, row.image)}"
										/>
									</td>
									<td class="r">
										<button
											class="btn btn-xs manage btn-remove"
											on:click="{remove.bind(null, row._id)}"
										>
											X
										</button>
										<h2
											on:click="{editor.open.bind(null, 'title', row._id, row.title)}"
										>
											{@html br(row.title)}
										</h2>
										<div
											class="desc"
											on:click="{editor.open.bind(null, 'desc', row._id, row.desc)}"
										>
											{@html br(row.desc)}
										</div>
										<div class="cta">
											{#if row.button !== ''}
											<a
												href="{row.button.split('|')[1]}"
												target="_blank"
												on:click|preventDefault="{editor.open.bind(null, 'button', row._id, row.button)}"
												>{row.button.split('|')[0]}</a
											>
											{:else}
											<a
												class="manage"
												on:click|preventDefault="{editor.open.bind(null, 'button', row._id, row.button)}"
											></a>
											{/if}
										</div>
									</td>
								</tr>
							</tbody>
						</table>
						{/each}

						<button
							class="btn-create manage"
							on:click="{content.createNew}"
						>
							<span>+</span>
						</button>
					</div>
				</div>
				<div class="m-footer">
					<div class="m-inner">
						<div
							class="lead"
							on:click="{editor.open.bind(null, 'outro', '', $content.outro)}"
						>
							{@html br($content.outro)}
						</div>
						<hr size="1" noshade />
						<div
							class="m-bottom"
							on:click="{editor.open.bind(null, 'bottom', '', $content.bottom)}"
						>
							{@html br($content.bottom)}
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
