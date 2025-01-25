import React, { useCallback, useEffect, useState } from 'react';
import Page from '../../../../components/layout/Page';
import { HTable } from '@hybrain/mui.ui.data-display.h-table';
import { Button, Tooltip } from '@mui/material';
import BaseActions from '../../../../components/layout/BaseActions';
import { HCheckbox } from '@hybrain/mui.ui.inputs.h-checkbox';
import BaseButton from '../../../../components/inputs/BaseButton';
import AddBoxIcon from '@mui/icons-material/AddBox';
import { HConfirmationDialog } from '@hybrain/mui.ui.dialogs.h-confirmation-dialog';
import api from '../../../../api/api';
import CompanyStore from 'modules/private/stores/CompanyStore';
import { HDialog } from '@hybrain/mui.ui.dialogs.h-dialog';
import { HForm } from '@hybrain/mui.ui.formik.h-form';
import { HFormFileInput } from '@hybrain/mui.ui.formik.h-form-file-input';
import { HGridFormTextField } from '@hybrain/mui.ui.formik.grid.h-grid-form-text-field';
import { HFormCheckbox } from '@hybrain/mui.ui.formik.h-form-checkbox';
import { Grid } from '@mui/material';
import AuthSelect from '../../components/AuthSelect';
import { joinStrings } from 'helpers/utils/string';
import { HSelect } from '@hybrain/mui.ui.inputs.h-select';

interface LocationsProps {}

const Locations: React.FC<LocationsProps> = () => {
	const [location, setLocation] = useState<any[]>(() => []);
	const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
	const [loading, setLoading] = useState(false);
	const [crudWindow, setCrudWindow] = useState(false);
	const [selectedLocation, setSelectedLocation] = useState<any>(() => ({} as any));
	const [regions, setRegions] = useState<any[]>([]);
	const [provinces, setProvinces] = useState<any[]>([]);
	const [cities, setCities] = useState<any[]>([]);
	const [barangays, setBarangays] = useState<any[]>([]);
	const [, setLocationObj] = useState<any>({});
	const [URLProtocol, setURLProtocol] = useState<any>({ value: 'https://', name: 'URLProtocol' });
	const initialize = useCallback(() => {
		setLoading(true);
		api()
			.get<any>('company')
			.then(({ data }) => {
				setLocation(data.response);
			})
			.finally(() => {
				setLoading(false);
			});
	}, []);
	useEffect(() => {
		initialize();
	}, [initialize]);

	useEffect(() => {
		setLocationObj(selectedLocation);

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	useEffect(() => {
		api()
			.get<any>('regions')
			.then(({ data }) => {
				setRegions(data.response);
			});
	}, [selectedLocation]);
	useEffect(() => {
		if (!selectedLocation.Region) return;
		handleRegionChange(selectedLocation.Region);
	}, [selectedLocation.Region]);
	useEffect(() => {
		if (!selectedLocation.Province) return;
		handleProvinceChange(selectedLocation.Province);
	}, [selectedLocation.Province]);
	useEffect(() => {
		if (!selectedLocation.TownCity) return;
		handleTownCityChange(selectedLocation.TownCity);
	}, [selectedLocation.TownCity]);

	const handleRegionChange = (value: any) => {
		setProvinces([]);
		setCities([]);
		setBarangays([]);
		api()
			.get<any>(`regions/${value}/provinces`)
			.then(({ data }) => {
				setProvinces(data.response);
			});
	};
	const handleProvinceChange = (value: any) => {
		setCities([]);
		setBarangays([]);
		api()
			.get<any>(`provinces/${value}/cities`)
			.then(({ data }) => {
				setCities(data.response);
			});
	};
	const handleTownCityChange = (value: any) => {
		setBarangays([]);
		api()
			.get<any>(`cities/${value}/barangays`)
			.then(({ data }) => {
				setBarangays(data.response);
			});
	};
	const handleSubmit = async (values: any) => {
		values.CompleteAddress = joinStrings(
			[values.Region, values.Provincem, values.TownCity, values.Barangay, values.Address],
			' '
		);

		values.URLString = values.URLString.replace('https://', '').replace('http://', '');
		values.URLString = URLProtocol.value + values.URLString;

		const formData = new FormData();
		Object.keys(values).forEach((property) => {
			if (!!values[property] || values[property] === 0 || values[property] === false) {
				if (property === 'ProductLogoPath') {
					formData.append('ProductLogoPath', values.ProductLogoPath);
				} else if (property === 'SDAImagePath') {
					formData.append('SDAImagePath', values.SDAImagePath);
				} else {
					formData.append(property, values[property]);
				}
			}
		});
		try {
			Object.keys(selectedLocation).length > 0
				? await api().patch<any>('company/' + selectedLocation.CompanyID, formData, {
						params: { slug: 'Description' },
				  })
				: await api().post<any>('company', formData, {
						params: { slug: 'Description' },
				  });
			setCrudWindow(false);
			initialize();
		} catch {}

		values.URLString = values.URLString.replace('https://', '').replace('http://', '');
	};

	return (
		<Page title="Basic Information">
			<div className="font-bold text-2xl mx-2 my-3">{'Basic Information'}</div>
			<HTable
				rowsPerPage={10}
				withSearch
				headerAlign="left"
				loading={loading}
				headerActions={
					<BaseButton
						onClick={() => {
							// navigate('locationscreateedit');
							CompanyStore.setCompany({} as any);
							CompanyStore.setViewType('add');
							setSelectedLocation({});
							setURLProtocol({ value: 'https://', name: 'URLProtocol' });
							setCrudWindow(true);
						}}
					>
						<AddBoxIcon />
						Add
					</BaseButton>
				}
				headers={[
					{ label: 'Company', value: 'Description' },
					{
						label: 'Complete Address',
						value: 'CompleteAddress',
						render: (item) => (
							<Tooltip title={item.CompleteAddress}>
								<div className="truncate w-80">{item.CompleteAddress}</div>
							</Tooltip>
						),
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
				items={location}
				actionColumnFit
				actionColumn={(item) => (
					<BaseActions>
						{!!item.isActive && (
							<Button
								variant="outlined"
								onClick={() => {
									setSelectedLocation(item);
									setOpenDeleteDialog(true);
								}}
							>
								Remove
							</Button>
						)}
						<Button
							variant="outlined"
							onClick={() => {
								//navigate('locationscreateedit');
								if (item.URLString !== null) {
									setURLProtocol({
										value: item.URLString.indexOf('https://') === 0 ? 'https://' : 'http://',
										name: 'URLProtocol',
									});
									item.URLString = item.URLString.replace('https://', '').replace('http://', '');
								} else {
									setURLProtocol({
										value: 'https://',
										name: 'URLProtocol',
									});
								}
								CompanyStore.setCompany(item);
								CompanyStore.setViewType('edit');
								setSelectedLocation(item);
								setCrudWindow(true);
								setLocationObj(selectedLocation);
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
				title="Locations"
				onAgree={async () => {
					try {
						await api().delete<any>('company/' + selectedLocation.CompanyID);
						setOpenDeleteDialog(false);
						initialize();
					} catch {
						setOpenDeleteDialog(true);
					}
				}}
			>
				Are you sure you want to remove this item?
			</HConfirmationDialog>

			<HDialog
				maxWidth="xl"
				title={Object.keys(selectedLocation).length > 0 ? 'Edit Company Basic Information' : 'Create Company Basic Information'}
				open={crudWindow}
				onClose={() => setCrudWindow(false)}
			>
				<HForm
					enableReinitialize
					initialValues={{
						ProductLogoPath: selectedLocation?.ProductLogoPath ?? '',
						SDAImagePath: selectedLocation?.SDAImagePath ?? '',
						ImagePath: selectedLocation?.ImagePath ?? '',
						Description: selectedLocation?.Description ?? '',
						CompanyContactNo: selectedLocation?.CompanyContactNo ?? '',
						EmailAddress: selectedLocation?.EmailAddress ?? '',
						Address: selectedLocation?.Address ?? '',
						isPublished: !!selectedLocation?.isPublished ?? false,
						Region: selectedLocation?.Region ?? '',
						Province: selectedLocation?.Province ?? '',
						TownCity: selectedLocation?.TownCity ?? '',
						Barangay: selectedLocation?.Barangay ?? '',
						URLString: selectedLocation?.URLString ?? '',
						ZipCode: selectedLocation?.ZipCode ?? '',
						isActive: Object.keys(selectedLocation).length > 0 ? !!selectedLocation.isActive : true,
					}}
					onSubmit={handleSubmit}
				>
					<Grid container columnSpacing={5} rowSpacing={2}>
						<Grid item xs={4} className="flex flex-col flex-grow">
							<div className="font-bold flex justify-center text-lg my-3">{'Product Logo'}</div>
							<div>
								<HFormFileInput
									button
									imageProps={{ width: '100%' }}
									name="ProductLogoPath"
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
						<Grid item xs={4} className="flex flex-col flex-grow">
							<div className="font-bold flex justify-center text-lg my-3">{'SDA Logo'}</div>
							<div>
								<HFormFileInput
									button
									imageProps={{ width: '100%' }}
									name="SDAImagePath"
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
						<Grid item xs={4} className="flex flex-col flex-grow">
							<div className="font-bold flex justify-center text-lg my-3">{'Search Banner'}</div>
							<div>
								<HFormFileInput
									button
									imageProps={{ width: '100%' }}
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
						<Grid item xs={12} md={6}>
							<HGridFormTextField className="mb-4" size="small" name="Description" label="name" xs={12} />
							<Grid item xs={12} className="mb-4">
								<AuthSelect
									name="Region"
									label="region"
									// required
									options={regions}
									optionText="Region"
									optionValue="Region"
									onOptionChange={handleRegionChange}
								/>
							</Grid>
							<Grid item xs={12} className="mb-4">
								<AuthSelect
									name="Province"
									label="province"
									// required
									options={provinces}
									optionText="Province"
									optionValue="Province"
									onOptionChange={handleProvinceChange}
								/>
							</Grid>
							<Grid item xs={12} className="mb-4">
								<AuthSelect
									name="TownCity"
									label="city/municipality"
									// required
									options={cities}
									optionText="TownCity"
									optionValue="TownCity"
									onOptionChange={handleTownCityChange}
								/>
							</Grid>
							<Grid item xs={12} className="mb-4">
								<AuthSelect
									name="Barangay"
									label="Barangay"
									// required
									options={barangays}
									optionText="Barangay"
									optionValue="Barangay"
								/>
							</Grid>
							<HGridFormTextField size="small" name="Address" label="Address" xs={12} className="mb-4" />
						</Grid>
						<Grid item xs={12} md={6}>
							<HGridFormTextField size="small" name="CompanyContactNo" label="Telephone No." xs={12} className="mb-4" />
							<HGridFormTextField size="small" name="EmailAddress" type="email" label="Email Address" xs={12} className="mb-4" />
							<Grid container xs={12}>
								<Grid item xs={3}>
									<HSelect
										options={['http://', 'https://']}
										label="Protocol"
										defaultValue={URLProtocol.value}
										style={{ height: '40px' }}
										name="URLProtocol"
										onChange={(e) => setURLProtocol(e.target)}
									/>
								</Grid>
								<HGridFormTextField size="small" name="URLString" label="URL" xs={9} className="mb-4" />
							</Grid>
							<HGridFormTextField size="small" name="ZipCode" label="Zip Code" type="number" xs={12} className="mb-4" />
							<Grid container xs={12}>
								<Grid item xs={4}>
									<HFormCheckbox name="isActive" label="Active" className="mb-4" />
								</Grid>
								<Grid item xs={4}>
									<HFormCheckbox name="isPublished" label="Published" className="mb-4" />
								</Grid>
							</Grid>
						</Grid>
					</Grid>
				</HForm>
			</HDialog>
		</Page>
	);
};

export default Locations;
