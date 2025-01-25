import React, { useCallback, useEffect, useState } from 'react';
import Page from '../../../../components/layout/Page';
import { HForm } from '@hybrain/mui.ui.formik.h-form';
import { Grid } from '@mui/material';
import FormEditor from '../../../../components/form/FormEditor';
import { HFormFileInput } from '@hybrain/mui.ui.formik.h-form-file-input';
import { HFormCheckbox } from '@hybrain/mui.ui.formik.h-form-checkbox';
import api from '../../../../api/api';
import { HSelect } from '@hybrain/mui.ui.inputs.h-select';
import { Console } from 'console';

interface MedicalRecordsProps {}

const MedicalRecords: React.FC<MedicalRecordsProps> = () => {
	const [medicalRecordsItem, setMedicalRecordsItem] = useState<any>(() => ({}));
	const [loading, setLoading] = useState(false);
	const [company, setCompany] = useState<any[]>(() => []);
	const [companySearch, setCompanySearch] = useState(1);
	const initialize = useCallback(() => {
		setLoading(true);
		api()
			.get<any>('medical-records', { params: { search: { CompanyID: companySearch } } })
			.then(({ data }) => {
				setMedicalRecordsItem(data.response?.[0]);
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
			await api().post<any>('medical-records/create-update', formData);
			initialize();
		} catch {}
	};

	return (
		<Page title="Executive Checkup">
			<HForm
				dialog
				loading={loading}
				enableReinitialize
				initialValues={{
					Content: medicalRecordsItem?.Content ?? '',
					ImagePath: medicalRecordsItem?.ImagePath ?? '',
					isPublished: !!medicalRecordsItem?.isPublished ?? false,
					MedicalRecordID: medicalRecordsItem?.MedicalRecordID,
				}}
				onSubmit={handleSubmit}
			>
				<Grid container spacing={1} className="flex flex-col flex-grow">
					<Grid container rowSpacing={2} columnSpacing={5}>
						<Grid item xs={12} md={6}>
							<div className="font-bold text-2xl mx-2 my-3">{'Executive Checkup'}</div>
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
					<div className="font-bold text-xl">{'Content'}</div>
					<Grid item xs={12} lg={12} className="flex flex-col flex-grow mb-20">
						<FormEditor name="Content" />
					</Grid>
					<Grid item xs={12} md={4}>
						<HFormCheckbox name="isPublished" label="Published" />
					</Grid>
				</Grid>
			</HForm>
		</Page>
	);
};

export default MedicalRecords;
