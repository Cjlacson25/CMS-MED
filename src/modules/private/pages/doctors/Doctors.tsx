import React, { useCallback, useEffect, useState } from 'react';
import Page from '../../../../components/layout/Page';
import BaseActions from '../../../../components/layout/BaseActions';
import BaseButton from '../../../../components/inputs/BaseButton';
import AddBoxIcon from '@mui/icons-material/AddBox';
import DeleteIcon from '@mui/icons-material/Delete';
import { Button, Grid } from '@mui/material';
import { HDialog } from '@hybrain/mui.ui.dialogs.h-dialog';
import { HForm } from '@hybrain/mui.ui.formik.h-form';
import { HGridFormTextField } from '@hybrain/mui.ui.formik.grid.h-grid-form-text-field';
import { HFormTimePicker } from '@hybrain/mui.ui.formik.h-form-time-picker';
import { HTable } from '@hybrain/mui.ui.data-display.h-table';
import { HCheckbox } from '@hybrain/mui.ui.inputs.h-checkbox';
import { HConfirmationDialog } from '@hybrain/mui.ui.dialogs.h-confirmation-dialog';
import { HFormCheckbox } from '@hybrain/mui.ui.formik.h-form-checkbox';
import api from '../../../../api/api';
import FormSelect from 'components/form/FormSelect';
import { HSelect } from '@hybrain/mui.ui.inputs.h-select';
import { convertToSqlDateTime } from 'helpers/utils/date';
import { joinStrings } from 'helpers/utils/string';
import FormTimePicker from 'components/form/FormTimePicker';
import rules from 'helpers/utils/rules';

interface DoctorsProps {}

const Doctors: React.FC<DoctorsProps> = () => {
	const [openFormDialog, setOpenFormDialog] = useState(false);
	const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
	const [loading, setLoading] = useState(false);
	const [doctors, setDoctors] = useState<any[]>([]);
	const [selectedDoctors, setSelectedDoctors] = useState<any>({});
	const [companies, setCompanies] = useState<any[]>([]);
	const [companySearch, setCompanySearch] = useState(1);
	const [companyDescription, setCompanyDescription] = useState('');
	const initialize = useCallback(() => {
		setLoading(true);
		api()
			.get<any>('doctors', { params: { withGraphFetch: ['doctorSchedules', 'company'] } })
			.then(({ data }) => {
				setDoctors(data.response);
			})
			.finally(() => {
				setLoading(false);
			});

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [companySearch]);
	useEffect(() => {
		initialize();
	}, [initialize]);
	useEffect(() => {
		api()
			.get<any>('company')
			.then(({ data }) => {
				setCompanies(data.response);
				setCompanyDescription(data.response?.[0].Description);
			})
			.finally(() => {
				setLoading(false);
			});
	}, []);
	const handleSubmit = async (values: any) => {
		values.Name = joinStrings([values.FirstName, values.MiddleName, values.LastName, values.Suffix], ' ');
		values.doctorSchedules = values.doctorSchedules.map((doctor: any) => ({
			...doctor,
			StartDateTime: convertToSqlDateTime(doctor.StartDateTime, doctor.StartDateTime),
			EndDateTime: convertToSqlDateTime(doctor.EndDateTime, doctor.EndDateTime),
		}));
		try {
			Object.keys(selectedDoctors).length > 0
				? await api().patch<any>('doctors/' + selectedDoctors.DoctorID, values)
				: await api().post<any>('doctors', values);
			setOpenFormDialog(false);
			initialize();
		} catch {}
	};
	const handleClickAdd = () => {
		setSelectedDoctors({});
		setOpenFormDialog(true);
	};
	console.log(doctors);
	return (
		<Page title="Doctors">
			<Grid container rowSpacing={2} columnSpacing={5}>
				<Grid item xs={12} md={6}>
					<div className="font-bold text-2xl mx-2 my-3">{'Doctors'}</div>
				</Grid>
				<Grid item xs={12} md={6} className="mb-10">
					<div className="items-end">
						<HSelect
							size="small"
							value={companySearch}
							onChange={(e: any) => {
								setCompanySearch(e.target.value);
							}}
							onOptionChange={(item: any) => {
								setCompanyDescription(item.Description);
							}}
							optionText="Description"
							optionValue="CompanyID"
							options={companies}
							label="Company"
						/>
					</div>
				</Grid>
			</Grid>
			<HTable
				rowsPerPage={10}
				withSearch
				headerAlign="left"
				loading={loading}
				headerActions={
					<BaseButton onClick={handleClickAdd}>
						<AddBoxIcon />
						Add
					</BaseButton>
				}
				headers={[
					{ label: 'Name', value: 'Name' },
					{
						label: 'Published',
						value: 'isPublished',
						render: (item) => (
							<div>
								<HCheckbox label="" checked={item.isPublished}></HCheckbox>
							</div>
						),
					},
				]}
				items={doctors}
				actionColumnFit
				actionColumn={(item) => (
					<BaseActions>
						{!!item.isActive && (
							<Button
								variant="outlined"
								onClick={() => {
									setOpenDeleteDialog(true);
									setSelectedDoctors(item);
								}}
							>
								Remove
							</Button>
						)}
						<Button
							variant="outlined"
							onClick={() => {
								setOpenFormDialog(true);
								setSelectedDoctors(item);
							}}
						>
							Edit
						</Button>
					</BaseActions>
				)}
			></HTable>

			<HDialog
				maxWidth="lg"
				title={
					Object.keys(selectedDoctors).length > 0
						? 'Doctors Edit : ' + companyDescription
						: 'Doctors Create : ' + companyDescription
				}
				open={openFormDialog}
				onClose={() => {
					setOpenFormDialog(false);
				}}
			>
				<HForm
					dialog
					initialValues={{
						LastName: Object.keys(selectedDoctors).length > 0 ? selectedDoctors.LastName : '',
						FirstName: Object.keys(selectedDoctors).length > 0 ? selectedDoctors.FirstName : '',
						MiddleName: Object.keys(selectedDoctors).length > 0 ? selectedDoctors.MiddleName : '',
						Suffix: Object.keys(selectedDoctors).length > 0 ? selectedDoctors.Suffix : '',
						PCRLicenseNo: Object.keys(selectedDoctors).length > 0 ? selectedDoctors.PCRLicenseNo : '',
						Specialization: Object.keys(selectedDoctors).length > 0 ? selectedDoctors.Specialization : '',
						SubSpecialization: Object.keys(selectedDoctors).length > 0 ? selectedDoctors.SubSpecialization : '',
						OfficeNumber: Object.keys(selectedDoctors).length > 0 ? selectedDoctors.OfficeNumber : '',
						OfficeLocation: Object.keys(selectedDoctors).length > 0 ? selectedDoctors.OfficeLocation : '',
						SecretaryContactNo: Object.keys(selectedDoctors).length > 0 ? selectedDoctors.SecretaryContactNo : '',
						Availability: Object.keys(selectedDoctors).length > 0 ? selectedDoctors.Availability : '',
						HMOAccreditation: Object.keys(selectedDoctors).length > 0 ? selectedDoctors.HMOAccreditation : '',
						doctorSchedules: Object.keys(selectedDoctors).length > 0 ? selectedDoctors.doctorSchedules : [],
						isPublished: Object.keys(selectedDoctors).length > 0 ? !!selectedDoctors.isPublished : false,
						CompanyID: companySearch.toString(),
						isActive: Object.keys(selectedDoctors).length > 0 ? !!selectedDoctors.isActive : true,
					}}
					onSubmit={handleSubmit}
				>
					{({ values, setFieldValue }) => (
						<Grid container rowSpacing={2} columnSpacing={5}>
							<Grid item xs={12} md={6}>
								<Grid container rowSpacing={2} columnSpacing={5}>
									{/* <HGridFormTextField size="small" name="Name" label="name" xs={12} /> */}
									<HGridFormTextField size="small" name="FirstName" label="first name" xs={12} />
									<HGridFormTextField size="small" name="MiddleName" label="middle name" xs={12} />
									<HGridFormTextField size="small" name="LastName" label="last name" xs={12} />
									<HGridFormTextField size="small" name="Suffix" label="suffix" xs={12} />
									<HGridFormTextField size="small" name="Specialization" label="specialization" xs={12} />
									<HGridFormTextField size="small" name="SubSpecialization" label="sub specialization" xs={12} />
								</Grid>
							</Grid>
							<Grid item xs={12} md={6}>
								<Grid container rowSpacing={2} columnSpacing={5}>
									<HGridFormTextField size="small" name="PCRLicenseNo" label="license no." xs={12} />
									<HGridFormTextField size="small" name="OfficeNumber" label="office no." xs={12} />
									<HGridFormTextField
										size="small"
										name="OfficeLocation"
										label="office location"
										xs={12}
										multiline
										rows={3}
										className="mb-2.5"
									/>
									<HGridFormTextField size="small" name="SecretaryContactNo" label="secretary contact no." xs={12} />
									<HGridFormTextField size="small" name="Availability" label="availability" xs={12} />
									<HGridFormTextField size="small" name="HMOAccreditation" label="HMO Accreditation" xs={12} />
								</Grid>
							</Grid>
							<Grid item xs={6} className="text-lg">
								{'Schedule'}
							</Grid>
							<Grid item xs={6} className="text-right">
								<BaseButton
									className=""
									onClick={() =>
										setFieldValue('doctorSchedules', [
											...values.doctorSchedules,
											{ Day: '', StartDateTime: '', EndDateTime: '', isPublished: 1, isActive: 1 },
										])
									}
								>
									<AddBoxIcon />
									Add Schedule
								</BaseButton>
							</Grid>

							{values.doctorSchedules.map((hour: any, index: number) => (
								<React.Fragment key={index}>
									<Grid item xs={12} md={3}>
										<FormSelect
											name={`doctorSchedules.${index}.Day`}
											label="Day"
											options={['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']}
										/>
									</Grid>
									<Grid item xs={12} md={4}>
										<FormTimePicker
											validate={rules.required}
											name={`doctorSchedules.${index}.StartDateTime`}
											label="Start Time"
										/>
									</Grid>
									<Grid item xs={12} md={4}>
										<FormTimePicker validate={rules.required} name={`doctorSchedules.${index}.EndDateTime`} label="End Time" />
									</Grid>
									<Grid item xs={12} md={1}>
										<BaseButton
											backgroundColor="danger"
											height="45px"
											onClick={() => {
												setFieldValue(
													'doctorSchedules',
													values.doctorSchedules.filter((_: any, i: any) => i !== index)
												);
											}}
										>
											<DeleteIcon />
										</BaseButton>
									</Grid>
								</React.Fragment>
							))}
							<Grid item xs={12} md={3}>
								<HFormCheckbox name="isActive" label="Active" />
							</Grid>
							<Grid item xs={12} md={3}>
								<HFormCheckbox name="isPublished" label="Published" />
							</Grid>
						</Grid>
					)}
				</HForm>
			</HDialog>
			<HConfirmationDialog
				open={openDeleteDialog}
				onClose={() => setOpenDeleteDialog(false)}
				title="Doctors"
				onAgree={async () => {
					try {
						try {
							await api().delete<any>('doctors/' + selectedDoctors.DoctorID);
							setOpenDeleteDialog(false);
							initialize();
						} catch {}
					} catch {
						setOpenDeleteDialog(true);
					}
				}}
			>
				Are you sure you want to remove this item?
			</HConfirmationDialog>
		</Page>
	);
};

export default Doctors;
