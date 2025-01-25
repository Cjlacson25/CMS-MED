import { HTable } from '@hybrain/mui.ui.data-display.h-table';
import { HConfirmationDialog } from '@hybrain/mui.ui.dialogs.h-confirmation-dialog';
import { HDialog } from '@hybrain/mui.ui.dialogs.h-dialog';
import { HForm } from '@hybrain/mui.ui.formik.h-form';
import { HFormCheckbox } from '@hybrain/mui.ui.formik.h-form-checkbox';
import { HFormFileInput } from '@hybrain/mui.ui.formik.h-form-file-input';
import { HCheckbox } from '@hybrain/mui.ui.inputs.h-checkbox';
import { HSelect } from '@hybrain/mui.ui.inputs.h-select';
import { Grid, Button, Tooltip } from '@mui/material';
import api from 'api/api';
import BaseButton from 'components/inputs/BaseButton';
import BaseActions from 'components/layout/BaseActions';
import Page from 'components/layout/Page';
import React, { useCallback, useEffect, useState } from 'react';
import noImage from '../../../../assets/images/no-image.png';
import AddBoxIcon from '@mui/icons-material/AddBox';
import { HGridFormTextField } from '@hybrain/mui.ui.formik.grid.h-grid-form-text-field';

interface ServiceLinesProps {}

const ServiceLines: React.FC<ServiceLinesProps> = () => {
	const [openFormDialog, setOpenFormDialog] = useState(false);
	const [loadingDialog, setLoadingDialog] = useState(false);
	const [loading, setLoading] = useState(false);
	const [serviceLine, setServiceLine] = useState<any[]>(() => []);
	const [selectedServiceLine, setSelectedServiceLine] = useState<any>(() => ({} as any));
	const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
	const [services, setServices] = useState<any[]>(() => []);
	const [servicesSearch, setServicesSearch] = useState(1);
	const [servicesDescription, setServicesDescription] = useState('');
	const initialize = useCallback(() => {
		setLoading(true);
		api()
			.get<any>('company-service-lines', { params: { search: { CompanyServiceID: servicesSearch } } })
			.then(({ data }) => {
				setServiceLine(data.response);
			})
			.finally(() => {
				setLoading(false);
			});
	}, [servicesSearch]);
	useEffect(() => {
		initialize();
	}, [initialize]);
	useEffect(() => {
		api()
			.get<any>('company-services')
			.then(({ data }) => {
				setServices(data.response);
				setServicesDescription(data.response[0].Title);
			})
			.finally(() => {
				setLoading(false);
			});
	}, []);

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
			formData.append('CompanyServiceID', servicesSearch.toString());
			Object.keys(selectedServiceLine).length > 0
				? await api().patch<any[]>('company-service-lines/' + selectedServiceLine.CompanyServiceLineID, formData)
				: await api().post<any[]>('company-service-lines', formData);
			setOpenFormDialog(false);
			initialize();
		} finally {
			setLoadingDialog(false);
		}
	};

	return (
		<Page title="Service Lines">
			<Grid container rowSpacing={2} columnSpacing={5}>
				<Grid item xs={12} md={6}>
					<div className="font-bold text-2xl mx-2 my-3">{'Service Lines'}</div>
				</Grid>
				<Grid item xs={12} md={6} className="mb-10">
					<div className="items-end">
						<HSelect
							size="small"
							value={servicesSearch}
							onChange={(e: any) => setServicesSearch(e.target.value)}
							onOptionChange={(item) => {
								setServicesDescription(item.Title);
							}}
							optionText="Title"
							optionValue="CompanyServiceID"
							options={services}
							label="Services"
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
					<BaseButton
						onClick={() => {
							setOpenFormDialog(true);
							setSelectedServiceLine({} as any);
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
						value: 'Content',
						render: (item) => (
							<Tooltip title={item.Content}>
								<div className="truncate w-80">{item.Content}</div>
							</Tooltip>
						),
					},
					{
						label: 'Published',
						value: 'isPublished',
						render: (item) => <div>{<HCheckbox label="" checked={item.isPublished}></HCheckbox>}</div>,
					},
				]}
				items={serviceLine}
				actionColumnFit
				actionColumn={(item) => (
					<BaseActions>
						{!!item.isActive && (
							<Button
								variant="outlined"
								onClick={() => {
									setOpenDeleteDialog(true);
									setSelectedServiceLine(item);
								}}
							>
								Remove
							</Button>
						)}
						<Button
							variant="outlined"
							onClick={() => {
								setOpenFormDialog(true);
								setSelectedServiceLine(item);
							}}
						>
							Edit
						</Button>
					</BaseActions>
				)}
			></HTable>

			<HDialog
				maxWidth="md"
				title={
					Object.keys(selectedServiceLine).length > 0
						? 'Edit Service Lines: ' + servicesDescription
						: 'Add Service Lines: ' + servicesDescription
				}
				open={openFormDialog}
				onClose={() => setOpenFormDialog(false)}
			>
				<HForm
					dialog
					loading={loadingDialog}
					initialValues={{
						ImagePath: Object.keys(selectedServiceLine).length > 0 ? selectedServiceLine.ImagePath : '',
						Title: Object.keys(selectedServiceLine).length > 0 ? selectedServiceLine.Title : '',
						Content: Object.keys(selectedServiceLine).length > 0 ? selectedServiceLine.Content : '',
						isPublished: Object.keys(selectedServiceLine).length > 0 ? !!selectedServiceLine.isPublished : false,
						isActive: Object.keys(selectedServiceLine).length > 0 ? !!selectedServiceLine.isActive : true,
					}}
					onSubmit={handleSubmit}
				>
					<Grid container columnSpacing={5} rowSpacing={2}>
						<Grid item xs={12} className="flex flex-col flex-grow">
							<div>
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
							</div>
						</Grid>
						<HGridFormTextField size="small" name="Title" label="Title" xs={12} />
						<HGridFormTextField size="small" name="Content" label="Content" xs={12} multiline rows={7} />
						<Grid item xs={12} md={3}>
							<HFormCheckbox name="isActive" label="Active" />
						</Grid>
						<Grid item xs={12} md={3}>
							<HFormCheckbox name="isPublished" label="Published" />
						</Grid>
					</Grid>
				</HForm>
			</HDialog>

			<HConfirmationDialog
				open={openDeleteDialog}
				onClose={() => setOpenDeleteDialog(false)}
				title="Sub Content"
				onAgree={async () => {
					try {
						try {
							await api().delete<any>('company-service-lines/' + selectedServiceLine.CompanyServiceLineID);
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

export default ServiceLines;
