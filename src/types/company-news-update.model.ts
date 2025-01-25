interface CompanyNewsUpdateModel {
	CompanySubContentID: number;
	CompanyID: number;
	Title: string;
	Slug: string;
	PreContent: string;
	Content: string;
	ImagePath: string;
	isActive: boolean;
	isPublished: boolean;
	PublicationDate: string;
	CreatedBy: string;
	CreatedDateTime: string;
	UpdatedBy: string;
	UpdatedDateTime: string;
}

export default CompanyNewsUpdateModel;
