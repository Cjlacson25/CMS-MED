interface DoctorScheduleModel {
	DoctorScheduleID: number;
	DoctorID: number;
	Day: string;
	StartDateTime: string;
	EndDateTime: string;
	isActive: boolean;
	isPublished: boolean;
	CreatedBy: string;
	CreatedDateTime: string;
	UpdatedBy: string;
	UpdatedDateTime: string;
}

export default DoctorScheduleModel;
