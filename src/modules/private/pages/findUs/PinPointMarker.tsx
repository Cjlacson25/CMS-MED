import Page from 'components/layout/Page';
import React, { useCallback, useEffect, useState } from 'react';
import GoogleMapReact from 'google-map-react';
import { Grid } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { HSelect } from '@hybrain/mui.ui.inputs.h-select';
import api from 'api';
import { HGridFormTextField } from '@hybrain/mui.ui.formik.grid.h-grid-form-text-field';
import { HForm } from '@hybrain/mui.ui.formik.h-form';

interface PinPointMarkerProps {}

const PinPointMarker: React.FC<PinPointMarkerProps> = () => {
	const [company, setCompany] = useState<any[]>(() => []);
	const [pinPoint, setPinPoint] = useState<any>(() => ({}));
	const [loading, setLoading] = useState(false);
	const [companySearch, setCompanySearch] = useState(1);
	const [lat, setLat] = useState(14.555820051025178);
	const [lng, setLng] = useState(120.9954988511322);
	const [defaultProps, setDefaultProps] = useState<any>({
		center: {
			lat: 14.555820051025178,
			lng: 120.9954988511322,
		},
		zoom: 18,
	});
	const initialize = useCallback(() => {
		setLoading(true);
		api()
			.get<any>('company', { params: { search: { CompanyID: companySearch } } })
			.then(({ data }) => {
				setPinPoint(data.response?.[0]);
				setLat(data.response?.[0].Latitude ? data.response?.[0].Latitude * 1 : 14.555820051025178);
				setLng(data.response?.[0].Longitude ? data.response?.[0].Longitude * 1 : 120.9954988511322);
				setDefaultProps({
					center: { lat: lat ? lat : 14.555820051025178, lng: lng ? lng : 120.9954988511322 },
					zoom: 18,
				});
			})
			.finally(() => {
				setLoading(false);
			});

		// eslint-disable-next-line react-hooks/exhaustive-deps
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
	const PinLocation = ({ text }: any) => (
		<div className="text-sm">
			{text}
			<LocationOnIcon style={{ color: 'red' }} />
		</div>
	);
	const handleMap = (values: any) => {
		setLat(values.lat * 1);
		setLng(values.lng * 1);
		setPinPoint({ Latitude: values.lat * 1, Longitude: values.lng * 1 });
	};

	return (
		<Page title="Pin Point Marker">
			<HForm
				dialog
				loading={loading}
				enableReinitialize
				initialValues={{
					Latitude: pinPoint.Latitude ?? 14.555820051025178,
					Longitude: pinPoint.Longitude ?? 120.9954988511322,
					CompanyID: companySearch.toString(),
				}}
				onSubmit={async (values) => {
					setLoading(true);
					try {
						await api().patch<any>('company/' + companySearch.toString(), values);
						initialize();
					} catch {}
					setLoading(false);
				}}
			>
				<Grid container rowSpacing={5} columnSpacing={2}>
					<Grid item xs={6}>
						<div className="font-bold text-xl">{'Pin Point Marker'}</div>
					</Grid>
					<Grid item xs={6}>
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
					<Grid item xs={12} className="w-full " sx={{ height: '70vh' }}>
						<GoogleMapReact
							bootstrapURLKeys={{ key: 'AIzaSyAi4dJ1jgWNGTVbmK15KazlxJ5bl_Mkcz0' }}
							center={{ lat, lng }}
							defaultZoom={defaultProps.zoom}
							onClick={handleMap}
						>
							<PinLocation lat={lat} lng={lng} text={pinPoint.Description} />
						</GoogleMapReact>
					</Grid>
					<HGridFormTextField readOnly size="small" name="Latitude" label="latitude" type="number" xs={6} />
					<HGridFormTextField readOnly size="small" name="Longitude" label="longitude" type="number" xs={6} />
				</Grid>
			</HForm>
		</Page>
	);
};

export default PinPointMarker;
