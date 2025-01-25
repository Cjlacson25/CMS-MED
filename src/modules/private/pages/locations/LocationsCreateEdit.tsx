import React, { useEffect, useState } from 'react';
import Page from '../../../../components/layout/Page';
import { HForm } from '@hybrain/mui.ui.formik.h-form';
import { HFormFileInput } from '@hybrain/mui.ui.formik.h-form-file-input';
import { HGridFormTextField } from '@hybrain/mui.ui.formik.grid.h-grid-form-text-field';
import { HFormCheckbox } from '@hybrain/mui.ui.formik.h-form-checkbox';
import { Grid } from '@mui/material';
import api from '../../../../api/api';
import AuthSelect from '../../components/AuthSelect';
import { useNavigate } from 'react-router-dom';
import CompanyStore from 'modules/private/stores/CompanyStore';
import { joinStrings } from 'helpers/utils/string';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

interface LocationsCreateEditProps {}

const LocationsCreateEdit: React.FC<LocationsCreateEditProps> = () => {
	const [regions, setRegions] = useState<any[]>([]);
	const [provinces, setProvinces] = useState<any[]>([]);
	const [cities, setCities] = useState<any[]>([]);
	const [barangays, setBarangays] = useState<any[]>([]);
	const [location, setLocation] = useState<any>({});
	const navigate = useNavigate();
	// const params = useParams();
	useEffect(() => {
		setLocation(CompanyStore.company);
	}, []);
	useEffect(() => {
		api()
			.get<any>('regions')
			.then(({ data }) => {
				setRegions(data.response);
			});
	}, []);
	useEffect(() => {
		if (!location.Region) return;
		handleRegionChange(location.Region);
	}, [location.Region]);
	useEffect(() => {
		if (!location.Province) return;
		handleProvinceChange(location.Province);
	}, [location.Province]);
	useEffect(() => {
		if (!location.TownCity) return;
		handleTownCityChange(location.TownCity);
	}, [location.TownCity]);
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
		const formData = new FormData();
		Object.keys(values).forEach((property) => {
			if (!!values[property] || values[property] === 0) {
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
			location.ViewType === 'edit'
				? await api().patch<any>('company/' + location.CompanyID, formData, {
						params: { slug: 'Description' },
				  })
				: await api().post<any>('company', formData, {
						params: { slug: 'Description' },
				  });
			navigate('../locations');
		} catch {}
	};
	return (
		<Page title={location?.ViewType === 'edit' ? 'Edit' : 'Create'}>
			<HForm
				enableReinitialize
				initialValues={{
					ProductLogoPath: location?.ProductLogoPath ?? '',
					SDAImagePath: location?.SDAImagePath ?? '',
					ImagePath: location?.ImagePath ?? '',
					Description: location?.Description ?? '',
					CompanyContactNo: location?.CompanyContactNo ?? '',
					EmailAddress: location?.EmailAddress ?? '',
					Address: location?.Address ?? '',
					isPublished: !!location?.isPublished ?? false,
					Region: location?.Region ?? '',
					Province: location?.Province ?? '',
					TownCity: location?.TownCity ?? '',
					Barangay: location?.Barangay ?? '',
					URLString: location?.URLString ?? '',
					ZipCode: location?.ZipCode ?? '',
				}}
				onSubmit={handleSubmit}
			>
				<Grid container columnSpacing={5} rowSpacing={2}>
					<Grid item xs={12} className="flex flex-row flex-grow">
						<div
							className="font-bold text-lg my-3 hover:text-violet-400 hover:cursor-pointer"
							onClick={() => navigate('../locations')}
						>
							<ArrowBackIcon fontSize="inherit" viewBox="0 10 25 1"></ArrowBackIcon>
							{'Company Basic Information'}
						</div>
						<div className="font-bold text-lg my-3">{location?.ViewType === 'edit' ? '/Edit' : '/Create'}</div>
					</Grid>
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
						<HGridFormTextField size="small" name="URLString" label="URL" xs={12} className="mb-4" />
						<HGridFormTextField size="small" name="ZipCode" label="Zip Code" type="number" xs={12} className="mb-4" />
						<Grid item xs={12}>
							<HFormCheckbox name="isPublished" label="is Published" className="mb-4" />
						</Grid>
					</Grid>
				</Grid>
			</HForm>
		</Page>
	);
};

export default LocationsCreateEdit;
