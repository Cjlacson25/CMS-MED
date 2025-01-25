import React, { useCallback, useEffect, useState } from 'react';
import Page from '../../../../components/layout/Page';
import { HForm } from '@hybrain/mui.ui.formik.h-form';
import { Grid } from '@mui/material';
import FormEditor from '../../../../components/form/FormEditor';
import { HFormFileInput } from '@hybrain/mui.ui.formik.h-form-file-input';
import { HFormCheckbox } from '@hybrain/mui.ui.formik.h-form-checkbox';
import api from '../../../../api/api';
import { HSelect } from '@hybrain/mui.ui.inputs.h-select';

interface ListOfCareersProps {}

const ListOfCareers: React.FC<ListOfCareersProps> = () => {
	const [loading, setLoading] = useState(false);
	const [careers, setCareer] = useState<any>({});
	const [company, setCompany] = useState<any[]>(() => []);
	const [companySearch, setCompanySearch] = useState(1);
	const initialize = useCallback(() => {
		setLoading(true);
		api()
			.get<any>('career-offers', { params: { search: { CompanyID: companySearch } } })
			.then(({ data }) => {
				setCareer(data.response?.[0]);
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
		console.log(values);
		const formData = new FormData();
		Object.keys(values).forEach((property) => {
			if (!!values[property] || values[property] === 0) {
				if (property === 'ImagePath') {
					formData.append('ImagePath', values.ImagePath);
				} else if (property === 'isPublished') {
					formData.append('isPublished', values.isPublished ? '1' : '0');
				} else {
					formData.append(property, values[property]);
				}
			}
		});
		formData.append('CompanyID', companySearch.toString());
		try {
			await api().post<any>('career-offers/create-update', formData);
			initialize();
		} catch {}
	};
	return (
		<Page title="List of Careers">
			<HForm
				dialog
				loading={loading}
				enableReinitialize
				initialValues={{
					CareerOfferID: careers?.CareerOfferID ?? undefined,
					SubContent: careers?.SubContent ?? '',
					ImagePath: careers?.ImagePath ?? '',
					isPublished: !!careers?.isPublished ?? false,
				}}
				onSubmit={handleSubmit}
			>
				<Grid container spacing={1} className="flex flex-col flex-grow">
					<Grid container rowSpacing={2} columnSpacing={5}>
						<Grid item xs={12} md={6}>
							<div className="font-bold text-2xl mx-2 my-3">{'List of Careers Available'}</div>
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
					<Grid item xs={12} lg={12} className="flex flex-col flex-grow mb-20">
						<FormEditor name="SubContent" />
					</Grid>
					<Grid item xs={12} md={12} spacing={6}>
						<HFormCheckbox name="isPublished" label="Published" />
					</Grid>
				</Grid>
			</HForm>
		</Page>
	);
};

export default ListOfCareers;
