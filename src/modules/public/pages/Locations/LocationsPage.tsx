import React, { useMemo, useState } from 'react';
import { observer } from 'mobx-react-lite';
import GoogleMapReact from 'google-map-react';

import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import CompanyStore from 'modules/public/stores/CompanyStore';
import { styled, lighten } from '@mui/material/styles';

import useApi from 'hooks/useApi';
import CompanyModel from 'types/company.model';
import { joinStrings } from 'helpers/utils/string';
import Paper from '@mui/material/Paper';

interface LocationsPageProps {}

interface LocationModel {
	luzon: CompanyModel[];
	visayas: CompanyModel[];
	mindanao: CompanyModel[];
}

const StyledAccordionSummary = styled(AccordionSummary)(({ theme }) => ({
	backgroundColor: theme.palette.primary.main,
	color: 'white',
}));

const StyledAccordionDetails = styled(AccordionDetails)(({ theme }) => ({
	backgroundColor: lighten(theme.palette.primary.main, 0.94),
	padding: '25px',
}));

const MapContainer = styled('div')({
	height: 500,
	width: '100%',
});

interface BaseAccordionProps {
	items: {
		label?: string | JSX.Element;
		companies: CompanyModel[];
	}[];
	setZoom: (payload: number) => void;
	setCenter: (payload: { lat: number; lng: number }) => void;
}

const BaseAccordion = ({ items, setZoom, setCenter }: BaseAccordionProps) => {
	const handleClickLocation = (company: CompanyModel) => {
		setZoom(18);
		setCenter({ lat: +company.Latitude, lng: +company.Longitude });
	};

	return (
		<>
			{items.map((item, index) => (
				<Accordion key={index}>
					<StyledAccordionSummary>
						<Typography fontSize={20}>{item.label}</Typography>
					</StyledAccordionSummary>
					<StyledAccordionDetails>
						<div className="flex flex-col gap-y-4">
							{item.companies?.map((company, index) => (
								<div key={index} className="cursor-pointer" onClick={() => handleClickLocation(company)}>
									<Typography fontSize={18} fontWeight="bold">
										{company.Description}
									</Typography>

									<div className="ml-7">
										{joinStrings([company.Address, company.Barangay, company.TownCity, company.Province, company.Region])}
									</div>
								</div>
							))}
						</div>
					</StyledAccordionDetails>
				</Accordion>
			))}
		</>
	);
};

const LocationsPage: React.FC<LocationsPageProps> = () => {
	const [zoom, setZoom] = useState(6);
	const [center, setCenter] = useState({ lat: 11.476572339784132, lng: 123.40399120280983 });

	const { data: location } = useApi<LocationModel>({
		url: 'locations',
	});

	function renderMarkers(map: any, maps: any) {
		location.luzon?.forEach((location) => {
			new maps.Marker({
				position: {
					lat: +location.Latitude,
					lng: +location.Longitude,
				},
				map,
				title: 'Hello World!',
			});
		});
		location.visayas?.forEach((location) => {
			new maps.Marker({
				position: {
					lat: +location.Latitude,
					lng: +location.Longitude,
				},
				map,
				title: 'Hello World!',
			});
		});
		location.mindanao?.forEach((location) => {
			new maps.Marker({
				position: {
					lat: +location.Latitude,
					lng: +location.Longitude,
				},
				map,
				title: 'Hello World!',
			});
		});
	}

	const areas = useMemo(() => {
		const areasArr = [];

		if (location.luzon?.length > 0) {
			areasArr.push({
				label: 'Luzon',
				companies: location.luzon,
			});
		}

		if (location.visayas?.length > 0) {
			areasArr.push({
				label: 'Visayas',
				companies: location.visayas,
			});
		}

		if (location.mindanao?.length > 0) {
			areasArr.push({
				label: 'Mindanao',
				companies: location.mindanao,
			});
		}

		return areasArr;
	}, [location]);

	return (
		<div className="container mx-auto py-10 px-4">
			<Grid container spacing={3} className="mt-20">
				<Grid item xs={0} lg={3} md={3}>
					<></>
				</Grid>
				<Grid item xs={12} lg={6} md={6}>
					<Paper elevation={5} className="p-10" sx={{ backgroundColor: 'secondary.main', color: 'white' }}>
						<Typography
							sx={{
								fontSize: {
									xs: 22,
									sm: 30,
									md: 40,
								},
							}}
							fontWeight="bold"
							textAlign="center"
						>
							CONTACT US
						</Typography>

						<div className="mt-5" />
						<Grid container spacing={2} className="-mt-1">
							<Grid item xs={12} md={9} dangerouslySetInnerHTML={{ __html: CompanyStore.company.ContactUsSubContent }} />
						</Grid>

						<div className="mt-10 font-bold">Email</div>
						<div className="mt-2">{CompanyStore.company.EmailAddress}</div>

						<div className="mt-6 font-bold">Phone</div>
						<div className="mt-0">{CompanyStore.company.CompanyContactNo}</div>

						<div className="mt-6 font-bold">Address</div>
						<div className="mt-2">
							{joinStrings([
								CompanyStore.company.Address,
								CompanyStore.company.Barangay,
								CompanyStore.company.TownCity,
								CompanyStore.company.Province,
								CompanyStore.company.Region,
							])}
						</div>
					</Paper>
				</Grid>
				<Grid item xs={0} lg={3} md={3}>
					<></>
				</Grid>
			</Grid>
			{/* <Grid container spacing={4}>
				<Grid item xs={12} lg={6}>
					<Typography fontSize={30} fontWeight="bold">
						FIND US
					</Typography>

					<div className="mt-6 mb-10" dangerouslySetInnerHTML={{ __html: CompanyStore.company.FindUsContent }} />
					<BaseAccordion setZoom={setZoom} setCenter={setCenter} items={areas} />
				</Grid>

				<Grid item xs={12} lg={6}>
					<MapContainer>
						<GoogleMapReact
							bootstrapURLKeys={{ key: process.env.REACT_APP_GOOGLE_MAP_API ?? '' }}
							defaultCenter={center}
							center={center}
							defaultZoom={zoom}
							zoom={zoom}
							onGoogleApiLoaded={({ map, maps }) => renderMarkers(map, maps)}
							yesIWantToUseGoogleMapApiInternals
						/>
					</MapContainer>
				</Grid>
			</Grid> */}
		</div>
	);
};

export default observer(LocationsPage);
