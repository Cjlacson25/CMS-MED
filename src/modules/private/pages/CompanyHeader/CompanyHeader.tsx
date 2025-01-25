import React, { useCallback, useEffect, useState } from 'react';
import Page from '../../../../components/layout/Page';
import { HTable } from '@hybrain/mui.ui.data-display.h-table';
import { Button, Grid } from '@mui/material';
import BaseActions from '../../../../components/layout/BaseActions';
import { HCheckbox } from '@hybrain/mui.ui.inputs.h-checkbox';
import BaseButton from '../../../../components/inputs/BaseButton';
import AddBoxIcon from '@mui/icons-material/AddBox';
import { HConfirmationDialog } from '@hybrain/mui.ui.dialogs.h-confirmation-dialog';
import api from '../../../../api/api';
import { HSelect } from '@hybrain/mui.ui.inputs.h-select';
import Header from 'modules/private/interfaces/header.model';
import HeaderStore from 'modules/private/stores/HeaderStore';
import { HDialog } from '@hybrain/mui.ui.dialogs.h-dialog';
import FormEditor from '../../../../components/form/FormEditor';
import { HForm } from '@hybrain/mui.ui.formik.h-form';
import { HFormFileInput } from '@hybrain/mui.ui.formik.h-form-file-input';
import { HFormCheckbox } from '@hybrain/mui.ui.formik.h-form-checkbox';
import Tooltip from '@mui/material/Tooltip';

interface CompanyHeaderProps {}

const CompanyHeader: React.FC<CompanyHeaderProps> = () => {
	const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
	const [loading, setLoading] = useState(false);
	const [header, setHeader] = useState<any[]>(() => []);
	const [company, setCompany] = useState<any[]>(() => []);
	const [companySearch, setCompanySearch] = useState(1);
	const [selectedHeader, setSelectedHeader] = useState<Header>(() => ({} as Header));
	const [crudWindow, setCrudWindow] = useState(false);
	const initialize = useCallback(() => {
		setLoading(true);
		api()
			.get<any>('headers', { params: { search: { CompanyID: companySearch } } })
			.then(({ data }) => {
				setHeader(data.response);
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
				} else {
					formData.append(property, values[property]);
				}
			}
		});
		formData.append('CompanyID', companySearch.toString());

		console.log(formData);

		try {
			Object.keys(selectedHeader).length > 0
				? await api().patch<any>('headers/' + selectedHeader.HeaderID, formData)
				: await api().post<any>('headers', formData);
			initialize();
			setCrudWindow(false);
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
	useEffect(() => {
		initialize();
	}, [initialize]);

	return (
		<Page title="Company Header">
			<Grid container rowSpacing={2} columnSpacing={5}>
				<Grid item xs={12} md={6}>
					<div className="font-bold text-2xl mx-2 my-3">{'Company Header'}</div>
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
							setSelectedHeader({} as Header);
							setCrudWindow(true);
							// navigate('companyheadercrud');
							// HeaderStore.setHeader({} as any);
							// HeaderStore.setViewType('add');
						}}
					>
						<AddBoxIcon />
						Add
					</BaseButton>
				}
				headers={[
					{
						label: 'Tagline 1',
						value: 'TagLine1',
						render: (item) => (
							<Tooltip title={item.TagLine1?.replace(/<(?:.|\n)*?>/gm, '')}>
								<div className="truncate w-80">{item.TagLine1?.replace(/<(?:.|\n)*?>/gm, '')}</div>
							</Tooltip>
						),
					},
					{
						label: 'Tagline 2',
						value: 'TagLine2',
						render: (item) => <div className="truncate w-80">{item.TagLine2?.replace(/<(?:.|\n)*?>/gm, '')}</div>,
					},
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
				items={header}
				actionColumnFit
				actionColumn={(item) => (
					<BaseActions>
						{!!item.isActive && (
							<Button
								variant="outlined"
								onClick={() => {
									setOpenDeleteDialog(true);
									setSelectedHeader(item);
								}}
							>
								Remove
							</Button>
						)}
						<Button
							variant="outlined"
							onClick={() => {
								//navigate('companyheadercrud');
								setSelectedHeader(item);
								HeaderStore.setHeader(item);
								HeaderStore.setViewType('edit');
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
				title="Company Header"
				onAgree={async () => {
					try {
						try {
							await api().delete<any>('headers/' + selectedHeader.HeaderID);
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
				title={Object.keys(selectedHeader).length > 0 ? 'Edit Company Header ' : 'Create Company Header '}
				open={crudWindow}
				onClose={() => setCrudWindow(false)}
			>
				<HForm
					enableReinitialize
					loading={loading}
					initialValues={{
						ImagePath: selectedHeader?.ImagePath ?? '',
						TagLine1: selectedHeader?.TagLine1 ?? '',
						TagLine2: selectedHeader?.TagLine2 ?? '',
						isPublished: !!selectedHeader?.isPublished ?? false,
						isActive: Object.keys(selectedHeader).length > 0 ? !!selectedHeader.isActive : true,
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
									imageProps={{ width: '75%', height: '450px' }}
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
						<Grid item xs={12} md={12} className="flex flex-col flex-grow mb-20">
							<Grid item xs={12}>
								<div className="font-bold text-xl">{'Tag Line 1'}</div>
							</Grid>
							<Grid item xs={12} lg={12}>
								<FormEditor name="TagLine1" />
							</Grid>
						</Grid>
						<Grid item xs={12} md={12} className="flex flex-col flex-grow">
							<Grid item xs={12}>
								<div className="font-bold text-xl">{'Tag Line 2'}</div>
							</Grid>
							<Grid item xs={12} lg={12} className=" mb-20">
								<FormEditor name="TagLine2" />
							</Grid>
						</Grid>
						<Grid item xs={3} md={3} lg={3} className="flex flex-col flex-grow">
							<HFormCheckbox name="isActive" label="Active" />
						</Grid>
						<Grid item xs={3} md={3} lg={3} className="flex flex-col flex-grow">
							<HFormCheckbox name="isPublished" label="Published" />
						</Grid>
					</Grid>
				</HForm>
			</HDialog>
		</Page>
	);
};

export default CompanyHeader;
