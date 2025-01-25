import React, { useEffect, useState } from 'react';
import Page from '../../../../components/layout/Page';
import { HForm } from '@hybrain/mui.ui.formik.h-form';
import { HFormFileInput } from '@hybrain/mui.ui.formik.h-form-file-input';
import { Grid } from '@mui/material';
import FormEditor from '../../../../components/form/FormEditor';
import { HFormCheckbox } from '@hybrain/mui.ui.formik.h-form-checkbox';
import { useNavigate } from 'react-router-dom';
import api from 'api/api';
import { HSelect } from '@hybrain/mui.ui.inputs.h-select';
import NewsUpdatesStore from 'modules/private/stores/NewsUpdatesStore';
import FormTextField from 'components/form/FormTextField';
import { HFormDateTimePicker } from '@hybrain/mui.ui.formik.h-form-date-time-picker';
import { convertToSqlDateTime } from 'helpers/utils/date';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

interface NewsAndUpdateCRUDProps {}

const NewsAndUpdateCRUD: React.FC<NewsAndUpdateCRUDProps> = () => {
	const navigate = useNavigate();
	const [company, setCompany] = useState<any[]>(() => []);
	const [loading, setLoading] = useState(false);
	const [companySearch, setCompanySearch] = useState(1);
	const [selectedNewsUpdates, setSelectedNewsUpdates] = useState<any>(() => {});
	const handleSubmit = async (values: any) => {
		values.PublicationDate = convertToSqlDateTime(values.PublicationDate, values.PublicationDate);
		const formData = new FormData();
		Object.keys(values).forEach((property) => {
			if (!!values[property] || values[property] === 0) {
				if (property === 'ImagePath') {
					formData.append('ImagePath', values.ImagePath);
				} else {
					formData.append(property, values[property]);
				}
			}
		});
		formData.append('CompanyID', companySearch.toString());
		try {
			selectedNewsUpdates.ViewType === 'edit'
				? await api().patch<any>('company-news-updates/' + selectedNewsUpdates.CompanyNewsUpdateID, formData, {
						params: { slug: 'Title' },
				  })
				: await api().post<any>('company-news-updates', formData, {
						params: { slug: 'Title' },
				  });
			navigate('../newsandupdates');
		} catch {}
	};
	useEffect(() => {
		setSelectedNewsUpdates(NewsUpdatesStore.newsUpdates);
		setCompanySearch(NewsUpdatesStore.newsUpdates.CompanyID ?? 1);
	}, []);
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
	return (
		<Page title={selectedNewsUpdates?.ViewType === 'edit' ? 'Edit' : 'Create'}>
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
				}}
				onSubmit={handleSubmit}
			>
				<Grid container columnSpacing={5} rowSpacing={2}>
					<Grid item xs={12} md={6} className="flex flex-row flex-grow">
						<div
							className="font-bold text-lg my-3 hover:text-violet-400 hover:cursor-pointer"
							onClick={() => navigate('../newsandupdates')}
						>
							<ArrowBackIcon fontSize="inherit" viewBox="0 10 25 1"></ArrowBackIcon>
							{'New and Update'}
						</div>
						<div className="font-bold text-lg my-3">
							{selectedNewsUpdates?.ViewType === 'edit' ? '/Edit' : '/Create'}
						</div>
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
					<Grid item xs={12} md={4}>
						<HFormCheckbox name="isPublished" label="Published" />
					</Grid>
				</Grid>
			</HForm>
		</Page>
	);
};

export default NewsAndUpdateCRUD;
