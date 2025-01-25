import React, { useCallback, useEffect, useState } from 'react';
import Page from '../../../../components/layout/Page';
import { HTable } from '@hybrain/mui.ui.data-display.h-table';
import { Button, Grid, Tooltip } from '@mui/material';
import BaseActions from '../../../../components/layout/BaseActions';
import { HCheckbox } from '@hybrain/mui.ui.inputs.h-checkbox';
import BaseButton from '../../../../components/inputs/BaseButton';
import AddBoxIcon from '@mui/icons-material/AddBox';
import noImage from '../../../../assets/images/no-image.png';
import { HConfirmationDialog } from '@hybrain/mui.ui.dialogs.h-confirmation-dialog';
import api from 'api/api';
import { HSelect } from '@hybrain/mui.ui.inputs.h-select';
import NewsUpdatesStore from 'modules/private/stores/NewsUpdatesStore';
import { HDialog } from '@hybrain/mui.ui.dialogs.h-dialog';
import FormEditor from '../../../../components/form/FormEditor';
import { HForm } from '@hybrain/mui.ui.formik.h-form';
import { HFormFileInput } from '@hybrain/mui.ui.formik.h-form-file-input';
import { HFormCheckbox } from '@hybrain/mui.ui.formik.h-form-checkbox';
import FormTextField from 'components/form/FormTextField';
import { convertToSqlDateTime } from 'helpers/utils/date';
import { HFormDateTimePicker } from '@hybrain/mui.ui.formik.h-form-date-time-picker';

interface NewsAndUpdatesProps {}

const NewsAndUpdates: React.FC<NewsAndUpdatesProps> = () => {
	const [loading, setLoading] = useState(false);
	const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
	const [newsupdates, setNewsUpdates] = useState<any[]>(() => []);
	const [selectedNewsUpdates, setSelectedNewsUpdates] = useState<any>(() => ({} as any));
	const [company, setCompany] = useState<any[]>(() => []);
	const [companySearch, setCompanySearch] = useState(1);
	const [crudWindow, setCrudWindow] = useState(false);
	const initialize = useCallback(() => {
		setLoading(true);
		api()
			.get<any>('company-news-updates', { params: { search: { CompanyID: companySearch } } })
			.then(({ data }) => {
				setNewsUpdates(data.response);
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
		values.PublicationDate = convertToSqlDateTime(values.PublicationDate, values.PublicationDate);
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
			Object.keys(selectedNewsUpdates).length > 0
				? await api().patch<any>('company-news-updates/' + selectedNewsUpdates.CompanyNewsUpdateID, formData, {
						params: { slug: 'Title' },
				  })
				: await api().post<any>('company-news-updates', formData, {
						params: { slug: 'Title' },
				  });
			setCrudWindow(false);
			initialize();
		} catch {}
	};
	useEffect(() => {
		setSelectedNewsUpdates(NewsUpdatesStore.newsUpdates);
		setCompanySearch(NewsUpdatesStore.newsUpdates.CompanyID ?? 1);
	}, []);

	return (
		<Page title="News And Updates">
			<Grid container rowSpacing={2} columnSpacing={5}>
				<Grid item xs={12} md={6}>
					<div className="font-bold text-2xl mx-2 my-3">{'News And Updates'}</div>
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
							//navigate('newsandupdatescrud');
							NewsUpdatesStore.setNewsUpdates({} as any);
							NewsUpdatesStore.setViewType('add');
							setSelectedNewsUpdates({});
							setCrudWindow(true);
						}}
					>
						<AddBoxIcon />
						Add
					</BaseButton>
				}
				headers={[
					{ label: '', value: 'ImagePath', render: (item) => <img src={item.ImagePath ?? noImage} alt="" className="w-20" /> },
					{ label: 'Title', value: 'Title', render: (item) => <div dangerouslySetInnerHTML={{ __html: item.Title }}></div> },
					{
						label: 'Pre Content',
						value: 'PreContent',
						render: (item) => (
							<Tooltip title={item.PreContent}>
								<div className="truncate w-80">{item.PreContent}</div>
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
				items={newsupdates}
				actionColumnFit
				actionColumn={(item) => (
					<BaseActions>
						{!!item.isActive && (
							<Button
								variant="outlined"
								onClick={() => {
									setOpenDeleteDialog(true);
									setSelectedNewsUpdates(item);
								}}
							>
								Remove
							</Button>
						)}
						<Button
							variant="outlined"
							onClick={() => {
								//navigate('newsandupdatescrud');
								setSelectedNewsUpdates(item);
								NewsUpdatesStore.setNewsUpdates(item);
								NewsUpdatesStore.setViewType('edit');
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
				title="News and Updates"
				onAgree={async () => {
					try {
						try {
							await api().delete<any>('company-news-updates/' + selectedNewsUpdates.CompanyNewsUpdateID);
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
				title={Object.keys(selectedNewsUpdates).length > 0 ? 'Edit News and Updates ' : 'Create News and Updates '}
				open={crudWindow}
				onClose={() => setCrudWindow(false)}
			>
				<HForm
					loading={loading}
					dialog
					enableReinitialize
					initialValues={{
						ImagePath: selectedNewsUpdates?.ImagePath ?? '',
						Title: selectedNewsUpdates?.Title ?? '',
						Content: selectedNewsUpdates?.Content ?? '',
						PreContent: selectedNewsUpdates?.PreContent ?? '',
						PublicationDate:
							convertToSqlDateTime(selectedNewsUpdates?.PublicationDate, selectedNewsUpdates?.PublicationDate) ??
							convertToSqlDateTime(new Date(), new Date()),
						isPublished: !!selectedNewsUpdates?.isPublished ?? false,
						isActive: Object.keys(selectedNewsUpdates).length > 0 ? !!selectedNewsUpdates.isActive : true,
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
										if (fileType !== 'image') {
											return 'Please select a valid image file.';
										} else {
											return undefined;
										}
									}}
								/>
							</div>
						</Grid>
						<Grid item xs={12} lg={12}>
							<FormTextField name="Title" label="Title" />
						</Grid>
						<Grid item xs={12} lg={12}>
							<FormTextField name="PreContent" label="Pre Content" />
						</Grid>
						<Grid item xs={12} className="flex flex-col flex-grow">
							<div className="font-bold text-xl">{'Content'}</div>
						</Grid>
						<Grid item xs={12} lg={12} className="flex flex-col flex-grow mb-20">
							<FormEditor name="Content" />
						</Grid>
						<Grid item xs={12} lg={12} className="flex flex-col flex-grow mb-20">
							<HFormDateTimePicker name="PublicationDate" label="Publication Date" />
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

export default NewsAndUpdates;
