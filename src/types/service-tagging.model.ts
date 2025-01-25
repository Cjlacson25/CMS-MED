import CompanyServiceModel from './company-service.model';
import CompanyModel from './company.model';

interface ServiceTaggingModel {
	ServiceTaggingID: number;
	CompanyID: number;
	CompanyServiceID: number;
	Slug: string;
	isActive: boolean;
	isPublished: boolean;
	CreatedBy: string;
	CreatedDateTime: string;
	UpdatedBy: string;
	UpdatedDateTime: string;
	company: CompanyModel;
	companyService: CompanyServiceModel;
}

export default ServiceTaggingModel;
