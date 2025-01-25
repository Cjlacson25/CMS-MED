import { makeAutoObservable } from 'mobx';
export interface Partner {
	CompanyID: number;
	CreatedBy: string;
	CreatedDateTime: string;
	Content: string;
	ImagePath: string;
	PartnerID: number;
	UpdatedBy: string;
	UpdatedDateTime: string;
	isActive: boolean;
	isPublished: boolean;
	ViewType: string;
}

class PartnerStore {
	partner: Partner = {} as Partner;
	constructor() {
		makeAutoObservable(this);
	}
	setPartner(payload: Partner) {
		this.partner = payload;
	}
	setViewType(payload: string) {
		this.partner.ViewType = payload;
	}
}

export default new PartnerStore();
