interface PartnerModel {
	PartnerID: number;
	CompanyID: number;
	ImagePath: string;
	Content: string;
	isActive: boolean;
	isPublished: boolean;
	CreatedBy: string;
	CreatedDateTime: string;
	UpdatedBy: string;
	UpdatedDateTime: string;
}

export default PartnerModel;
