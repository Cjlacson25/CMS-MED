interface CareerOfferModel {
	CareerOfferID: number;
	CompanyID: number;
	Title: string;
	SubContent: string;
	ImagePath: string;
	isActive: boolean;
	isPublished: boolean;
	CreatedBy: string;
	CreatedDateTime: string;
	UpdatedBy: string;
	UpdatedDateTime: string;
}

export default CareerOfferModel;
