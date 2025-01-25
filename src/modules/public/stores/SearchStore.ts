import { makeAutoObservable } from 'mobx';

export interface SearchItem {
	Title: string;
	SearchTitle: string;
	URLRedirect: string;
	URLString: string;
	Description: string;
}

interface ItemProps {
	news: SearchItem[];
	pages: SearchItem[];
	locations: SearchItem[];
}

class SearchStore {
	items: ItemProps = {
		news: [],
		pages: [],
		locations: [],
	};

	loading: boolean = false;

	constructor() {
		makeAutoObservable(this);
	}

	setItems(payload: ItemProps) {
		this.items = payload;
	}

	setLoading(payload: boolean) {
		this.loading = payload;
	}
}

export default new SearchStore();
