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

					>span {
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
			<div class="m-wrapper {$mode}"
				style="font-size: 14px; line-height: 1.6em; padding: 0; width: 100%; height: 100%; background: #eeeff3; overflow-x: hidden; font-family: sans-serif;">
				<div class="m-header" style="background: #fff">
					<div class="m-inner" style="width: 100%;max-width: 650px;margin: 0 auto;padding: 0 3%;">
						<img src="{$content.intro_image}"
							on:click="{editor.open.bind(null, 'intro_image', '', $content.intro_image)}"
							style="display: block; width: 106%; padding-top: 0; margin-left: -3%; margin-right: -3%;" />
						<div class="lead"
							style="font-size: 1.1em; padding-top: 50px; padding-bottom: 50px; line-height: 1.7em;"
							on:click="{editor.open.bind(null, 'intro', '', $content.intro)}">
							{@html br($content.intro)}
						</div>
					</div>
				</div>
				<div class="m-body" style="padding: 10px 0; background: #eeeff3;">
					<div class="m-inner" style="width: 100%; max-width: 650px; margin: 0 auto; padding: 0 3%;">
						{#each $content.rows as row (row._id)}
						<table
							cellpadding="0"
							cellspacing="0"
							border="0"
							class="image-{row.image !== '' ? 'y' : 'n'}"
							style="border: 0; background: #fff; margin: 15px 0; box-shadow: 0 0 5px rgba(0, 0, 0, 0.2); width: 100%;"
						>
							<tbody>
								<tr style="display: block;">
									{#if row.image !== ''}
									<td
										class="l"
										style="vertical-align: top; display: block; width: 100%; text-align: center; padding: 30px 0 0 0;"
									>
										<img
											src="{row.image}"
											on:click="{editor.open.bind(null, 'image', row._id, row.image)}"
											style="background: #fff; padding: 0; width: 130px; height: 130px; border-radius: 100%; border: 1px solid rgba(0, 0, 0, 0.1);object-fit:cover;"
										/>
									</td>
									{/if}
									<td
										class="r"
										style="vertical-align: top; vertical-align: middle; display: block; width: 100%; padding: 25px 20px 30px 15px;"
									>
										<button
											class="btn btn-xs manage btn-remove"
											on:click="{remove.bind(null, row._id)}"
										>
											X
										</button>
										<h2
											on:click="{editor.open.bind(null, 'title', row._id, row.title)}"
											style="font-size: 1.3em; margin-bottom: 0.7em; font-weight: bold; margin-top: 0; text-align: center;"
										>
											{@html br(row.title)}
										</h2>
										<div
											class="desc"
											on:click="{editor.open.bind(null, 'desc', row._id, row.desc)}"
										>
											{@html br(row.desc)}
										</div>
										<div
											class="cta"
											style="text-align:center;"
										>
											{#if row.button !== ''}
											<a
												href="{row.button.split('|')[1].trim()}"
												target="_blank"
												on:click|preventDefault="{editor.open.bind(null, 'button', row._id, row.button)}"
												style="display: inline-block; background: #1c7cff; color: #fff; text-decoration: none; padding: 8px 20px; border-radius: 7px; margin-top: 20px;"
												>{row.button.split('|')[0].trim()}</a
											>
											{:else}
											<a
												class="manage"
												on:click|preventDefault="{editor.open.bind(null, 'button', row._id, row.button)}"
												style="display: inline-block; background: #ddd; color: #fff; text-decoration: none; padding: 8px 20px; border-radius: 7px; margin-top: 20px;"
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
				<div class="m-footer" style="padding: 10px 0;background: #fff;">
					<div
						class="m-inner"
						style="width: 100%; max-width: 650px; margin: 0 auto; padding: 0 3%;"
					>
						<div
							class="lead"
							style="font-size: 1.1em; padding-top: 50px; padding-bottom: 50px; line-height: 1.7em;"
							on:click="{editor.open.bind(null, 'outro', '', $content.outro)}"
						>
							{@html br($content.outro)}
						</div>
						<hr
							size="1"
							noshade
							style="height: 1px;border: 0;background: #ddd;"
						/>
						<div
							class="m-bottom"
							on:click="{editor.open.bind(null, 'bottom', '', $content.bottom)}"
							style="text-align: center; font-size: 0.9em; line-height: 1.4; color: #aaa; margin-top: 40px; padding-bottom: 40px;"
						>
							{@html br($content.bottom)}
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>