import React, { useCallback, useEffect, useState } from 'react';
import Page from '../../../../components/layout/Page';
import { HTable } from '@hybrain/mui.ui.data-display.h-table';
import { HCheckbox } from '@hybrain/mui.ui.inputs.h-checkbox';
import BaseActions from '../../../../components/layout/BaseActions';
import BaseButton from '../../../../components/inputs/BaseButton';
import AddBoxIcon from '@mui/icons-material/AddBox';
import { Button, Grid, Tooltip } from '@mui/material';
import noImage from '../../../../assets/images/no-image.png';
import { HConfirmationDialog } from '@hybrain/mui.ui.dialogs.h-confirmation-dialog';
import api from 'api/api';
import ServicesSubContentStore from 'modules/private/stores/ServicesSubContentStore';
import { HSelect } from '@hybrain/mui.ui.inputs.h-select';
import { HDialog } from '@hybrain/mui.ui.dialogs.h-dialog';
import { HForm } from '@hybrain/mui.ui.formik.h-form';
import { HFormFileInput } from '@hybrain/mui.ui.formik.h-form-file-input';
import { HFormCheckbox } from '@hybrain/mui.ui.formik.h-form-checkbox';
import FormEditor from '../../../../components/form/FormEditor';

interface ServicesSubContentProps {}

const ServicesSubContent: React.FC<ServicesSubContentProps> = () => {
	const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
	const [serviceSubContent, setServiceSubContent] = useState<any[]>(() => []);
	const [loading, setLoading] = useState(false);
	const [company, setCompany] = useState<any[]>(() => []);
	const [companySearch, setCompanySearch] = useState(1);
	const [selectedLeader, setSelectedLeader] = useState<any>(() => {});
	const [crudWindow, setCrudWindow] = useState(false);
	const [selectedServiceSubContent, setSelectedServiceSubContent] = useState<any>(() => ({} as any));
	const initialize = useCallback(() => {
		setLoading(true);
		api()
			.get<any>('service-sub-contents', { params: { search: { CompanyID: companySearch } } })
			.then(({ data }) => {
				setServiceSubContent(data.response);
			})
			.finally(() => {
				setLoading(false);
			});
	}, [companySearch]);
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
		const formData = new FormData();
		Object.keys(values).forEach((property) => {
			if (!!values[property] || values[property] === 0 || values[property] === false) {
				if (property === 'ImagePath') {
					formData.append('ImagePath', values.ImagePath);
				} else {
					formData.append(property, values[property]);
				}
			}
		});
		formData.append('CompanyID', companySearch.toString());
		try {
			Object.keys(selectedServiceSubContent).length > 0
				? await api().patch<any>('service-sub-contents/' + selectedServiceSubContent.ServiceSubContentID, formData)
				: await api().post<any>('service-sub-contents', formData);
			//navigate('../servicessubcontent');
			setCrudWindow(false);
			initialize();
		} catch {}
	};

	return (
		<Page title="Services Sub Content">
			<Grid container rowSpacing={2} columnSpacing={5}>
				<Grid item xs={12} md={6}>
					<div className="font-bold text-2xl mx-2 my-3">{'Services Sub Content'}</div>
				</Grid>
				<Grid item xs={12} md={6} className="mb-10">
					<div className="items-end">
						<HSelect
							size="small"
							value={companySearch}
							onChange={(e: any) => setCompanySearch(e.target.value)}
							optionText="Description"
							optionValue="CompanyID"
							options={company}
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
					<BaseButton
						onClick={() => {
							//navigate('servicessubcontentcrud');
							ServicesSubContentStore.setServicesSubContent({} as any);
							ServicesSubContentStore.setViewType('add');
							setSelectedServiceSubContent({});
							setCrudWindow(true);
						}}
					>
						<AddBoxIcon />
						Add
					</BaseButton>
				}
				headers={[
					{ label: '', value: 'ImagePath', render: (item) => <img src={item.ImagePath ?? noImage} alt="" className="w-20" /> },
					{
						label: 'Details',
						value: 'Content',
						render: (item) => (
							<Tooltip title={item.Content.replace(/<(?:.|\n)*?>/gm, '')}>
								<div className="truncate w-80">{item.Content.replace(/<(?:.|\n)*?>/gm, '')}</div>
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
				items={serviceSubContent}
				actionColumnFit
				actionColumn={(item) => (
					<BaseActions>
						{!!item.isActive && (
							<Button
								variant="outlined"
								onClick={() => {
									setOpenDeleteDialog(true);
									setSelectedLeader(item);
								}}
							>
								Remove
							</Button>
						)}
						<Button
							variant="outlined"
							onClick={() => {
								//navigate('servicessubcontentcrud');
								ServicesSubContentStore.setServicesSubContent(item);
								ServicesSubContentStore.setViewType('edit');
								setSelectedServiceSubContent(item);
								setCrudWindow(true);
							}}
						>
							Edit
						</Button>
					</BaseActions>
				)}
			></HTable>

			<HConfirmationDialog
				open={openDeleteDialog}
				onClose={() => setOpenDeleteDialog(false)}
				title="Services SubContent"
				onAgree={async () => {
					try {
						try {
							await api().delete<any>('service-sub-contents/' + selectedLeader.ServiceSubContentID);
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
			<HDialog
				maxWidth="md"
				title={Object.keys(selectedServiceSubContent).length > 0 ? 'Edit Service Sub Content  ' : 'Create Service Sub Content '}
				open={crudWindow}
				onClose={() => setCrudWindow(false)}
			>
				<HForm
					loading={loading}
					enableReinitialize
					initialValues={{
						ImagePath: selectedServiceSubContent?.ImagePath ?? '',
						Content: selectedServiceSubContent?.Content ?? '',
						isPublished: !!selectedServiceSubContent?.isPublished ?? false,
						isActive: Object.keys(selectedServiceSubContent).length > 0 ? !!selectedServiceSubContent.isActive : true,
					}}
					onSubmit={handleSubmit}
				>
					<Grid container columnSpacing={5} rowSpacing={2}>
						<Grid item xs={12} md={12} className="mb-10">
							<div className="items-end">
								<HSelect
									size="small"
									value={companySearch}
									onChange={(e: any) => setCompanySearch(e.target.value)}
									optionText="Description"
									optionValue="CompanyID"
									options={company}
									label="Company"
								/>
							</div>
						</Grid>
						<Grid item xs={12} className="flex flex-col flex-grow">
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
									if (fileType !== 'image') {
										return 'Please select a valid image file.';
									} else {
										return undefined;
									}
								}}
							/>
						</Grid>
						<Grid item xs={12} className="flex flex-col flex-grow">
							<Grid container columnSpacing={5} rowSpacing={2}>
								<Grid item xs={12} className="flex flex-col flex-grow">
									<div className="font-bold text-lg">{'Content'}</div>
								</Grid>
								<Grid item xs={12} lg={12} className="flex flex-col flex-grow mb-20">
									<FormEditor name="Content" />
								</Grid>
							</Grid>
						</Grid>
						<Grid item xs={12} md={3}>
							<HFormCheckbox name="isActive" label="Active" />
						</Grid>
						<Grid item xs={12} md={3}>
							<HFormCheckbox name="isPublished" label="Published" />
						</Grid>
					</Grid>
				</HForm>
			</HDialog>
		</Page>
	);
};

export default ServicesSubContent;
