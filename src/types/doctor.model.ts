import CompanyModel from './company.model';
import DoctorScheduleModel from './doctor-schedule.model';

interface DoctorModel {
	DoctorID: number;
	CompanyID: number;
	FirstName: string;
	MiddleName: string;
	LastName: string;
	Suffix: string;
	Specialization: string;
	SubSpecialization: string;
	HMOAccreditation: string;
	Description: string;
	PCRLicenseNo: string;
	Availability: string;
	ImagePath: string;
	OfficeNumber: string;
	OfficeLocation: string;
	SecretaryContactNo: string;
	isActive: boolean;
	isPublished: boolean;
	CreatedBy: string;
	CreatedDateTime: string;
	UpdatedBy: string;
	UpdatedDateTime: string;
	doctorSchedules: DoctorScheduleModel[];
	company: CompanyModel;
}

export default DoctorModel;
