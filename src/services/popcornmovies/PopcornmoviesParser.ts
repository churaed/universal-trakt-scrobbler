import { ScrobbleParser, ScrobblePlayback } from '@common/ScrobbleParser';
import { EpisodeItem, MovieItem, ScrobbleItem } from '@models/Item';
import { PopcornmoviesApi } from '@/popcornmovies/PopcornmoviesApi';

class _PopcornmoviesParser extends ScrobbleParser {
	private location = '';
	private changed = false;

	constructor() {
		super(PopcornmoviesApi);
	}

	override async parsePlayback(): Promise<ScrobblePlayback | null> {
		if (this.changed) {
			this.clearItem();
			this.changed = false;
		}
		if (this.location !== window.location.href) {
			this.location = window.location.href;
			this.changed = true;
			return null;
		}
		return super.parsePlayback();
	}

	protected override parsePlaybackFromVideoPlayer(): Partial<ScrobblePlayback> | null {
		const documents = [document];
		for (const frame of document.querySelectorAll('iframe')) {
			try {
				if (frame.contentDocument) documents.push(frame.contentDocument);
			} catch {
				// Cross-origin players need a provider-specific integration.
			}
		}
		for (const doc of documents) {
			for (const video of doc.querySelectorAll('video')) {
				if (Number.isFinite(video.duration) && video.duration > 0) {
					return {
						isPaused: video.paused,
						currentTime: video.currentTime,
						duration: video.duration,
					};
				}
			}
		}
		return null;
	}

	protected override parseItemFromDom(): ScrobbleItem | null {
		const path = window.location.pathname;
		const movie = /\/(?:watch\/)?movie\/\d+/.test(path);
		const series = /\/(?:watch\/)?tv\/\d+/.test(path);
		if (!movie && !series) return null;
		const title = document.querySelector('h1')?.textContent?.trim();
		if (!title) return null;
		const serviceId = this.api.id;
		if (movie) return new MovieItem({ serviceId, title });
		const params = new URLSearchParams(window.location.search);
		const route = /\/tv\/\d+\/(\d+)\/(\d+)/.exec(path);
		const season = Number(params.get('season') ?? params.get('s') ?? route?.[1]);
		const number = Number(params.get('episode') ?? params.get('e') ?? route?.[2]);
		if (!Number.isInteger(season) || season < 0 || !Number.isInteger(number) || number < 1)
			return null;
		return new EpisodeItem({ serviceId, title: '', season, number, show: { serviceId, title } });
	}
}

export const PopcornmoviesParser = new _PopcornmoviesParser();
