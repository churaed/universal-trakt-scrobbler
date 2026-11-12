import { ServiceApi } from '@apis/ServiceApi';
import { PopcornmoviesService } from '@/popcornmovies/PopcornmoviesService';

class _PopcornmoviesApi extends ServiceApi {
	constructor() {
		super(PopcornmoviesService.id);
	}
}

export const PopcornmoviesApi = new _PopcornmoviesApi();
