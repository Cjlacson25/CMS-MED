import { HTable } from '@hybrain/mui.ui.data-display.h-table';
import { HConfirmationDialog } from '@hybrain/mui.ui.dialogs.h-confirmation-dialog';
import { HForm } from '@hybrain/mui.ui.formik.h-form';
import { HFormSelect } from '@hybrain/mui.ui.formik.h-form-select';
import { HCheckbox } from '@hybrain/mui.ui.inputs.h-checkbox';
import { Button, Grid } from '@mui/material';
import api from 'api/api';
import BaseActions from 'components/layout/BaseActions';
import Page from 'components/layout/Page';
import useApi from 'hooks/useApi';
import React, { useState } from 'react';

interface ServiceTaggingProps {}

const ServiceTagging: React.FC<ServiceTaggingProps> = () => {
	const [companySearch, setCompanySearch] = useState(1);
	const [selectedServiceTagging, setSelectedServiceTagging] = useState<any>(() => ({} as any));
	const [servicesSearch, setServicesSearch] = useState(1);
	const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
	const { loading, data: company } = useApi<any[]>({
		url: 'company',
	});
	const { loading: loadingForm, data: services } = useApi<any[]>({
		url: 'company-services',
	});
	const { data: serviceTagging, callApi } = useApi<any[]>({
		url: 'service-taggings',
		params: { withGraphFetch: ['companyService', 'company'] },
	});

	const handleSubmit = async (values: any) => {
		try {
			await api().post<any>('service-taggings', values);
			callApi();
		} catch {}
	};
	return (
		<Page title="Service Tagging">
			<HForm
				className="mb-4"
				loading={loadingForm}
				enableReinitialize
				submitButtonPosition="left"
				submitButtonText="Add"
				initialValues={{
					CompanyID: 1,
					CompanyServiceID: 1,
					isPublished: true,
				}}
				onSubmit={handleSubmit}
			>
				<Grid container spacing={1} className="flex flex-col flex-grow">
					<Grid container rowSpacing={2} columnSpacing={5}>
						<Grid item xs={12} md={12}>
							<div className="font-bold text-xl">{'Service Tagging'}</div>
						</Grid>
						<Grid item xs={6}>
							<HFormSelect
								name="CompanyServiceID"
								size="small"
								value={servicesSearch}
								onChange={(e: any) => setServicesSearch(e.target.value)}
								optionText="Title"
								optionValue="CompanyServiceID"
								options={services}
								label="Service Type"
							/>
						</Grid>
						<Grid item xs={6}>
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
					</Grid>
				</Grid>
			</HForm>

			<HTable
				rowsPerPage={10}
				headerAlign="left"
				loading={loading}
				headers={[
					{ label: 'Company', value: 'company.Description' },
					{ label: 'Location', value: 'companyService.Title' },
					{
						label: 'Active',
						value: 'isActive',
						render: (item) => <div>{<HCheckbox label="" checked={item.isActive}></HCheckbox>}</div>,
					},
				]}
				items={serviceTagging}
				actionColumnFit
				actionColumn={(item) => (
					<BaseActions>
						{!!item.isActive && (
							<Button
								variant="outlined"
								onClick={() => {
									setOpenDeleteDialog(true);
									setSelectedServiceTagging(item);
								}}
							>
								Remove
							</Button>
						)}
					</BaseActions>
				)}
			></HTable>
			<HConfirmationDialog
				open={openDeleteDialog}
				onClose={() => setOpenDeleteDialog(false)}
				title="Service Tagging"
				onAgree={async () => {
					try {
						try {
							await api().delete<any>('service-taggings/' + selectedServiceTagging.ServiceTaggingID);
							setOpenDeleteDialog(false);
							callApi();
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

export default ServiceTagging;
