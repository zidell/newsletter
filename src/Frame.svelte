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
			<div
				class="m-wrapper"
				style="font-size: 15px;line-height: 1.6em;padding: 0;width: 100%;height: 100%;background: #eeeff3;overflow-x: hidden;font-family: sans-serif;"
			>
				<div class="m-header" style="background: #fff">
					<div
						class="m-inner"
						style="width: 100%;max-width: 650px;margin: 0 auto;padding: 0 3%;"
					>
						<img
							src="{$content.intro_image}"
							on:click="{editor.open.bind(null, 'intro_image', '', $content.intro_image)}"
							style="padding-top: 3%;width: 100%;display: block;"
						/>
						<div
							class="lead"
							style="font-size: 1.1em;padding-top: 70px;padding-bottom: 70px;line-height: 1.7em;"
							on:click="{editor.open.bind(null, 'intro', '', $content.intro)}"
						>
							{@html br($content.intro)}
						</div>
					</div>
				</div>
				<div
					class="m-body"
					style="padding: 20px 0;background: #eeeff3;"
				>
					<div
						class="m-inner"
						style="width: 100%;max-width: 650px;margin: 0 auto;padding: 0 3%;"
					>
						{#each $content.rows as row (row._id)}
						<table
							cellpadding="0"
							cellspacing="0"
							border="0"
							class="image-{row.image !== '' ? 'y' : 'n'}"
							style="border: 0;background: #fff;margin: 30px 0;box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);width: 100%;"
						>
							<tbody>
								<tr style="display: block;">
									{#if row.image !== ''}
									<td
										class="l"
										style="vertical-align: top;padding: 30px;width: 38%;padding-right: 10px;"
									>
										<img
											src="{row.image}"
											on:click="{editor.open.bind(null, 'image', row._id, row.image)}"
											style="width: 100%;background: #fff;padding: 0;"
										/>
									</td>
									{/if}
									<td
										class="r"
										style="vertical-align: top;padding: 30px;width: 62%;padding-left: 20px;vertical-align: middle;"
									>
										<button
											class="btn btn-xs manage btn-remove"
											on:click="{remove.bind(null, row._id)}"
										>
											X
										</button>
										<h2
											on:click="{editor.open.bind(null, 'title', row._id, row.title)}"
											style="font-size: 1.3em;margin-bottom: 0.7em;font-weight: bold;margin-top:0;"
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
												style="display: inline-block;background: #1c7cff;color: #fff;text-decoration: none !important;padding: 8px 20px;border-radius: 7px;margin-top: 20px;"
												>{row.button.split('|')[0]}</a
											>
											{:else}
											<a
												class="manage"
												on:click|preventDefault="{editor.open.bind(null, 'button', row._id, row.button)}"
												style="display: inline-block;background: #1c7cff;color: #fff;text-decoration: none !important;padding: 8px 20px;border-radius: 7px;margin-top: 20px;"
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
				<div
					class="m-footer"
					style="padding: 0 20px 30px 20px;background: #fff;"
				>
					<div
						class="m-inner"
						style="width: 100%;max-width: 650px;margin: 0 auto;padding: 0 3%;"
					>
						<div
							class="lead"
							style="font-size: 1.1em;padding-top: 70px;padding-bottom: 70px;line-height: 1.7em;"
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
							style="text-align: center;font-size: 0.9em;line-height: 1.4;color: #aaa;margin-top: 40px;padding-bottom: 40px;"
						>
							{@html br($content.bottom)}
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
