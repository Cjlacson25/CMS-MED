import { HTable } from '@hybrain/mui.ui.data-display.h-table';
import { HCheckbox } from '@hybrain/mui.ui.inputs.h-checkbox';
import { Button, Grid } from '@mui/material';
import BaseButton from 'components/inputs/BaseButton';
import BaseActions from 'components/layout/BaseActions';
import Page from 'components/layout/Page';
import React, { useCallback, useEffect, useState } from 'react';
import AddBoxIcon from '@mui/icons-material/AddBox';
import api from 'api/api';
import { HTextField } from '@hybrain/mui.ui.inputs.h-text-field';
import { HConfirmationDialog } from '@hybrain/mui.ui.dialogs.h-confirmation-dialog';
import { HDialog } from '@hybrain/mui.ui.dialogs.h-dialog';
import { HForm } from '@hybrain/mui.ui.formik.h-form';
import { HFormCheckbox } from '@hybrain/mui.ui.formik.h-form-checkbox';
import { HGridFormTextField } from '@hybrain/mui.ui.formik.grid.h-grid-form-text-field';

interface ServiceMaintenanceProps {}

const ServiceMaintenance: React.FC<ServiceMaintenanceProps> = () => {
	const [openFormDialog, setOpenFormDialog] = useState(false);
	const [loadingDialog, setLoadingDialog] = useState(false);
	const [loading, setLoading] = useState(false);
	const [serviceMaintenance, setServiceMaintenance] = useState<any[]>(() => []);
	const [selectedServiceMaintenance, setSelectedServiceMaintenance] = useState<any>(() => ({} as any));
	const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

	const initialize = useCallback(() => {
		setLoading(true);
		api()
			.get<any>('service-type')
			.then(({ data }) => {
				setServiceMaintenance(data.response);
			})
			.finally(() => {
				setLoading(false);
			});
	}, []);
	useEffect(() => {
		initialize();
	}, [initialize]);

	const handleSubmit = async (values: any) => {
		setLoadingDialog(true);
		try {
			Object.keys(selectedServiceMaintenance).length > 0
				? await api().patch<any[]>('service-type/' + selectedServiceMaintenance.ServiceTypeID, values)
				: await api().post<any[]>('service-type', values);
			setOpenFormDialog(false);
			initialize();
		} finally {
			setLoadingDialog(false);
		}
	};

	return (
		<Page title="Service Maintenance">
			<Grid container rowSpacing={2} columnSpacing={5}>
				<Grid item xs={12} md={6}>
					<div className="font-bold text-2xl mx-2 my-3">{'Service Maintenance'}</div>
				</Grid>
			</Grid>
			<HTable
				rowsPerPage={10}
				withSearch
				loading={loading}
				headerActions={
					<BaseButton
						onClick={() => {
							setOpenFormDialog(true);
							setSelectedServiceMaintenance({} as any);
						}}
					>
						<AddBoxIcon />
						Add
					</BaseButton>
				}
				headers={[
					{ label: 'Service Type', value: 'Description' },
					{
						label: 'Published',
						value: 'isPublished',
						render: (item) => <div>{<HCheckbox label="" checked={item.isPublished}></HCheckbox>}</div>,
					},
				]}
				items={serviceMaintenance}
				actionColumnFit
				actionColumn={(item) => (
					<BaseActions>
						{!!item.isActive && (
							<Button
								variant="outlined"
								onClick={() => {
									setOpenDeleteDialog(true);
									setSelectedServiceMaintenance(item);
								}}
							>
								Remove
							</Button>
						)}
						<Button
							variant="outlined"
							onClick={() => {
								setOpenFormDialog(true);
								setSelectedServiceMaintenance(item);
							}}
						>
							Edit
						</Button>
					</BaseActions>
				)}
			></HTable>

			<HDialog
				maxWidth="sm"
				title={Object.keys(selectedServiceMaintenance).length > 0 ? 'Edit Service Type' : 'Add Service Type'}
				open={openFormDialog}
				onClose={() => setOpenFormDialog(false)}
			>
				<HForm
					dialog
					loading={loadingDialog}
					initialValues={{
						Description: Object.keys(selectedServiceMaintenance).length > 0 ? selectedServiceMaintenance.Description : '',
						isPublished: Object.keys(selectedServiceMaintenance).length > 0 ? !!selectedServiceMaintenance.isPublished : false,
					}}
					onSubmit={handleSubmit}
				>
					<Grid container columnSpacing={5} rowSpacing={2}>
						<Grid item xs={12} lg={12} className="flex flex-col flex-grow mb-4">
							<HGridFormTextField size="small" name="Description" label="Service Type" xs={12} />
						</Grid>
						<Grid item xs={12} md={4}>
							<HFormCheckbox name="isPublished" label="is Published" />
						</Grid>
					</Grid>
				</HForm>
			</HDialog>

			<HConfirmationDialog
				open={openDeleteDialog}
				onClose={() => setOpenDeleteDialog(false)}
				title="Service type"
				onAgree={async () => {
					try {
						try {
							await api().delete<any>('service-type/' + selectedServiceMaintenance.ServiceTypeID);
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

export default ServiceMaintenance;
