import React, { useCallback, useEffect, useState } from 'react';
import Page from '../../../../components/layout/Page';
import { HTable } from '@hybrain/mui.ui.data-display.h-table';
import { Button, Grid } from '@mui/material';
import BaseActions from '../../../../components/layout/BaseActions';
import { HCheckbox } from '@hybrain/mui.ui.inputs.h-checkbox';
import BaseButton from '../../../../components/inputs/BaseButton';
import AddBoxIcon from '@mui/icons-material/AddBox';
import { HConfirmationDialog } from '@hybrain/mui.ui.dialogs.h-confirmation-dialog';
import { HDialog } from '@hybrain/mui.ui.dialogs.h-dialog';
import { HForm } from '@hybrain/mui.ui.formik.h-form';
import { HGridFormTextField } from '@hybrain/mui.ui.formik.grid.h-grid-form-text-field';
import { HFormCheckbox } from '@hybrain/mui.ui.formik.h-form-checkbox';
import api from '../../../../api/api';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import PinterestIcon from '@mui/icons-material/Pinterest';
import RedditIcon from '@mui/icons-material/Reddit';
import TwitterIcon from '@mui/icons-material/Twitter';
import YouTubeIcon from '@mui/icons-material/YouTube';
import { HSelect } from '@hybrain/mui.ui.inputs.h-select';
import FormSelect from 'components/form/FormSelect';

interface FooterProps {}

const Footer: React.FC<FooterProps> = () => {
	const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
	const [openFormDialog, setOpenFormDialog] = useState(false);
	const [footer, setFooter] = useState<any[]>(() => []);
	const [selectedFooter, setSelectedFooter] = useState<any>(() => ({} as any));
	const [loading, setLoading] = useState(false);
	const [company, setCompany] = useState<any[]>(() => []);
	const [companySearch, setCompanySearch] = useState(1);
	const initialize = useCallback(() => {
		setLoading(true);
		api()
			.get<any>('footer', { params: { search: { CompanyID: companySearch } } })
			.then(({ data }) => {
				setFooter(data.response);
			})
			.finally(() => {
				setLoading(false);
			});
	}, [companySearch]);
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
	const handleSubmit = async (values: any) => {
		try {
			Object.keys(selectedFooter).length > 0
				? await api().patch<any>('footer/' + selectedFooter.FooterID, values)
				: await api().post<any>('footer', values);

			setOpenFormDialog(false);
			initialize();
		} catch {}
	};

	return (
		<Page title="Footer">
			<Grid container rowSpacing={2} columnSpacing={5}>
				<Grid item xs={12} md={6}>
					<div className="font-bold text-2xl mx-2 my-3">{'Footer'}</div>
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
							setOpenFormDialog(true);
							setSelectedFooter({} as any);
						}}
					>
						<AddBoxIcon />
						Add
					</BaseButton>
				}
				headers={[
					{ label: 'Name', value: 'Name' },
					{
						label: 'Published',
						value: 'isPublished',
						render: (item) => (
							<div>
								<HCheckbox label="" checked={item.isPublished}></HCheckbox>
							</div>
						),
					},
					{
						label: 'Icon',
						value: 'ImagePath',
						render: (item) => (
							<div>
								{item.ImagePath === 'instagram' ? (
									<InstagramIcon />
								) : item.ImagePath === 'facebook' ? (
									<FacebookIcon />
								) : item.ImagePath === 'linkedin' ? (
									<LinkedInIcon />
								) : item.ImagePath === 'pinterest' ? (
									<PinterestIcon />
								) : item.ImagePath === 'reddit' ? (
									<RedditIcon />
								) : item.ImagePath === 'twitter' ? (
									<TwitterIcon />
								) : item.ImagePath === 'youtube' ? (
									<YouTubeIcon />
								) : (
									''
								)}
							</div>
						),
					},
				]}
				items={footer}
				actionColumnFit
				actionColumn={(item) => (
					<BaseActions>
						{!!item.isActive && (
							<Button
								variant="outlined"
								onClick={() => {
									setOpenDeleteDialog(true);
									setSelectedFooter(item);
								}}
							>
								Remove
							</Button>
						)}
						<Button
							variant="outlined"
							onClick={() => {
								setOpenFormDialog(true);
								setSelectedFooter(item);
							}}
						>
							Edit
						</Button>
					</BaseActions>
				)}
			></HTable>

			<HDialog
				maxWidth="sm"
				title={Object.keys(selectedFooter).length > 0 ? 'Edit Footer' : 'Add Footer'}
				open={openFormDialog}
				onClose={() => {
					setOpenFormDialog(false);
				}}
			>
				<HForm
					dialog
					initialValues={{
						Name: Object.keys(selectedFooter).length > 0 ? selectedFooter.Name : '',
						Abbreviation: Object.keys(selectedFooter).length > 0 ? selectedFooter.Abbreviation : '',
						URL: Object.keys(selectedFooter).length > 0 ? selectedFooter.URL : '',
						ImagePath: Object.keys(selectedFooter).length > 0 ? selectedFooter.ImagePath : '',
						isPublished: Object.keys(selectedFooter).length > 0 ? !!selectedFooter.isPublished : false,
						CompanyID: companySearch.toString(),
						isActive: Object.keys(selectedFooter).length > 0 ? !!selectedFooter.isActive : true,
					}}
					onSubmit={handleSubmit}
				>
					{({ values, setFieldValue }) => (
						<Grid container rowSpacing={2} columnSpacing={5}>
							<Grid item xs={12} md={12}>
								<Grid container rowSpacing={2} columnSpacing={5}>
									<Grid item xs={12} md={6}>
										<HGridFormTextField size="small" name="Name" label="Name" xs={12} />
									</Grid>
									<Grid item xs={12} md={6}>
										<HGridFormTextField size="small" name="Abbreviation" label="Abbreviation" xs={12} />
									</Grid>
								</Grid>
							</Grid>
							<Grid item xs={12} md={12}>
								<Grid item xs={12}>
									<HGridFormTextField size="small" name="URL" label="URL" xs={12} />
								</Grid>
							</Grid>
							<Grid item xs={12} md={12}>
								<Grid item xs={12}>
									<FormSelect
										name="ImagePath"
										label="Icon"
										options={[
											{
												value: 'facebook',
												label: (
													<div>
														{' '}
														<FacebookIcon sx={{ backgroundColor: 'rgb(86,81,255)', color: 'white' }} />
														{' Facebook'}
													</div>
												),
											},
											{
												value: 'instagram',
												label: (
													<div>
														{' '}
														<InstagramIcon sx={{ backgroundColor: 'rgb(86,81,255)', color: 'white' }} />
														{' Instagram'}
													</div>
												),
											},
											{
												value: 'linkedin',
												label: (
													<div>
														{' '}
														<LinkedInIcon sx={{ backgroundColor: 'rgb(86,81,255)', color: 'white' }} />
														{' LinkedIn'}
													</div>
												),
											},
											{
												value: 'pinterest',
												label: (
													<div>
														{' '}
														<PinterestIcon sx={{ backgroundColor: 'rgb(86,81,255)', color: 'white' }} />
														{' Pinterest'}
													</div>
												),
											},
											{
												value: 'reddit',
												label: (
													<div>
														{' '}
														<RedditIcon sx={{ backgroundColor: 'rgb(86,81,255)', color: 'white' }} />
														{' Reddit'}
													</div>
												),
											},
											{
												value: 'twitter',
												label: (
													<div>
														{' '}
														<TwitterIcon sx={{ backgroundColor: 'rgb(86,81,255)', color: 'white' }} />
														{' Twitter'}
													</div>
												),
											},
											{
												value: 'youtube',
												label: (
													<div>
														{' '}
														<YouTubeIcon sx={{ backgroundColor: 'rgb(86,81,255)', color: 'white' }} />
														{' Youtube'}
													</div>
												),
											},
										]}
										className="text-left"
									/>
								</Grid>
							</Grid>
							<Grid item xs={12} md={4}>
								<HFormCheckbox name="isActive" label="Active" />
							</Grid>
							<Grid item xs={12} md={4}>
								<HFormCheckbox name="isPublished" label="Published" />
							</Grid>
						</Grid>
					)}
				</HForm>
			</HDialog>

			<HConfirmationDialog
				open={openDeleteDialog}
				onClose={() => setOpenDeleteDialog(false)}
				title="Footer"
				onAgree={async () => {
					try {
						try {
							await api().delete<any>('footer/' + selectedFooter.FooterID);
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
		</Page>
	);
};

export default Footer;
