import React, { Suspense, useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';

import MainNavbar, { NavbarLinkPropsChildren } from '../components/MainNavbar';
import MainFooter from '../components/MainFooter';
import LayoutStore from '../../../stores/LayoutStore';
import { observer } from 'mobx-react-lite';
import api from 'api/api';
import ResponseModel from 'types/response.model';
import CompanyModel from 'types/company.model';
import CompanyStore from '../stores/CompanyStore';
import CompanyServiceModel from 'types/company-service.model';
import useApi from 'hooks/useApi';

const Body = styled('div', {
	shouldForwardProp: (prop: string) => !['height', 'paddingTop'].includes(prop),
})<{ paddingTop: number }>((props) => ({
	paddingTop: props.paddingTop,
	// paddingRight: `${(1 / 7) * 100}vw`,
	paddingBottom: '100px',
}));

const BodyComponent = observer(() => {
	return (
		<Body paddingTop={LayoutStore.navbarHeight} className="flex flex-col flex-grow">
			<Outlet />
		</Body>
	);
});

const PublicLayout = () => {
	const navigate = useNavigate();
	const [locations, setLocations] = useState<NavbarLinkPropsChildren[]>([]);
	const [services, setServices] = useState<NavbarLinkPropsChildren[]>([]);

	useApi({
		url: 'service-taggings/dropdown',
		onSuccess({ response }: ResponseModel<CompanyServiceModel[]>) {
			setServices(
				response?.map((service) => ({
					label: service.Title,
					path: `/services/${service.Slug}`,
				}))
			);
		},
	});

	useEffect(() => {
		api()
			.get<ResponseModel<CompanyModel[]>>('/company/locations')
			.then(({ data }) => {
				setLocations(
					data.response.map((location) => ({
						label: location.Description,
						path: location.URLString,
						// path: `/client?company=${location.CompanyID}`,
					}))
				);
			});

		api()
			.get<ResponseModel<CompanyModel>>('/company/client')
			.then(({ data }) => {
				CompanyStore.update(data.response);
			});
	}, []);

	return (
		<div className="flex">
			<div className="min-h-screen flex flex-col flex-grow">
				<MainNavbar
					buttons={[
						{ label: 'BRANCHES', children: locations, href: true },
						{ label: 'DOCTORS', onClick: () => navigate('/doctors') },
						// { label: 'SERVICES', onClick: () => navigate('/services-list') }, //children: services },
						{ label: 'SERVICES', children: services },
						{
							label: 'PATIENT RESOURCES',
							children: [
								// { label: 'Telemedicine', path: '/telemedicine' },
								{ label: 'Executive Checkup', path: '/executive-checkup' },
								{ label: 'Partners', path: '/partners' },
							],
						},
						{ label: 'CAREERS', onClick: () => navigate('/careers') },
						{ label: 'ABOUT US', onClick: () => navigate('/more') },
					]}
				/>

				<Suspense fallback={<></>}>
					<BodyComponent />
				</Suspense>

				<MainFooter />
			</div>

			{/* <MainSideBar /> */}
		</div>
	);
};

export default PublicLayout;
