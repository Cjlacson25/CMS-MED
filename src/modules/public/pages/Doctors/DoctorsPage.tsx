import React from 'react';
import { observer } from 'mobx-react-lite';

import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { HGridFormTextField } from '@hybrain/mui.ui.formik.grid.h-grid-form-text-field';
import { HGridFormSelect } from '@hybrain/mui.ui.formik.grid.h-grid-form-select';

import useApi from 'hooks/useApi';
import BaseForm from 'components/form/BaseForm';
import BaseButton from 'components/inputs/BaseButton';
import BasePagination from 'components/navigation/BasePagination';
import CompanyStore from 'modules/public/stores/CompanyStore';
import { getDoctorSchedule, joinStrings } from 'helpers/utils/string';
import DoctorModel from 'types/doctor.model';
import PageContainer from 'modules/public/components/PageContainer';
import Company from 'modules/private/interfaces/company.model';
import { timeFormat } from 'helpers/utils/date';

interface DoctorsPageProps {}

const Banner = styled('div', { shouldForwardProp: (prop) => prop !== 'backgroundImage' })<{ backgroundImage: string }>(
	(props) => ({
		position: 'relative',
		width: '100%',
		height: '35vh',
		backgroundSize: 'cover',
		backgroundPosition: 'center',
		backgroundImage: `url(${props.backgroundImage})`,
	})
);

const BannerTitle = styled('div')(({ theme }) => ({
	position: 'absolute',
	left: '10%',
	bottom: '32%',
	color: theme.palette.primary.main,
	fontSize: 42,
	fontWeight: 'bold',
}));

const Divider = styled('div')({
	width: '100%',
	height: '22px',
	backgroundColor: 'white',
	border: '10px solid #9B9B9B',
});

const DoctorsPage: React.FC<DoctorsPageProps> = () => {
	const { data: locations } = useApi<Company[]>({
		url: 'company/dropdown',
	});

	const {
		data: doctors,
		callApi,
		loading,
	} = useApi<DoctorModel[]>({
		url: 'doctors/find-doctor',
		immediate: false,
	});

	const handleSearch = (values: any) => {
		callApi({ params: values });
	};

	const clearSearch = (resetForm: () => void) => {
		resetForm();
		callApi();
	};

	return (
		<div>
			<Banner backgroundImage={CompanyStore.company.DoctorFindUsImagePath}>
				<BannerTitle></BannerTitle>
			</Banner>

			<PageContainer className="py-14">
				<Grid container spacing={8}>
					<Grid item xs={12} lg={5}>
						<BaseForm
							initialValues={{
								LastName: '',
								FirstName: '',
								Specialization: '',
								SubSpecialization: '',
								HMOAccreditation: '',
								Location: '',
								Availability: '',
							}}
							onSubmit={handleSearch}
							noSubmitButton
						>
							{({ resetForm }) => (
								<Grid container spacing={3}>
									<HGridFormTextField name="LastName" label="Enter Doctor's Surname or Doctor's Code" />
									<HGridFormTextField name="FirstName" label="Enter Doctor's First Name" />
									<HGridFormTextField name="Specialization" label="Specialization" />
									<HGridFormTextField name="SubSpecialization" label="Sub-Specialization" />
									<HGridFormTextField name="HMOAccreditation" label="HMO Accreditation" />
									<HGridFormSelect
										name="Location"
										label="Hospital Location"
										options={locations}
										optionText="Description"
										optionValue="CompanyID"
									/>
									<HGridFormTextField name="Availability" label="Availability Status" />

									<Grid item xs={12}>
										<BaseButton type="submit" size="large" fullWidth loading={loading}>
											Search
										</BaseButton>
									</Grid>
									<Grid item xs={12}>
										<BaseButton size="large" fullWidth onClick={() => clearSearch(resetForm)} loading={loading}>
											Clear
										</BaseButton>
									</Grid>
								</Grid>
							)}
						</BaseForm>
					</Grid>

					<Grid item xs={12} lg={7}>
						{doctors.length > 0 && (
							<BasePagination
								position="right"
								items={doctors}
								render={(items) => (
									<div className="flex flex-col gap-y-2">
										{items.map((doctor, index) => (
											<Grid container spacing={3} key={index}>
												<Grid item xs={12} md={8}>
													<div className="text-lg font-bold uppercase text-neutral-500">
														{joinStrings([doctor.FirstName, doctor.MiddleName], ' ')}
													</div>

													<Typography color="#2166A7" className="mt-3 text-3xl font-bold uppercase">
														{doctor.LastName}
													</Typography>

													<div className="mt-1 font-bold uppercase text-neutral-500">
														{doctor.Specialization} ({doctor.SubSpecialization ?? 'none'})
													</div>

													<Typography color="#2166A7" className="mt-3 font-bold uppercase">
														Accredited HMO:
													</Typography>

													<div className="mt-1 font-bold uppercase text-neutral-500">{doctor.HMOAccreditation}</div>
												</Grid>

												<Grid item xs={12} md={4}>
													<Typography className="font-bold text-neutral-500" fontSize={17}>
														Clinic Schedule
													</Typography>

													<div className="mt-2">
														{doctor.doctorSchedules.map((schedule) => (
															<div>
																{schedule.Day}: {timeFormat(schedule.StartDateTime)} - {timeFormat(schedule.EndDateTime)}
															</div>
														))}
													</div>

													<div className="mt-4">
														<Typography color="#2166A7" className="font-bold">
															{doctor.company.TownCity}
														</Typography>

														<div className="text-neutral-500">
															{/* <div className="font-bold mt-2">Bldg/Room No.</div>
															<div>fdg123</div> */}
															{doctor.company.Address && (
																<>
																	<div className="font-bold mt-2">Bldg/Room No.</div>
																	<div>{doctor.company.Address}</div>
																</>
															)}

															{/* <div className="font-bold">Time Day</div>
															<div>Availability: {doctor.Availability}</div>
															<div>
																{getDoctorSchedule(doctor).map((schedule, index) => (
																	<div key={index}>{schedule}</div>
																))}
															</div> */}
															<div className="font-bold">Office Number/Location</div>
															<div>{joinStrings([doctor.OfficeNumber, doctor.OfficeLocation], ' / ')}</div>
															<div className="font-bold">Secretary's Contact Number</div>
															<div>{doctor.SecretaryContactNo}</div>
														</div>
													</div>
												</Grid>

												<Grid item xs={12}>
													<Divider />
												</Grid>
											</Grid>
										))}
									</div>
								)}
							/>
						)}
					</Grid>
				</Grid>
			</PageContainer>
		</div>
	);
};

export default observer(DoctorsPage);
