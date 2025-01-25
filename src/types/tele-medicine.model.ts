import TeleMedicineLineModel from './tele-medicine-line.model';

interface TeleMedicineModel {
	TeleMedicineID: number;
	CompanyID: number;
	ImagePath: string;
	isActive: boolean;
	isPublished: boolean;
	CreatedBy: string;
	CreatedDatetime: string;
	UpdatedBy: string;
	UpdatedDatetime: string;
	teleMedicineLines: TeleMedicineLineModel[];
}

export default TeleMedicineModel;
