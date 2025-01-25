import { HForm } from '@hybrain/mui.ui.formik.h-form';
import { HFormFileInput } from '@hybrain/mui.ui.formik.h-form-file-input';
import { HSelect } from '@hybrain/mui.ui.inputs.h-select';
import { Grid } from '@mui/material';
import api from 'api';
import Page from 'components/layout/Page';
import { convertToSqlDateTime } from 'helpers/utils/date';
import React, { useCallback, useEffect, useState } from 'react';
import AuthStore from 'stores/AuthStore';

interface DoctorsFindUsProps {}

const DoctorsFindUs: React.FC<DoctorsFindUsProps> = () => {
	const [loading, setLoading] = useState(false);
	const [doctorImage, setDoctorImage] = useState<any>(() => ({}));
	const [company, setCompany] = useState<any[]>(() => []);
	const [companySearch, setCompanySearch] = useState(1);
	const initialize = useCallback(() => {
		setLoading(true);
		api()
			.get<any>('company', { params: { search: { CompanyID: companySearch } } })
			.then(({ data }) => {
				setDoctorImage(data.response?.[0]);
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
		setLoading(true);
		const formData = new FormData();
		Object.keys(values).forEach((property) => {
			if (!!values[property] || values[property] === 0) {
				if (property === 'DoctorFindUsImagePath') {
					formData.append('DoctorFindUsImagePath', values.DoctorFindUsImagePath);
				} else {
					formData.append(property, values[property]);
				}
			}
		});
		try {
			await api().patch<any>('company/' + companySearch.toString(), formData);
			initialize();
		} catch {}
		setLoading(false);
	};
	return (
		<Page title="Doctor Banner">
			<HForm
				dialog
				loading={loading}
				enableReinitialize
				initialValues={{
					DoctorFindUsImagePath: doctorImage?.DoctorFindUsImagePath ?? '',
					DoctorFindUsUpdatedBy: AuthStore.user.Name + ': ' + AuthStore.user.UserID,
					DoctorFindUsUpdatedDateTime: convertToSqlDateTime(new Date(), new Date()),
				}}
				onSubmit={handleSubmit}
			>
				<Grid container spacing={1} className="flex flex-col flex-grow mb-6">
					<Grid container rowSpacing={2} columnSpacing={5}>
						<Grid item xs={12} md={6}>
							<div className="font-bold text-2xl mx-2 my-3">{'Doctor Banner'}</div>
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
								name="DoctorFindUsImagePath"
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
				</Grid>
			</HForm>
		</Page>
	);
};

export default DoctorsFindUs;
