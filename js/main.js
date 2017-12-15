const main = {
	route: '/',
	selector: 'main-page',
	template: () => page('/pages/main.html')
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
		main,
		projects,
		contact,
		id,
		route
	]
}).run();