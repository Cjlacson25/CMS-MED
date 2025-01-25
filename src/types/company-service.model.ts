import CompanyServiceLineModel from './company-service-line.model';
import CompanyModel from './company.model';

interface CompanyServiceModel {
	CompanyServiceID: number;
	CompanyID: number;
	ServiceTypeID: number;
	Title: string;
	Slug: string;
	ImagePath: string;
	ServiceContent: string;
	isActive: boolean;
	isPublished: boolean;
	CreatedBy: string;
	CreatedDateTime: string;
	UpdatedBy: string;
	UpdatedDateTime: string;
	companyServiceLines: CompanyServiceLineModel[];
	serviceLines: CompanyServiceLineModel[];
	companies: CompanyModel[];
}

export default CompanyServiceModel;
