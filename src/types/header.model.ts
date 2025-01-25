interface HeaderModel {
	HeaderID: number;
	CompanyID: number;
	TagLine1: string;
	TagLine2: string;
	ImagePath: string;
	isActive: boolean;
	isPublished: boolean;
	CreatedBy: string;
	CreatedDateTime: string;
	UpdatedBy: string;
	UpdatedDateTime: string;
}

export default HeaderModel;
