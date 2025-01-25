interface TeleMedicineLineModel {
	TeleMedicineLineID: number;
	TeleMedicineID: number;
	ImagePath: string;
	Content: string;
	isActive: boolean;
	isPublished: boolean;
	CreatedBy: string;
	CreatedDatetime: string;
	UpdatedBy: string;
	UpdatedDatetime: string;
}

export default TeleMedicineLineModel;
