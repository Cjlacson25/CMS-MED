interface CompanySubContentModel {
	CompanySubContentID: number;
	CompanyID: number;
	Title: string;
	Content: string;
	ImagePath: string;
	isActive: boolean;
	isPublished: boolean;
	CreatedBy: string;
	CreatedDateTime: string;
	UpdatedBy: string;
	UpdatedDateTime: string;
}

export default CompanySubContentModel;
