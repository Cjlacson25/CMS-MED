import React, { useCallback, useEffect, useState } from 'react';
import Page from '../../../../components/layout/Page';
import { HForm } from '@hybrain/mui.ui.formik.h-form';
import { Grid } from '@mui/material';
import FormEditor from '../../../../components/form/FormEditor';
import api from '../../../../api/api';
import { HSelect } from '@hybrain/mui.ui.inputs.h-select';

interface HowToApplyProps {}

const HowToApply: React.FC<HowToApplyProps> = () => {
	const [loading, setLoading] = useState(false);
	const [howtoapply, setHowToApply] = useState<any>(() => ({}));
	const [company, setCompany] = useState<any[]>(() => []);
	const [companySearch, setCompanySearch] = useState(1);
	const initialize = useCallback(() => {
		setLoading(true);
		api()
			.get<any>('how-to-apply/', { params: { search: { CompanyID: companySearch } } })
			.then(({ data }) => {
				setHowToApply(data.response?.[0]);
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
			await api().post<any>('how-to-apply/create-update', values);
			initialize();
		} catch {}
	};

	return (
		<Page title="How to Apply">
			<HForm
				dialog
				loading={loading}
				enableReinitialize
				initialValues={{
					Title: howtoapply?.Title ?? '',
					SubContent: howtoapply?.SubContent ?? '',
					HowToApplyID: howtoapply?.HowToApplyID,
					CompanyID: companySearch,
					isActive: 1,
					isPublished: 1,
				}}
				onSubmit={handleSubmit}
			>
				<Grid container spacing={1} className="flex flex-col flex-grow">
					<Grid container rowSpacing={2} columnSpacing={5}>
						<Grid item xs={12} md={6}>
							<div className="font-bold text-2xl mx-2 my-3">{'How to Apply'}</div>
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
					<Grid item xs={12} lg={12} className="font-bold text-lg mx-2 my-3">
						<div>{'Title'}</div>
					</Grid>
					<Grid item xs={12} lg={12} className="flex flex-col flex-grow mb-28 max-h-5 ">
						<FormEditor name="Title" />
					</Grid>
					<Grid item xs={12} lg={12} className="font-bold text-lg mx-2 my-3">
						<div>{'SubContent'}</div>
					</Grid>
					<Grid item xs={12} lg={12} className="flex flex-col flex-grow mb-20">
						<FormEditor name="SubContent" />
					</Grid>
				</Grid>
			</HForm>
		</Page>
	);
};

export default HowToApply;
