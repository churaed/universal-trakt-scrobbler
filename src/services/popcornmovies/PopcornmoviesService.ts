import { Service } from '@models/Service';

export const PopcornmoviesService = new Service({
	id: 'popcornmovies',
	name: 'PopcornMovies',
	homePage: 'https://popcornmovies.st/',
	hostPatterns: ['*://*.popcornmovies.st/*'],
	hasScrobbler: true,
	hasSync: false,
	hasAutoSync: false,
	limitations: [
		'Playback requires a page-hosted or same-origin video player. External cross-origin players are not supported.',
	],
});
