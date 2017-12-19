const player = {
	selector: 'player',
	template: () => page('/pages/player/player.html')
};

const playerPage = {
	route: '/player',
	selector: 'player-page',
	template: () => page('/pages/player/player-page.html')
};

const home = {
	route: '/',
	selector: 'home-page',
	template: () => page('/pages/home.html')
};

const projects = {
	route: '/projects',
	selector: 'projects-page',
	template: () => page('/pages/projects/projects.html'),
	components: [
		{
			selector: 'projects-cards',
			template: () => page('/pages/projects/cards.html'),
		}
	]
};

const contact = {
	route: '/contact',
	selector: 'contact-page',
	template: () => page('/pages/contact.html')
};

const id = {
	route: '/id/:id',
	selector: 'id-page',
	template: () => page('/pages/id.html')
};

const route = {
	route: '/route',
	selector: 'route-page',
	template: () => page('/pages/route.html')
};

new Yavir({
	el: 'app',
	mode: 'history',
	components: [
		home,
		projects,
		contact,
		playerPage,
		player
	]
}).run();