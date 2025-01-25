interface FooterModel {
	FooterID: number;
	CompanyID: number;
	Abbreviation: string;
	Name: string;
	URL: string;
	ImagePath: string;
	isActive: boolean;
	isPublished: boolean;
	CreatedBy: string;
	CreatedDateTime: string;
	UpdatedBy: string;
	UpdatedDateTime: string;
}

export default FooterModel;
