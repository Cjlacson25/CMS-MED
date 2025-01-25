import React, { useCallback, useEffect, useState } from 'react';
import Page from '../../../../components/layout/Page';
import { HForm } from '@hybrain/mui.ui.formik.h-form';
import { Grid } from '@mui/material';
import FormEditor from '../../../../components/form/FormEditor';
import { HFormFileInput } from '@hybrain/mui.ui.formik.h-form-file-input';
import api from '../../../../api/api';
import AuthStore from '../../../../stores/AuthStore';
import { convertToSqlDateTime } from 'helpers/utils/date';
import { HSelect } from '@hybrain/mui.ui.inputs.h-select';

interface CoreValuesProps {}

const CoreValues: React.FC<CoreValuesProps> = () => {
	const [corevalues, setCoreValue] = useState<any>(() => ({}));
	const [loading, setLoading] = useState(false);
	const [company, setCompany] = useState<any[]>(() => []);
	const [companySearch, setCompanySearch] = useState(1);
	const initialize = useCallback(() => {
		setLoading(true);
		api()
			.get<any>('company/', { params: { search: { CompanyID: companySearch } } })
			.then(({ data }) => {
				setCoreValue(data.response?.[0]);
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
				if (property === 'CoreValueImagePath') {
					formData.append('CoreValueImagePath', values.CoreValueImagePath);
				} else if (property === 'isPublished') {
					formData.append('isPublished', values.isPublished ? '1' : '0');
				} else {
					formData.append(property, values[property]);
				}
			}
		});
		try {
			await api().patch<any>('company/' + companySearch.toString(), formData);
			initialize();
		} catch {}
	};
	return (
		<Page title="Core Values">
			<HForm
				dialog
				enableReinitialize
				loading={loading}
				initialValues={{
					CoreValueContent: corevalues.CoreValueContent ?? '',
					CoreValueImagePath: corevalues.CoreValueImagePath ?? '',
					CoreValueICreatedBy: AuthStore.user.Name + ': ' + AuthStore.user.UserID, // no updatedby column
					CoreValueUpdatedDateTime: convertToSqlDateTime(new Date(), new Date()),
				}}
				onSubmit={handleSubmit}
			>
				<Grid container spacing={1} className="flex flex-col flex-grow">
					<Grid container rowSpacing={2} columnSpacing={5}>
						<Grid item xs={12} md={6}>
							<div className="font-bold text-xl">{'Core Values '}</div>
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
								name="CoreValueImagePath"
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
					<div className="font-bold text-xl">{'Core Values Content'}</div>
					<Grid item xs={12} lg={12} className="flex flex-col flex-grow mb-20">
						<FormEditor name="CoreValueContent" />
					</Grid>
				</Grid>
			</HForm>
		</Page>
	);
};

export default CoreValues;
