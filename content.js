console.log('loaded!');

const config = {
	token: 'a22cfm6i9p5ycaufwy99c6wtn1jq4a',
	user: 'ukekrc5ihqbpdta4xgdxct63cwbq17',
	channel: 'D06U94UJB7E'
};

async function notify(message, priority = '2') {
	const url = new URL('https://api.pushover.net/1/messages.json');

	url.searchParams.set('token', config.token);
	url.searchParams.set('user', config.user);
	url.searchParams.set('message', message);
	url.searchParams.set('priority', priority);

	if (priority === '2') {
		url.searchParams.set('retry', '30');
		url.searchParams.set('expire', '600');
	}


	const res = await fetch(url, { method: 'POST' });

	console.log('Got response:', await res.text());
}

function onMutate(mutations) {
	for (const mutation of mutations) {
		if (!mutation || !mutation.target.className) continue;

		if (mutation.target.parentElement.getAttribute('data-item-key') === config.channel && mutation.target.className.includes('channel_sidebar__channel--unread') && !mutation.target.className.includes('typing')) {
			const hasBadge = mutation.target.querySelector('[class*="channel_sidebar__channel_suffix"] > .p-channel_sidebar__badge');
			if (!hasBadge) continue;

			console.log('Got notification.');
			notify(`${hasBadge.innerText} new notification(s) from boss.`);

			break;
		}
	}
}

const observer = new MutationObserver(onMutate);
observer.observe(document.body, { subtree: true, attributes: true, childList: true });