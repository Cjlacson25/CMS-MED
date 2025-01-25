import React, { useCallback, useEffect, useState } from 'react';
import Page from '../../../../components/layout/Page';
import { HForm } from '@hybrain/mui.ui.formik.h-form';
import { Grid } from '@mui/material';
import { HFormFileInput } from '@hybrain/mui.ui.formik.h-form-file-input';
import api from '../../../../api/api';
import AuthStore from '../../../../stores/AuthStore';
import { convertToSqlDateTime } from '../../../../helpers/utils/date';
import FormEditor from 'components/form/FormEditor';
import { HSelect } from '@hybrain/mui.ui.inputs.h-select';

interface FindUsProps {}

const FindUs: React.FC<FindUsProps> = () => {
	const [findus, setFindUs] = useState<any>(() => ({}));
	const [loading, setLoading] = useState(false);
	const [company, setCompany] = useState<any[]>(() => []);
	const [companySearch, setCompanySearch] = useState(1);
	const initialize = useCallback(() => {
		setLoading(true);
		api()
			.get<any>('company', { params: { search: { CompanyID: companySearch } } })
			.then(({ data }) => {
				setFindUs(data.response?.[0]);
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
	return (
		<Page title="Find Us">
			<HForm
				dialog
				loading={loading}
				enableReinitialize
				initialValues={{
					FindUsContent: findus.FindUsContent ?? '',
					FindUsImagePath: findus.FindUsImagePath ?? '',
					FindUsUpdatedBy: AuthStore.user.Name + ': ' + AuthStore.user.UserID,
					FindUsUpdatedDateTime: convertToSqlDateTime(new Date(), new Date()),
				}}
				onSubmit={async (values) => {
					setLoading(true);
					const formData = new FormData();
					Object.keys(values).forEach((property) => {
						if (!!values[property] || values[property] === 0) {
							if (property === 'FindUsImagePath') {
								formData.append('FindUsImagePath', values.FindUsImagePath);
							} else if (property === 'isPublished') {
								formData.append('isPublished', values.isPublished ? '1' : '0');
							} else {
								formData.append(property, values[property]);
							}
						}
					});
					formData.append('CompanyID', companySearch.toString());
					try {
						await api().patch<any>('company/' + companySearch.toString(), formData);
						initialize();
					} catch {}
					setLoading(false);
				}}
			>
				<Grid container columnSpacing={5} rowSpacing={2}>
					<Grid item xs={6} md={6}>
						<div className="font-bold text-xl">{'Find Us'}</div>
					</Grid>
					<Grid item xs={6} md={6} className="mb-10">
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
					{/* <Grid item xs={4} className="flex flex-col flex-grow mt-14">
						<HFormFileInput
							button
							imageProps={{ height: 'auto' }}
							buttonProps={{ size: 'large' }}
							name="FindUsImagePath"
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
					</Grid> */}
					<Grid item xs={12} className="flex flex-col flex-grow">
						<Grid container rowSpacing={2} columnSpacing={5}>
							<Grid item xs={12} className="flex flex-col flex-grow">
								<div className="font-bold text-lg">{'Content'}</div>
							</Grid>
							<Grid item xs={12} lg={12} className="flex flex-col flex-grow mb-20">
								<FormEditor name="FindUsContent" />
							</Grid>
						</Grid>
					</Grid>
				</Grid>
			</HForm>
		</Page>
	);
};

export default FindUs;
