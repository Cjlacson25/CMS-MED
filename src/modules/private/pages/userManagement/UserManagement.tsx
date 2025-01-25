import React, { useCallback, useEffect, useState } from 'react';
import Page from '../../../../components/layout/Page';
import { HTable } from '@hybrain/mui.ui.data-display.h-table';
import { HCheckbox } from '@hybrain/mui.ui.inputs.h-checkbox';
import BaseActions from '../../../../components/layout/BaseActions';
import BaseButton from '../../../../components/inputs/BaseButton';
import AddBoxIcon from '@mui/icons-material/AddBox';
import { Button, Grid } from '@mui/material';
import { HConfirmationDialog } from '@hybrain/mui.ui.dialogs.h-confirmation-dialog';
import { HDialog } from '@hybrain/mui.ui.dialogs.h-dialog';
import { HForm } from '@hybrain/mui.ui.formik.h-form';
import { HGridFormTextField } from '@hybrain/mui.ui.formik.grid.h-grid-form-text-field';
import { HFormCheckbox } from '@hybrain/mui.ui.formik.h-form-checkbox';
import api from '../../../../api/api';
import DialogStore from 'stores/DialogStore';
import { useNavigate } from 'react-router-dom';
import { HFormSelect } from '@hybrain/mui.ui.formik.h-form-select';

interface UserManagementProps {}

const UserManagement: React.FC<UserManagementProps> = () => {
	const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
	const [openFormDialog, setOpenFormDialog] = useState(false);
	const [users, setUsers] = useState<any[]>(() => []);
	const [selecteduser, setSelectedUser] = useState<any>(() => ({} as any));
	const [loading, setLoading] = useState(false);
	const [company, setCompany] = useState<any[]>(() => []);
	const [companySearch, setCompanySearch] = useState(1);
	const DIALOG_TIMEOUT = 6000;
	const navigate = useNavigate();
	const initialize = useCallback(() => {
		setLoading(true);
		api()
			.get<any>('users')
			.then(({ data }) => {
				setUsers(data.response);
			})
			.finally(() => {
				setLoading(false);
			});
	}, []);
	useEffect(() => {
		initialize();
	}, [initialize]);
	useEffect(() => {
		api()
			.get<any>('company')
			.then(({ data }) => {
				setCompany(data.response);
			})
			.finally(() => {
				setLoading(false);
			});
	}, []);
	const handleSubmit = async (values: any) => {
		try {
			if (values.Password !== values.ConfirmPassword) {
				DialogStore.error("Passwords don't match");
				setTimeout(() => {
					DialogStore.close();
				}, DIALOG_TIMEOUT);
				return;
			}
			values.ConfirmPassword = undefined;
			await api().post<any>('users', values);
			setOpenFormDialog(false);
			navigate('../usermanagement');
		} catch {}
	};
	return (
		<Page title="User Management">
			<div className="font-bold text-2xl mx-2 my-3">{'User Management'}</div>
			<HTable
				rowsPerPage={10}
				withSearch
				headerAlign="left"
				loading={loading}
				headerActions={
					<BaseButton onClick={() => setOpenFormDialog(true)}>
						<AddBoxIcon />
						Add
					</BaseButton>
				}
				headers={[
					{ label: 'Name', value: 'Name' },
					{ label: 'Email Address', value: 'EmailAddress' },
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
				items={users}
				actionColumnFit
				actionColumn={(item) => (
					<BaseActions>
						{!!item.isActive && (
							<Button
								variant="outlined"
								onClick={() => {
									setOpenDeleteDialog(true);
									setSelectedUser(item);
								}}
							>
								Remove
							</Button>
						)}
					</BaseActions>
				)}
			></HTable>

			<HDialog
				maxWidth="sm"
				title="Add User"
				open={openFormDialog}
				onClose={() => {
					setOpenFormDialog(false);
				}}
			>
				<HForm
					dialog
					// loading={loadingDialog}
					initialValues={{
						Name: '',
						EmailAddress: '',
						Username: '',
						Password: '',
						ConfirmPassword: '',
						UserType: '',
						isPublished: false,
						CompanyID: 1,
						isActive: true,
					}}
					onSubmit={handleSubmit}
				>
					{({ values, setFieldValue }) => (
						<Grid container rowSpacing={3}>
							<Grid item xs={12} md={12} className="flex flex-col flex-grow">
								<Grid container rowSpacing={2} xs={12} md={12}>
									<Grid item xs={12}>
										<HFormSelect
											name="CompanyID"
											size="small"
											value={companySearch}
											onChange={(e: any) => setCompanySearch(e.target.value)}
											optionText="Description"
											optionValue="CompanyID"
											options={company}
											label="Company"
										/>
									</Grid>
									<Grid item xs={12} md={12}>
										<HGridFormTextField size="small" name="Name" label="Name" xs={12} />
									</Grid>
									<Grid item xs={12} md={12}>
										<HGridFormTextField size="small" name="EmailAddress" label="Email Address" xs={12} />
									</Grid>
									<Grid item xs={12} md={12}>
										<HGridFormTextField
											size="small"
											name="Username"
											label="Username"
											xs={12}
											inputProps={{
												autocomplete: 'new-username',
												form: {
													autocomplete: 'off',
												},
											}}
										/>
									</Grid>
									<Grid item xs={12} md={12}>
										<HGridFormTextField
											type="password"
											size="small"
											name="Password"
											label="Password"
											xs={12}
											inputProps={{
												autocomplete: 'new-password',
												form: {
													autocomplete: 'off',
												},
											}}
										/>
									</Grid>
									<Grid item xs={12} md={12}>
										<HGridFormTextField
											type="password"
											size="small"
											name="ConfirmPassword"
											label="Confirm Password"
											xs={12}
											inputProps={{
												autocomplete: 'new-passwordConfirm',
												form: {
													autocomplete: 'off',
												},
											}}
										/>
									</Grid>
									<Grid item xs={12} md={12}>
										<HFormSelect size="small" name="UserType" label="User Type" options={['ADMIN', 'STAFF']} />
									</Grid>
									<Grid item xs={12} md={4}>
										<HFormCheckbox name="isActive" label="Active" />
									</Grid>
									<Grid item xs={12} md={4}>
										<HFormCheckbox name="isPublished" label="Published" />
									</Grid>
								</Grid>
							</Grid>
						</Grid>
					)}
				</HForm>
			</HDialog>

			<HConfirmationDialog
				open={openDeleteDialog}
				onClose={() => setOpenDeleteDialog(false)}
				title="User Management"
				onAgree={async () => {
					try {
						try {
							await api().delete<any>('users/' + selecteduser.UserID);
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

export default UserManagement;
