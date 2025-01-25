interface CareerModel {
	CareerID: number;
	CompanyID: number;
	Title: string;
	Content: string;
	ImagePath: string;
	CareerAvailableImagePath: string;
	CareerAvailableContent: string;
	isActive: boolean;
	isPublished: boolean;
	CreatedBy: string;
	CreatedDateTime: string;
	UpdatedBy: string;
	UpdatedDateTime: string;
}

export default CareerModel;
