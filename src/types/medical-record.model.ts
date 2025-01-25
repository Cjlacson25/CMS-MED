interface MedicalRecordModel {
	MedicalRecordID: number;
	CompanyID: number;
	ImagePath: string;
	Content: string;
	isActive: boolean;
	isPublished: boolean;
	CreatedBy: string;
	CreatedDateTime: Date;
	UpdatedBy: string;
	UpdatedDateTime: Date;
}

export default MedicalRecordModel;
