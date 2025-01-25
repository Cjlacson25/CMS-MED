import React from 'react';

import CompanyStore from 'modules/public/stores/CompanyStore';
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import BaseButton from 'components/inputs/BaseButton';
import SearchIcon from '@mui/icons-material/Search';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';

import useApi from 'hooks/useApi';
import DoctorModel from 'types/doctor.model';
import { getDoctorSchedule, joinStrings } from 'helpers/utils/string';
import BaseForm from 'components/form/BaseForm';
import FormTextField from 'components/form/FormTextField';
import Banner from '../LandingPage/components/Banner';
import BasePagination from 'components/navigation/BasePagination';

interface FindDoctorPageProps {}

const SearchBarContainer = styled('div')({
	backgroundColor: '#E3E6E9',
	padding: '20px',
	paddingBottom: '40px',
	marginTop: '150px',
	marginLeft: '20px',
	marginRight: '20px',
});

const FindDoctorPage: React.FC<FindDoctorPageProps> = () => {
	const {
		data: doctors,
		callApi,
		loading,
	} = useApi<DoctorModel[]>({
		url: 'doctors/client',
		immediate: false,
	});

	const handleSearch = (values: any) => {
		callApi({ params: values });
	};
	console.log(doctors);
	return (
		<div>
			<Banner items={CompanyStore.company?.headers ?? []} />

			<SearchBarContainer>
				<BaseForm
					initialValues={{
						doctor: '',
						location: '',
					}}
					onSubmit={handleSearch}
					noSubmitButton
				>
					<Grid container spacing={3} alignItems="flex-end">
						<Grid item xs={12} md={8}>
							<div className="mb-3">*Find a physician or provider</div>
							<FormTextField name="doctor" placeholder="Search by Specialty, Name ..." className="bg-white" size="small" />
						</Grid>

						<Grid item xs={12} md={3}>
							<div className="mb-3">Within 10 miles of:</div>
							<FormTextField name="location" placeholder="Enter City, State, or Zip" className="bg-white" size="small" />
						</Grid>

						<Grid item xs={12} md={1}>
							<BaseButton type="submit" height="39px" fullWidth loading={loading}>
								<SearchIcon />
							</BaseButton>
						</Grid>
					</Grid>
				</BaseForm>
			</SearchBarContainer>

			<div className="mt-10 px-6">
				<Typography color="#2166A7" className="text-2xl font-bold">
					SEARCH RESULT
				</Typography>

				{doctors.length > 0 && (
					<BasePagination
						position="right"
						items={doctors}
						render={(items) => (
							<div className="flex flex-col gap-y-4 mt-6">
								{items.map((doctor, index) => (
									<Paper className="p-5">
										<Grid container spacing={3}>
											<Grid item xs={12} md={9} key={index}>
												<div className="text-lg font-bold uppercase text-neutral-500">
													{joinStrings([doctor.FirstName, doctor.MiddleName], ' ')}
												</div>

												<Typography color="#2166A7" className="mt-3 text-3xl font-bold uppercase">
													{doctor.LastName}
												</Typography>

												<div className="mt-1 font-bold uppercase text-neutral-500">
													{doctor.Specialization} ({doctor.SubSpecialization ?? 'none'})
												</div>
											</Grid>

											<Grid item xs={12} md={3}>
												<Typography className="font-bold text-neutral-500" fontSize={17}>
													Clinic Schedule
												</Typography>

												<div className="mt-2"></div>

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

														<div className="font-bold">Time Day</div>
														<div>Availability: {doctor.Availability}</div>
														<div>
															{getDoctorSchedule(doctor).map((schedule, index) => (
																<div key={index}>{schedule}</div>
															))}
														</div>

														<div className="font-bold">Office Number/Location</div>
														<div>{joinStrings([doctor.OfficeNumber, doctor.OfficeLocation], ' / ')}</div>
														<div className="font-bold">Secretary's Contact Number</div>
														<div>{doctor.SecretaryContactNo}</div>
													</div>
												</div>
											</Grid>
										</Grid>
									</Paper>
								))}
							</div>
						)}
					/>
				)}
			</div>
		</div>
	);
};

export default FindDoctorPage;
