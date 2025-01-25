interface PhysicianProviderModel {
	PhysicianProviderID: number;
	CompanyID: number;
	Content: string;
	ImagePath: string;
	isActive: boolean;
	isPublished: boolean;
	CreatedBy: string;
	CreatedDateTime: string;
	UpdatedBy: string;
	UpdatedDateTime: string;
}

export default PhysicianProviderModel;
