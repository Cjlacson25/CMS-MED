import CompanyLeaderModel from './company-leader.model';
import CompanyNewsUpdateModel from './company-news-update.model';
import CompanySubContentModel from './company-sub-content.model';
import HeaderModel from './header.model';
import PartnerModel from './partner.model';
import ServiceSubContentModel from './service-sub-contents.model';

interface CompanyModel {
	AboutUsImagePath: string;
	Address: string;
	Barangay: string;
	CompanyContactNo: string;
	CompanyCoreValueUpdatedBy: string;
	CompanyID: number;
	CompanyStoryContent: string;
	CompanyStoryCreatedBy: string;
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
	DoctorFindUsImagePath: string;
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
	URLString: string;
	VisionContent: string;
	VisionCreatedBy: string;
	VisionCreatedDateTime: string;
	VisionImagePath: string;
	VisionUpdatedBy: string;
	VisionUpdatedDateTime: string;
	hasOnlineService: boolean;
	isActive: boolean;
	isPublished: boolean;
	Latitude: number;
	Longitude: number;
	headers: HeaderModel[];
	companySubContents: CompanySubContentModel[];
	companyNewsUpdates: CompanyNewsUpdateModel[];
	serviceSubContents: ServiceSubContentModel[];
	partners: PartnerModel[];
	companyLeaders: CompanyLeaderModel[];
}

export default CompanyModel;
