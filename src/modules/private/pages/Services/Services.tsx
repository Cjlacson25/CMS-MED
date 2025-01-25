import { HTable } from '@hybrain/mui.ui.data-display.h-table';
import { HConfirmationDialog } from '@hybrain/mui.ui.dialogs.h-confirmation-dialog';
import { HCheckbox } from '@hybrain/mui.ui.inputs.h-checkbox';
import { Grid, Button, Tooltip } from '@mui/material';
import api from 'api/api';
import BaseButton from 'components/inputs/BaseButton';
import BaseActions from 'components/layout/BaseActions';
import Page from 'components/layout/Page';
import React, { useCallback, useEffect, useState } from 'react';
import AddBoxIcon from '@mui/icons-material/AddBox';
import { HDialog } from '@hybrain/mui.ui.dialogs.h-dialog';
import { HGridFormTextField } from '@hybrain/mui.ui.formik.grid.h-grid-form-text-field';
import { HForm } from '@hybrain/mui.ui.formik.h-form';
import { HFormCheckbox } from '@hybrain/mui.ui.formik.h-form-checkbox';
import { HFormFileInput } from '@hybrain/mui.ui.formik.h-form-file-input';
import noImage from 'assets/images/no-image.png';
import FormEditor from 'components/form/FormEditor';

interface ServicesProps {}

const Services: React.FC<ServicesProps> = () => {
	const [openFormDialog, setOpenFormDialog] = useState(false);
	const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
	const [loadingDialog, setLoadingDialog] = useState(false);
	const [service, setService] = useState<any[]>(() => []);
	const [loading, setLoading] = useState(false);
	const [selectedServices, setSelectedServices] = useState<any>(() => ({} as any));
	const initialize = useCallback(() => {
		setLoading(true);
		api()
			.get<any>('company-services')
			.then(({ data }) => {
				setService(data.response);
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
			const formData = new FormData();
			Object.keys(values).forEach((property) => {
				if (property === 'ImagePath') {
					formData.append('ImagePath', values.ImagePath);
				} else if (property === 'isPublished') {
					formData.append('isPublished', values.isPublished ? '1' : '0');
				} else {
					formData.append(property, values[property]);
				}
			});
			Object.keys(selectedServices).length > 0
				? await api().patch<any[]>('company-services/' + selectedServices.CompanyServiceID, formData, {
						params: { slug: 'Title' },
				  })
				: await api().post<any[]>('company-services', formData, { params: { slug: 'Title' } });
			setOpenFormDialog(false);
			initialize();
		} finally {
			setLoadingDialog(false);
		}
	};
	return (
		<Page title="Services">
			<Grid container rowSpacing={2} columnSpacing={5}>
				<Grid item xs={12} md={6}>
					<div className="font-bold text-2xl mx-2 my-3">{'Services'}</div>
				</Grid>
			</Grid>

			<HTable
				rowsPerPage={10}
				withSearch
				headerAlign="left"
				loading={loading}
				headerActions={
					<BaseButton
						onClick={() => {
							setOpenFormDialog(true);
							setSelectedServices({} as any);
						}}
					>
						<AddBoxIcon />
						Add
					</BaseButton>
				}
				headers={[
					{ label: '', value: 'ImagePath', render: (item) => <img src={item.ImagePath ?? noImage} alt="" className="w-20" /> },
					{ label: 'Title', value: 'Title' },
					{
						label: 'Content',
						value: 'ServiceContent',
						render: (item) => (
							<Tooltip title={item.ServiceContent?.replace(/<(?:.|\n)*?>/gm, '')}>
								<div className="truncate w-80">{item.ServiceContent?.replace(/<(?:.|\n)*?>/gm, '')}</div>
							</Tooltip>
						),
					},
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
				items={service}
				actionColumnFit
				actionColumn={(item) => (
					<BaseActions>
						{!!item.isActive && (
							<Button
								variant="outlined"
								onClick={() => {
									setOpenDeleteDialog(true);
									setSelectedServices(item);
								}}
							>
								Remove
							</Button>
						)}
						<Button
							variant="outlined"
							onClick={() => {
								setOpenFormDialog(true);
								setSelectedServices(item);
							}}
						>
							Edit
						</Button>
					</BaseActions>
				)}
			></HTable>

			<HDialog
				maxWidth="md"
				title={Object.keys(selectedServices).length > 0 ? 'Edit Service: ' : 'Add Service: '}
				open={openFormDialog}
				onClose={() => setOpenFormDialog(false)}
			>
				<HForm
					dialog
					loading={loadingDialog}
					initialValues={{
						Title: Object.keys(selectedServices).length > 0 ? selectedServices.Title : '',
						ImagePath: Object.keys(selectedServices).length > 0 ? selectedServices.ImagePath : '',
						ServiceContent: Object.keys(selectedServices).length > 0 ? selectedServices.ServiceContent : '',
						isPublished: Object.keys(selectedServices).length > 0 ? !!selectedServices.isPublished : false,
						isActive: Object.keys(selectedServices).length > 0 ? !!selectedServices.isActive : true,
					}}
					onSubmit={handleSubmit}
				>
					<Grid container columnSpacing={5} rowSpacing={2}>
						<Grid item xs={12}>
							<HFormFileInput
								button
								name="ImagePath"
								label="File"
								inputProps={{ accept: 'image/*' }}
								validateBeforeUpload={(value) => {
									let file = value;
									let reader = new FileReader();
									reader.readAsDataURL(value);
									let fileType = file.type.split('/')[0];
									if (fileType !== 'image' || file.size > 1000000) {
										if (fileType !== 'image') return 'Please select a valid image file.';
										else return 'Image file size too large.';
									} else {
										return undefined;
									}
								}}
							/>
						</Grid>
						<HGridFormTextField size="small" name="Title" label="Title" />
						<Grid item xs={12}>
							<FormEditor name="ServiceContent" />
						</Grid>
						{/* <HGridFormTextField size="small" name="ServiceContent" label="Content" xs={12} multiline rows={7} /> */}
						<Grid item xs={12} md={4}>
							<HFormCheckbox name="isActive" label="Active" />
						</Grid>
						<Grid item xs={12} md={4}>
							<HFormCheckbox name="isPublished" label="Published" />
						</Grid>
					</Grid>
				</HForm>
			</HDialog>
			<HConfirmationDialog
				open={openDeleteDialog}
				onClose={() => setOpenDeleteDialog(false)}
				title="Services"
				onAgree={async () => {
					try {
						try {
							await api().delete<any>('company-services/' + selectedServices.CompanyServiceID);
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

export default Services;
