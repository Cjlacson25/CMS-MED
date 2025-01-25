import { makeAutoObservable } from 'mobx';
export interface NewsUpdates {
	CompanyID: number;
	CreatedBy: string;
	CreatedDateTime: string;
	CompanyNewsUpdateID: number;
	Content: string;
	ImagePath: string;
	Title: string;
	UpdatedBy: string;
	UpdatedDateTime: string;
	isActive: boolean;
	isPublished: boolean;
	ViewType: string;
}

class NewsUpdatesStore {
	newsUpdates: NewsUpdates = {} as NewsUpdates;
	constructor() {
		makeAutoObservable(this);
	}
	setNewsUpdates(payload: NewsUpdates) {
		this.newsUpdates = payload;
	}
	setViewType(payload: string) {
		this.newsUpdates.ViewType = payload;
	}
}

export default new NewsUpdatesStore();
