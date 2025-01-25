import { makeAutoObservable } from 'mobx';
export interface Services {
	CompanyID: number;
	CompanyServiceID: number;
	CreatedBy: string;
	CreatedDateTime: string;
	ServiceContent: string;
	ServiceTypeID: number;
	ImagePath: string;
	UpdatedBy: string;
	UpdatedDateTime: string;
	isActive: boolean;
	isPublished: boolean;
	ViewType: string;
}

class ServicesStore {
	services: Services = {} as Services;
	constructor() {
		makeAutoObservable(this);
	}
	setServices(payload: Services) {
		this.services = payload;
	}
	setViewType(payload: string) {
		this.services.ViewType = payload;
	}
}

export default new ServicesStore();
