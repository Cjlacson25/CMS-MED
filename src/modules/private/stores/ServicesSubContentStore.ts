import { makeAutoObservable } from 'mobx';
export interface ServicesSubContent {
	CompanyID: number;
	CreatedBy: string;
	CreatedDateTime: string;
	Content: string;
	ImagePath: string;
	ServiceSubContentID: number;
	Title: string;
	UpdatedBy: string;
	UpdatedDateTime: string;
	isActive: boolean;
	isPublished: boolean;
	ViewType: string;
}

class ServicesSubContentStore {
	servicesSubContent: ServicesSubContent = {} as ServicesSubContent;
	constructor() {
		makeAutoObservable(this);
	}
	setServicesSubContent(payload: ServicesSubContent) {
		this.servicesSubContent = payload;
	}
	setViewType(payload: string) {
		this.servicesSubContent.ViewType = payload;
	}
}

export default new ServicesSubContentStore();
