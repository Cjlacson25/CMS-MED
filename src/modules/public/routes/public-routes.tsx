import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

const PublicLayout = lazy(() => import('../layout/PublicLayout'));

const LandingPage = lazy(() => import('../pages/LandingPage/LandingPage'));
const Login = lazy(() => import('../pages/Login/Login'));
const ServicesPage = lazy(() => import('../pages/Services/ServicesPage'));
const ServicesListPage = lazy(() => import('../pages/Services/ServicesListPage'));
const LocationsPage = lazy(() => import('../pages/Locations/LocationsPage'));
const PatientResourcesPage = lazy(() => import('../pages/PatientResources/PatientResourcesPage'));
const DoctorsPage = lazy(() => import('../pages/Doctors/DoctorsPage'));
const CareersPage = lazy(() => import('../pages/Careers/CareersPage'));
const MorePage = lazy(() => import('../pages/More/MorePage'));
const NewsAndUpdatesPage = lazy(() => import('../pages/NewsAndUpdates/NewsAndUpdatesPage'));
const ViewNewsAndUpdatesPage = lazy(() => import('../pages/NewsAndUpdates/ViewNewsAndUpdatesPage'));
const TeleMedicinePage = lazy(() => import('../pages/PatientResources/TeleMedicinePage'));
const MedicalRecordsPage = lazy(() => import('../pages/PatientResources/MedicalRecordsPage'));
const PartnersPage = lazy(() => import('../pages/PatientResources/PartnersPage'));
const ViewServicesPage = lazy(() => import('../pages/Services/ViewServicesPage'));
const FindDoctorPage = lazy(() => import('../pages/FindDoctor/FindDoctorPage'));
const NotFoundPage = lazy(() => import('../pages/NotFound/NotFoundPage'));
const SearchPage = lazy(() => import('../pages/Search/SearchPage'));

const route: RouteObject[] = [
	{
		path: '/',
		element: <PublicLayout />,
		children: [
			{ index: true, element: <LandingPage /> },
			{ path: 'locations', element: <LocationsPage /> },
			{ path: 'find-doctor', element: <FindDoctorPage /> },
			{ path: 'doctors', element: <DoctorsPage /> },
			{ path: 'services/:serviceSlug', element: <ViewServicesPage /> },
			{ path: 'services', element: <ServicesPage /> },
			{ path: 'services-list', element: <ServicesListPage /> },
			{ path: 'patient-resources', element: <PatientResourcesPage /> },
			{ path: 'careers', element: <CareersPage /> },
			{ path: 'more', element: <MorePage /> },
			{ path: 'news-and-updates', element: <NewsAndUpdatesPage /> },
			{ path: 'news-and-updates/:slug', element: <ViewNewsAndUpdatesPage /> },
			{ path: 'telemedicine', element: <TeleMedicinePage /> },
			{ path: 'executive-checkup', element: <MedicalRecordsPage /> },
			{ path: 'partners', element: <PartnersPage /> },
			{ path: 'search', element: <SearchPage /> },
			{ path: '*', element: <NotFoundPage /> },
		],
	},
	{
		path: '/login',
		element: <Login />,
		children: [],
	},
];

export default route;
