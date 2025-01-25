import React, { useCallback, useEffect, useState } from 'react';
import Page from '../../../../components/layout/Page';
import { HForm } from '@hybrain/mui.ui.formik.h-form';
import { HGridFormTextField } from '@hybrain/mui.ui.formik.grid.h-grid-form-text-field';
import { Grid } from '@mui/material';
import { HFormCheckbox } from '@hybrain/mui.ui.formik.h-form-checkbox';
import api from 'api/api';
import { HSelect } from '@hybrain/mui.ui.inputs.h-select';

interface ContactUsProps {}

const ContactUs: React.FC<ContactUsProps> = () => {
	const [contactUs, setContactUs] = useState<any>(() => ({}));
	const [loading, setLoading] = useState(false);
	const [company, setCompany] = useState<any[]>(() => []);
	const [companySearch, setCompanySearch] = useState(1);
	const initialize = useCallback(() => {
		setLoading(true);
		api()
			.get<any>('company/', { params: { search: { CompanyID: companySearch } } })
			.then(({ data }) => {
				setContactUs(data.response?.[0]);
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
		try {
			await api().patch<any>('company/' + companySearch.toString(), values);
			initialize();
		} catch {}
	};
	return (
		<Page title="Contact Us">
			<Grid container rowSpacing={2} columnSpacing={5}>
				<Grid item xs={12} md={6}>
					<div className="font-bold text-2xl mx-2 my-3">{'Contact Us'}</div>
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
			<HForm
				loading={loading}
				enableReinitialize
				initialValues={{
					ContactUsSubContent: contactUs?.ContactUsSubContent ?? '',
					isPublished: !!contactUs.isPublished ?? false,
				}}
				onSubmit={handleSubmit}
			>
				<Grid container columnSpacing={5} rowSpacing={2}>
					<Grid item xs={12} className="flex flex-col flex-grow">
						<div className="font-bold text-xl">{'Sub Content'}</div>
					</Grid>
					<Grid item xs={12} lg={12} className="flex flex-col flex-grow mb-10">
						<HGridFormTextField size="medium" name="ContactUsSubContent" multiline rows={13} xs={12} />
					</Grid>
					<Grid item xs={12} md={12} spacing={6}>
						<HFormCheckbox checked name="isPublished" label="Published" />
					</Grid>
				</Grid>
			</HForm>
		</Page>
	);
};

export default ContactUs;
