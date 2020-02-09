import jQuery from 'jquery';
import { writable, get } from 'svelte/store';

const isDevelopment = location.hostname === 'localhost';

window.isTouch = (function is_touch_device4() {
	var prefixes = ' -webkit- -moz- -o- -ms- '.split(' ');

	var mq = function(query) {
		return window.matchMedia(query).matches;
	};

	if (
		'ontouchstart' in window ||
		(window.DocumentTouch && document instanceof DocumentTouch)
	) {
		return true;
	}

	// include the 'heartz' as a way to have a non matching MQ to help terminate the join
	// https://git.io/vznFH
	var query = ['(', prefixes.join('touch-enabled),('), 'heartz', ')'].join(
		''
	);
	return mq(query);
})();
document
	.getElementsByTagName('html')[0]
	.classList.add(window.isTouch ? 'touch' : 'no-touch');

export const mode = (() => {
	const { subscribe, set } = writable('mobile');

	return {
		subscribe,
		set,
	};
})();

export const content = (() => {
	const initData = () => {
		return {
			_id: `s${Math.random()
				.toString()
				.replace('.', '')}`,
			image: 'https://picsum.photos/220/220/?random',
			title: 'Id est sint consequat esse pariatur',
			desc:
				'Minim commodo et nostrud dolor deserunt duis enim. Voluptate deserunt laboris sint enim aliquip laboris proident duis Lorem.',
			button: 'Label|https://google.com',
		};
	};

	const { subscribe, set, update } = writable({
		intro_image: 'https://picsum.photos/640/300/?random',
		intro:
			'Pariatur Lorem ad aliquip duis voluptate est labore cillum. Aliquip pariatur cupidatat culpa incididunt dolor culpa irure officia.',
		rows: [initData()],
		outro:
			'Ad ut ut sint ut duis commodo sint ex fugiat culpa voluptate cillum fugiat.',
		bottom:
			'메일 수신을 원치 않으시면 [##BLOCK_RECEIVER_LINK##]를 클릭하세요.\nIf you do not want to receive it, please click a [##EN_BLOCK_RECEIVER_LINK##]',
	});

	const createNew = () =>
		update(_ => {
			_.rows.push(initData());

			updateToHash(_);

			return _;
		});

	const setIn = (key, rowId, value) => {
		const _ = get(content);
		if (key.indexOf('image') > -1) {
			value = extractOnlyUrl(value);
		} else if (key.indexOf('button') > -1) {
			value = value.replace(/<\/?p>/g, '');
		}
		if (rowId !== '') {
			const index = _.rows.findIndex(r => r._id === rowId);
			_.rows[index][key] = value;
		} else {
			_[key] = value;
		}
		set(_);
		updateToHash(_);
	};

	const remove = rowId =>
		update(_ => {
			const index = _.rows.findIndex(r => r._id === rowId);
			if (index > -1) {
				_.rows.splice(index, 1);
			}

			updateToHash(_);

			return _;
		});

	return {
		subscribe,
		createNew,
		remove,
		set,
		setIn,
	};
})();

let preventHashChange = false;
export const updateToHash = data => {
	if (data === undefined) {
		data = get(content);
	}
	preventHashChange = true;
	location.hash = btoa(unescape(encodeURIComponent(JSON.stringify(data))));
	setTimeout(() => {
		preventHashChange = false;
	}, 10);
};

export const restoreFromHash = () => {
	const restoredContent = JSON.parse(
		decodeURIComponent(escape(atob(location.hash.replace('#', ''))))
	);
	content.set(restoredContent);
};

window.onhashchange = () => {
	if (preventHashChange) {
		return false;
	}
	restoreFromHash();
};

export const generate = async () => {
	let response = await fetch(`/reset.css`);
	const reset = await response.text();

	response = await fetch(`/template-1.css`);
	const css = await response.text();

	const body = jQuery('#body').html();

	const result = `<!DOCTYPE html>
<html lang="ko" style="padding: 0;margin: 0;">
<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1">

	<title>Email</title>
	<style type="text/css">
		${reset}
		${css}
	</style>
</head>
<body style="padding: 0;margin: 0;">
	${body}
</body>
</html>`;

	editor.open('', '', result);
};

export const editor = (() => {
	let callbackKey = '';
	let callbackRowId = '';

	const { subscribe, set, update } = writable({
		enabled: false,
		readonly: false,
	});

	const open = (key, rowId, content) => {
		console.log('key', key);
		const _ = get(editor);

		callbackKey = key;
		callbackRowId = rowId;
		_.enabled = true;
		_.readonly = key === '';
		set(_);

		window.editor.setHtml(content);

		setTimeout(() => {
			window.editor.customFocus();
		}, 100);
	};

	const confirm = () => {
		content.setIn(callbackKey, callbackRowId, window.editor.getHtml());
		editor.close();
	};

	const close = () =>
		update(_ => {
			_.enabled = false;
			return _;
		});

	return {
		subscribe,
		open,
		close,
		confirm,
		set,
	};
})();

const extractOnlyUrl = str => {
	const matches = str.match(/https?:\/\/[a-z0-9\.\-_\/]+/gi);
	if (matches !== null && matches.length > 0) {
		return matches[0];
	}
	return str;
};
