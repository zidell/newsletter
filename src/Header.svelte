<script>
	import { mode, generate } from './store.js';
</script>

<style lang="scss">
	.header {
		width: 100%;
		height: 55px;
		background: #222;
		display: flex;
		align-items: center;
		padding-left: 15px;
		padding-right: 15px;
		justify-content: space-between;
		a {
			color: #fff;
			margin: 0;
			font-size: 1.6rem;
			text-decoration: none;
		}
	}
</style>

<div class="header">
	<a href="https://github.com/zidell/newsletter" target="_blank">Newsletter</a>
	<div>
		<button class="btn btn-outline" on:click={mode.set.bind(null, 'mobile')}>Mobile</button>
		<button class="btn btn-outline" on:click={mode.set.bind(null, 'desktop')}>Desktop</button>
	</div>
	<div>
		<button class="btn btn-outline" on:click={generate}>HTML</button>
	</div>
</div>
