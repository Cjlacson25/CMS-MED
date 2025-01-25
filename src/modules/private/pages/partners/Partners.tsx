import React, { useCallback, useEffect, useState } from 'react';
import Page from '../../../../components/layout/Page';
import { HTable } from '@hybrain/mui.ui.data-display.h-table';
import { Button, Grid } from '@mui/material';
import BaseActions from '../../../../components/layout/BaseActions';
import { HCheckbox } from '@hybrain/mui.ui.inputs.h-checkbox';
import BaseButton from '../../../../components/inputs/BaseButton';
import AddBoxIcon from '@mui/icons-material/AddBox';
import noImage from '../../../../assets/images/no-image.png';
import { HConfirmationDialog } from '@hybrain/mui.ui.dialogs.h-confirmation-dialog';
import api from '../../../../api/api';
import { HSelect } from '@hybrain/mui.ui.inputs.h-select';
import PartnerStore from 'modules/private/stores/PartnerStore';
import { HDialog } from '@hybrain/mui.ui.dialogs.h-dialog';
import FormEditor from '../../../../components/form/FormEditor';
import { HForm } from '@hybrain/mui.ui.formik.h-form';
import { HFormFileInput } from '@hybrain/mui.ui.formik.h-form-file-input';
import { HFormCheckbox } from '@hybrain/mui.ui.formik.h-form-checkbox';

interface PartnersProps {}

const Partners: React.FC<PartnersProps> = () => {
	const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
	const [loading, setLoading] = useState(false);
	const [partners, setPartners] = useState<any[]>(() => []);
	const [selectedPartner, setSelectedPartner] = useState<any>({});
	const [company, setCompany] = useState<any[]>(() => []);
	const [companySearch, setCompanySearch] = useState(1);
	const [crudWindow, setCrudWindow] = useState(false);

	const initialize = useCallback(() => {
		setLoading(true);
		api()
			.get<any>('partners', { params: { search: { CompanyID: companySearch } } })
			.then(({ data }) => {
				setPartners(data.response);
			})
			.finally(() => {
				setLoading(false);
			});
	}, [companySearch]);

	const handleSubmit = async (values: any) => {
		const formData = new FormData();
		Object.keys(values).forEach((property) => {
			if (!!values[property] || values[property] === 0 || values[property] === false) {
				if (property === 'ImagePath') {
					formData.append('ImagePath', values.ImagePath);
				} else if (property === 'isPublished') {
					formData.append('isPublished', !!values.isPublished ? '1' : '0');
				} else {
					formData.append(property, values[property]);
				}
			}
		});
		formData.append('CompanyID', companySearch.toString());
		try {
			Object.keys(selectedPartner).length > 0
				? await api().patch<any>('partners/' + selectedPartner.PartnerID, formData)
				: await api().post<any>('partners', formData);
			//navigate('../partners');
			setCrudWindow(false);
			initialize();
		} catch {}
	};

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
		<Page title="Partners">
			<Grid container rowSpacing={2} columnSpacing={5}>
				<Grid item xs={12} md={6}>
					<div className="font-bold text-2xl mx-2 my-3">{'Partners'}</div>
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

			<HTable
				rowsPerPage={10}
				withSearch
				headerAlign="left"
				loading={loading}
				headerActions={
					<BaseButton
						onClick={() => {
							//navigate('partnerscrud');
							PartnerStore.setPartner({} as any);
							PartnerStore.setViewType('add');
							setSelectedPartner({});
							setCrudWindow(true);
						}}
					>
						<AddBoxIcon />
						Add
					</BaseButton>
				}
				headers={[
					{ label: '', value: 'ImagePath', render: (item) => <img src={item.ImagePath ?? noImage} alt="" className="w-20" /> },
					{ label: 'Name', value: 'Content', render: (item) => <div dangerouslySetInnerHTML={{ __html: item.Content }}></div> },
					{
						label: 'Published',
						value: 'isPublished',
						render: (item) => (
							<div>
								<HCheckbox label="" checked={item.isPublished}></HCheckbox>
							</div>
						),
					},
				]}
				items={partners}
				actionColumnFit
				actionColumn={(item) => (
					<BaseActions>
						{!!item.isActive && (
							<Button
								variant="outlined"
								onClick={() => {
									setOpenDeleteDialog(true);
									setSelectedPartner(item);
								}}
							>
								Remove
							</Button>
						)}
						<Button
							variant="outlined"
							onClick={() => {
								//navigate('partnerscrud');
								PartnerStore.setPartner(item);
								PartnerStore.setViewType('edit');
								setSelectedPartner(item);
								setCrudWindow(true);
							}}
						>
							Edit
						</Button>
					</BaseActions>
				)}
			></HTable>

			<HConfirmationDialog
				open={openDeleteDialog}
				onClose={() => setOpenDeleteDialog(false)}
				title="Partners"
				onAgree={async () => {
					try {
						try {
							await api().delete<any>('partners/' + selectedPartner.PartnerID);
							setOpenDeleteDialog(false);
							initialize();
						} catch {}
					} catch {
						setOpenDeleteDialog(true);
					}
				}}
			>
				Are you sure you want to remove this item?
			</HConfirmationDialog>

			<HDialog
				maxWidth="md"
				title={Object.keys(selectedPartner).length > 0 ? 'Partner / Edit ' : 'Partner / Create '}
				open={crudWindow}
				onClose={() => setCrudWindow(false)}
			>
				<HForm
					loading={loading}
					enableReinitialize
					initialValues={{
						Content: selectedPartner?.Content ?? '',
						ImagePath: selectedPartner?.ImagePath ?? '',
						isPublished: !!selectedPartner?.isPublished ?? false,
						isActive: Object.keys(selectedPartner).length > 0 ? !!selectedPartner.isActive : true,
					}}
					onSubmit={handleSubmit}
				>
					<Grid container columnSpacing={5} rowSpacing={2}>
						<Grid item xs={12} md={12} className="mb-10">
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
							<div className="font-bold text-xl">{"Partner's Content"}</div>
						</Grid>
						<Grid item xs={12} lg={12} className="flex flex-col flex-grow mb-20">
							<FormEditor name="Content" />
						</Grid>
						<Grid item xs={12} md={4}>
							<HFormCheckbox name="isActive" label="Active" />
						</Grid>
						<Grid item xs={12} md={4}>
							<HFormCheckbox name="isPublished" label="Published" />
						</Grid>
					</Grid>
				</HForm>
			</HDialog>
		</Page>
	);
};

export default Partners;
