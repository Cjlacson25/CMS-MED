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
import HeaderStore from 'modules/private/stores/HeaderStore';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

interface CompanyHeaderCRUDProps {}

const CompanyHeaderCRUD: React.FC<CompanyHeaderCRUDProps> = () => {
	const [company, setCompany] = useState<any[]>(() => []);
	const [header, setHeader] = useState<any>(() => {});
	const [loading, setLoading] = useState(false);
	const [companySearch, setCompanySearch] = useState(1);
	const navigate = useNavigate();
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
			header.ViewType === 'edit'
				? await api().patch<any>('headers/' + header.HeaderID, formData)
				: await api().post<any>('headers', formData);
			navigate('../companyheader');
		} catch {}
	};
	useEffect(() => {
		setHeader(HeaderStore.header);
		setCompanySearch(HeaderStore.header.CompanyID ?? 1);
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
		<Page title={header?.ViewType === 'edit' ? 'Edit' : 'Create'}>
			<HForm
				enableReinitialize
				loading={loading}
				initialValues={{
					ImagePath: header?.ImagePath ?? '',
					TagLine1: header?.TagLine1 ?? '',
					TagLine2: header?.TagLine2 ?? '',
					isPublished: !!header?.isPublished ?? false,
				}}
				onSubmit={handleSubmit}
			>
				<Grid container columnSpacing={5} rowSpacing={2}>
					<Grid item xs={12} md={6} className="flex flex-row flex-grow">
						<div
							className="font-bold text-lg my-3 hover:text-violet-400 hover:cursor-pointer"
							onClick={() => navigate('../companyheader')}
						>
							<ArrowBackIcon fontSize="inherit" viewBox="0 10 25 2"></ArrowBackIcon>
							{' Company Header'}
						</div>
						<div className="font-bold text-lg my-3">{header?.ViewType === 'edit' ? '/Edit' : '/Create'}</div>
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
								imageProps={{ width: '75%', height: '450px' }}
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
					<Grid item xs={6}>
						<Grid item xs={12}>
							<div className="font-bold text-xl">{'Tag Line 1'}</div>
						</Grid>
						<Grid item xs={12} lg={12}>
							<FormEditor name="TagLine1" />
						</Grid>
					</Grid>
					<Grid item xs={6}>
						<Grid item xs={12}>
							<div className="font-bold text-xl">{'Tag Line 2'}</div>
						</Grid>
						<Grid item xs={12} lg={12} className=" mb-20">
							<FormEditor name="TagLine2" />
						</Grid>
					</Grid>
					<Grid item xs={12} md={12} lg={12} className="flex flex-col flex-grow">
						<HFormCheckbox name="isPublished" label="is Published" />
					</Grid>
				</Grid>
			</HForm>
		</Page>
	);
};

export default CompanyHeaderCRUD;
