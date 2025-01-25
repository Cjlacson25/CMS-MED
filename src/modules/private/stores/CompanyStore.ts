import { makeAutoObservable } from 'mobx';
export interface Company {
	AboutUsImagePath: string;
	Address: string;
	CompanyContactNo: string;
	CompanyCoreValueUpdatedBy: string;
	CompanyID: number;
	CompanyStoryContent: string;
	CompanyCoreCreatedBy: string;
	CompanyStoryCreatedDateTime: string;
	CompanyStoryImagePath: string;
	CompanyStoryUpdatedBy: string;
	CompanyStoryUpdatedDateTime: string;
	CompleteAddress: string;
	ContactNo: string;
	ContactUsContent: string;
	ContactUsCreatedBy: string;
	ContactUsCreatedDateTime: string;
	ContactUsSubContent: string;
	ContactUsTitle: string;
	ContactUsUpdatedBy: string;
	ContactUsUpdatedDateTime: string;
	CoreValueContent: string;
	CoreValueCreatedDateTime: string;
	CoreValueICreatedBy: string;
	CoreValueImagePath: string;
	CoreValueUpdatedDateTime: string;
	CreatedBy: string;
	CreatedDateTime: string;
	Description: string;
	EmailAddress: string;
	FindUsContent: string;
	FindUsCreatedBy: string;
	FindUsCreatedDateTime: string;
	FindUsImagePath: string;
	FindUsUpdatedBy: string;
	FindUsUpdatedDateTime: string;
	ImagePath: string;
	MissionContent: string;
	MissionCreatedBy: string;
	MissionCreatedDateTime: string;
	MissionImagePath: string;
	MissionUpdatedBy: string;
	MissionUpdatedDateTime: string;
	ProductLogoPath: string;
	Province: string;
	Region: string;
	SDAImagePath: string;
	TownCity: string;
	UpdatedBy: string;
	UpdatedDateTime: string;
	VisionContent: string;
	VisionCreatedBy: string;
	VisionCreatedDateTime: string;
	VisionImagePath: string;
	VisionUpdatedBy: string;
	VisionUpdatedDateTime: string;
	hasOnlineService: string;
	isActive: boolean;
	isPublished: boolean;
	ViewType: string;
}

class CompanyStore {
	company: Company = {} as Company;
	constructor() {
		makeAutoObservable(this);
	}
	setCompany(payload: Company) {
		this.company = payload;
	}
	setViewType(payload: string) {
		this.company.ViewType = payload;
	}
}

export default new CompanyStore();
