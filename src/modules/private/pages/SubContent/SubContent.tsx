import React, { useState, useCallback, useEffect } from 'react';
import Page from '../../../../components/layout/Page';
import { HTable } from '@hybrain/mui.ui.data-display.h-table';
import { Button, Grid, Tooltip } from '@mui/material';
import BaseActions from '../../../../components/layout/BaseActions';
import { HCheckbox } from '@hybrain/mui.ui.inputs.h-checkbox';
import BaseButton from '../../../../components/inputs/BaseButton';
import AddBoxIcon from '@mui/icons-material/AddBox';
import { HDialog } from '@hybrain/mui.ui.dialogs.h-dialog';
import { HForm } from '@hybrain/mui.ui.formik.h-form';
import { HFormFileInput } from '@hybrain/mui.ui.formik.h-form-file-input';
import FormEditor from '../../../../components/form/FormEditor';
import { HConfirmationDialog } from '@hybrain/mui.ui.dialogs.h-confirmation-dialog';
import { HFormCheckbox } from '@hybrain/mui.ui.formik.h-form-checkbox';
import api from '../../../../api/api';
import AuthStore from '../../../../stores/AuthStore';
import noImage from '../../../../assets/images/no-image.png';
import { HSelect } from '@hybrain/mui.ui.inputs.h-select';

interface SubContentProps {}

const SubContent: React.FC<SubContentProps> = () => {
	const [openFormDialog, setOpenFormDialog] = useState(false);
	const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
	const [loadingDialog, setLoadingDialog] = useState(false);
	const [company, setCompany] = useState<any[]>(() => []);
	const [companySearch, setCompanySearch] = useState(1);
	const [subcontent, setSubContent] = useState<any[]>(() => []);
	const [selectedSubContent, setSelectedSubContent] = useState<any>(() => ({} as any));
	const [loading, setLoading] = useState(false);
	const initialize = useCallback(() => {
		setLoading(true);
		api()
			.get<any>('company-sub-contents', { params: { search: { CompanyID: companySearch } } })
			.then(({ data }) => {
				setSubContent(data.response);
			})
			.finally(() => {
				setLoading(false);
			});
	}, [companySearch]);
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
			formData.append('CompanyID', companySearch.toString());
			Object.keys(selectedSubContent).length > 0
				? await api().patch<any[]>('company-sub-contents/' + selectedSubContent.CompanySubContentID, formData)
				: await api().post<any[]>('company-sub-contents', formData);
			setOpenFormDialog(false);
			initialize();
		} finally {
			setLoadingDialog(false);
		}
	};

	return (
		<Page title="Sub Content">
			<Grid container rowSpacing={2} columnSpacing={5}>
				<Grid item xs={12} md={6}>
					<div className="font-bold text-2xl mx-2 my-3">{'Sub Content'}</div>
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
							setOpenFormDialog(true);
							setSelectedSubContent({} as any);
						}}
					>
						<AddBoxIcon />
						Add
					</BaseButton>
				}
				headers={[
					{ label: '', value: 'ImagePath', render: (item) => <img src={item.ImagePath ?? noImage} alt="" className="w-20" /> },
					{
						label: 'Title',
						value: 'Title',
						render: (item) => (
							<Tooltip title={<div dangerouslySetInnerHTML={{ __html: item.Title }}></div>}>
								<div dangerouslySetInnerHTML={{ __html: item.Title }}></div>
							</Tooltip>
						),
					},
					{
						label: 'Content',
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
						render: (item) => <div>{<HCheckbox label="" checked={item.isPublished}></HCheckbox>}</div>,
					},
				]}
				items={subcontent}
				actionColumnFit
				actionColumn={(item) => (
					<BaseActions>
						{!!item.isActive && (
							<Button
								variant="outlined"
								onClick={() => {
									setOpenDeleteDialog(true);
									setSelectedSubContent(item);
								}}
							>
								Remove
							</Button>
						)}
						<Button
							variant="outlined"
							onClick={() => {
								setOpenFormDialog(true);
								setSelectedSubContent(item);
							}}
						>
							Edit
						</Button>
					</BaseActions>
				)}
			></HTable>

			<HDialog
				maxWidth="lg"
				title={Object.keys(selectedSubContent).length > 0 ? 'Edit Sub Content' : 'Add Sub Content'}
				open={openFormDialog}
				onClose={() => setOpenFormDialog(false)}
			>
				<HForm
					dialog
					loading={loadingDialog}
					initialValues={{
						ImagePath: Object.keys(selectedSubContent).length > 0 ? selectedSubContent.ImagePath : '',
						Title: Object.keys(selectedSubContent).length > 0 ? selectedSubContent.Title : '',
						Content: Object.keys(selectedSubContent).length > 0 ? selectedSubContent.Content : '',
						CreatedBy: AuthStore.user.Username + ': ' + AuthStore.user.UserID,
						isPublished: Object.keys(selectedSubContent).length > 0 ? !!selectedSubContent.isPublished : false,
						isActive: Object.keys(selectedSubContent).length > 0 ? !!selectedSubContent.isActive : true,
					}}
					onSubmit={handleSubmit}
				>
					<Grid container columnSpacing={5} rowSpacing={2}>
						<Grid item xs={4} className="mt-16">
							<HFormFileInput
								button
								imageProps={{ width: '100%', height: '350px' }}
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
						<Grid item xs={8}>
							<Grid container columnSpacing={5} rowSpacing={2}>
								<Grid item xs={12} className="flex flex-col flex-grow">
									<div className="font-bold text-xl">{'Title'}</div>
								</Grid>
								<Grid item xs={12} lg={12} className="flex flex-col flex-grow mb-32 h-14">
									<FormEditor name="Title" />
								</Grid>
								<Grid item xs={12} className="flex flex-col flex-grow">
									<div className="font-bold text-xl">{'Content'}</div>
								</Grid>
								<Grid item xs={12} lg={12} className="flex flex-col flex-grow mb-20 h-40">
									<FormEditor name="Content" />
								</Grid>
							</Grid>
						</Grid>
						<Grid item xs={12} md={2}>
							<HFormCheckbox name="isActive" label="Active" />
						</Grid>
						<Grid item xs={12} md={2}>
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
							await api().delete<any>('company-sub-contents/' + selectedSubContent.CompanySubContentID);
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

export default SubContent;
