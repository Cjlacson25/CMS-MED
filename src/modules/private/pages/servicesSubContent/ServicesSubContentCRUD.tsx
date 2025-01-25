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
import ServicesSubContentStore from 'modules/private/stores/ServicesSubContentStore';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

interface ServicesSubContentCRUDProps {}

const ServicesSubContentCRUD: React.FC<ServicesSubContentCRUDProps> = () => {
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);
	const [company, setCompany] = useState<any[]>(() => []);
	const [companySearch, setCompanySearch] = useState(1);
	const [selectedServiceSubContent, setSelectedServiceSubContent] = useState<any>(() => {});
	const handleSubmit = async (values: any) => {
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
			selectedServiceSubContent.ViewType === 'edit'
				? await api().patch<any>('service-sub-contents/' + selectedServiceSubContent.ServiceSubContentID, formData)
				: await api().post<any>('service-sub-contents', formData);
			navigate('../servicessubcontent');
		} catch {}
	};
	useEffect(() => {
		setSelectedServiceSubContent(ServicesSubContentStore.servicesSubContent);
		setCompanySearch(ServicesSubContentStore.servicesSubContent.CompanyID ?? 1);
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
		<Page title={selectedServiceSubContent?.ViewType === 'edit' ? 'Edit' : 'Create'}>
			<HForm
				loading={loading}
				enableReinitialize
				initialValues={{
					ImagePath: selectedServiceSubContent?.ImagePath ?? '',
					Content: selectedServiceSubContent?.Content ?? '',
					isPublished: !!selectedServiceSubContent?.isPublished ?? false,
				}}
				onSubmit={handleSubmit}
			>
				<Grid container columnSpacing={5} rowSpacing={2}>
					<Grid item xs={12} md={6} className="flex flex-row flex-grow">
						<div
							className="font-bold text-lg my-3 hover:text-violet-400 hover:cursor-pointer"
							onClick={() => navigate('../servicessubcontent')}
						>
							<ArrowBackIcon fontSize="inherit" viewBox="0 10 25 2"></ArrowBackIcon>
							{'Service Sub Content'}
						</div>
						<div className="font-bold text-lg my-3">
							{selectedServiceSubContent?.ViewType === 'edit' ? '/Edit' : '/Create'}
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
					<Grid item xs={4} className="flex flex-col flex-grow mt-14">
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
					<Grid item xs={8} className="flex flex-col flex-grow">
						<Grid container columnSpacing={5} rowSpacing={2}>
							<Grid item xs={12} className="flex flex-col flex-grow">
								<div className="font-bold text-lg">{'Content'}</div>
							</Grid>
							<Grid item xs={12} lg={12} className="flex flex-col flex-grow mb-20">
								<FormEditor name="Content" />
							</Grid>
						</Grid>
					</Grid>
					<Grid item xs={12} md={4}>
						<HFormCheckbox name="isPublished" label="is Published" />
					</Grid>
				</Grid>
			</HForm>
		</Page>
	);
};

export default ServicesSubContentCRUD;
