import { HForm } from '@hybrain/mui.ui.formik.h-form';
import { HFormCheckbox } from '@hybrain/mui.ui.formik.h-form-checkbox';
import { HFormFileInput } from '@hybrain/mui.ui.formik.h-form-file-input';
import { HSelect } from '@hybrain/mui.ui.inputs.h-select';
import { Grid } from '@mui/material';
import api from 'api/api';
import Page from 'components/layout/Page';
import React, { useCallback, useEffect, useState } from 'react';

interface TelemedicineProps {}

const Telemedicine: React.FC<TelemedicineProps> = () => {
	const [loading, setLoading] = useState(false);
	const [telemed, setTelemed] = useState<any>(() => ({}));
	const [company, setCompany] = useState<any[]>(() => []);
	const [companySearch, setCompanySearch] = useState(1);

	const initialize = useCallback(() => {
		setLoading(true);
		api()
			.get<any>('tele-medicines', { params: { search: { CompanyID: companySearch } } })
			.then(({ data }) => {
				setTelemed(data.response?.[0]);
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
			await api().post<any>('tele-medicines/create-update', formData);
			initialize();
		} catch {}
	};
	return (
		<Page title="Telemedicine">
			<HForm
				dialog
				loading={loading}
				enableReinitialize
				initialValues={{
					ImagePath: telemed?.ImagePath ?? '',
					TeleMedicineID: telemed?.TeleMedicineID,
					isPublished: !!telemed?.isPublished ?? false,
				}}
				onSubmit={handleSubmit}
			>
				<Grid container spacing={1} className="flex flex-col flex-grow mb-6">
					<Grid container rowSpacing={2} columnSpacing={5}>
						<Grid item xs={12} md={6}>
							<div className="font-bold text-2xl mx-2 my-3">{'TeleMedicine'}</div>
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
									if (fileType !== 'image') {
										return 'Please select a valid image file.';
									} else {
										return undefined;
									}
								}}
							/>
						</div>
					</Grid>
					<Grid item xs={12} md={12} spacing={6}>
						<HFormCheckbox name="isPublished" label="Published" />
					</Grid>
				</Grid>
			</HForm>
		</Page>
	);
};

export default Telemedicine;
