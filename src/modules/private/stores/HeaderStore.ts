import { makeAutoObservable } from 'mobx';
export interface Header {
	CompanyID: number;
	CreatedBy: string;
	CreatedDateTime: string;
	HeaderID: number;
	ImagePath: string;
	Tagline1: string;
	Tagline2: string;
	UpdatedBy: string;
	UpdatedDateTime: string;
	isActive: boolean;
	isPublished: boolean;
	ViewType: string;
}

class HeaderStore {
	header: Header = {} as Header;
	constructor() {
		makeAutoObservable(this);
	}
	setHeader(payload: Header) {
		this.header = payload;
	}
	setViewType(payload: string) {
		this.header.ViewType = payload;
	}
}

export default new HeaderStore();
