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
import LeaderStore from 'modules/private/stores/LeaderStore';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

interface OurLeadersCRUDProps {}

const OurLeadersCRUD: React.FC<OurLeadersCRUDProps> = () => {
	const navigate = useNavigate();
	const [company, setCompany] = useState<any[]>(() => []);
	const [companySearch, setCompanySearch] = useState(1);
	const [loading, setLoading] = useState(false);
	const [selectedLeader, setSelectedLeader] = useState<any>(() => {});
	useEffect(() => {
		setSelectedLeader(LeaderStore.leader);
		setCompanySearch(LeaderStore.leader.CompanyID ?? 1);
	}, []);
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
			selectedLeader.ViewType === 'edit'
				? await api().patch<any>('company-leaders/' + selectedLeader.CompanyLeaderID, formData)
				: await api().post<any>('company-leaders', formData);
			navigate('../ourleaders');
		} catch {}
	};
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
		<Page title={selectedLeader?.ViewType === 'edit' ? 'Edit' : 'Create'}>
			<HForm
				loading={loading}
				enableReinitialize
				initialValues={{
					ImagePath: selectedLeader?.ImagePath ?? '',
					Content: selectedLeader?.Content ?? '',
					isPublished: !!selectedLeader?.isPublished ?? false,
				}}
				onSubmit={handleSubmit}
			>
				<Grid container columnSpacing={5} rowSpacing={2}>
					<Grid item xs={12} md={6} className="flex flex-row flex-grow">
						<div
							className="font-bold text-lg my-3 hover:text-violet-400 hover:cursor-pointer"
							onClick={() => navigate('../ourleaders')}
						>
							<ArrowBackIcon fontSize="inherit" viewBox="0 10 25 1"></ArrowBackIcon>
							{'Our Leaders '}
						</div>
						<div className="font-bold text-lg my-3">{selectedLeader?.ViewType === 'edit' ? '/Edit' : '/Create'}</div>
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
					<Grid item xs={12} className="flex flex-col flex-grow">
						<div className="font-bold text-xl">{"Our Leader's Content"}</div>
					</Grid>
					<Grid item xs={12} lg={12} className="flex flex-col flex-grow mb-20">
						<FormEditor name="Content" />
					</Grid>
					<Grid item xs={12} md={4}>
						<HFormCheckbox name="isPublished" label="is Published" />
					</Grid>
				</Grid>
			</HForm>
		</Page>
	);
};

export default OurLeadersCRUD;
