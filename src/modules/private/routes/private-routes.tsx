import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

const PrivateLayout = lazy(() => import('../layout/PrivateLayout'));
const Dashboard = lazy(() => import('../pages/dashboard/Dashboard'));
const Locations = lazy(() => import('../pages/locations/Locations'));
const LocationsCreateEdit = lazy(() => import('../pages/locations/LocationsCreateEdit'));
const CompanyHeader = lazy(() => import('../pages/CompanyHeader/CompanyHeader'));
const CompanyHeaderCRUD = lazy(() => import('../pages/CompanyHeader/CompanyHeaderCRUD'));
const SubContent = lazy(() => import('../pages/SubContent/SubContent'));
const ServicesSubContent = lazy(() => import('../pages/servicesSubContent/ServicesSubContent'));
const ServicesSubContentCRUD = lazy(() => import('../pages/servicesSubContent/ServicesSubContentCRUD'));
const FindUs = lazy(() => import('../pages/findUs/FindUs'));
const PinPointMarker = lazy(() => import('../pages/findUs/PinPointMarker'));
const AboutUs = lazy(() => import('../pages/aboutUs/AboutUs'));
const MissionandVision = lazy(() => import('../pages/missionAndVision/MissionandVision'));
const CoreValues = lazy(() => import('../pages/coreValues/CoreValues'));
const OurLeaders = lazy(() => import('../pages/ourLeaders/OurLeaders'));
const OurLeadersCRUD = lazy(() => import('../pages/ourLeaders/OurLeadersCRUD'));
const Doctors = lazy(() => import('../pages/doctors/Doctors'));
const DoctorsFindUs = lazy(() => import('../pages/doctors/DoctorsFindUs'));
const Telemedicine = lazy(() => import('../pages/teleMedicine/Telemedicine'));
const TeleMedicineLine = lazy(() => import('../pages/teleMedicine/TeleMedicineLine'));
const MedicalRecords = lazy(() => import('../pages/medicalRecords/MedicalRecords'));
const Partners = lazy(() => import('../pages/partners/Partners'));
const PartnersCRUD = lazy(() => import('../pages/partners/PartnersCRUD'));
const Careers = lazy(() => import('../pages/careers/Careers'));
const HowToApply = lazy(() => import('../pages/howToApply/HowToApply'));
const PhysiciansandProviders = lazy(() => import('../pages/physiciansAndProviders/PhysiciansandProviders'));
const WhyWorkWithUs = lazy(() => import('../pages/whyWorkWithUs/WhyWorkWithUs'));
const ListOfCareers = lazy(() => import('../pages/listOfCareers/ListOfCareers'));
const Footer = lazy(() => import('../pages/footer/Footer'));
const NewsAndUpdates = lazy(() => import('../pages/newsAndUpdates/NewsAndUpdates'));
const NewsAndUpdatesCRUD = lazy(() => import('../pages/newsAndUpdates/NewsAndUpdatesCRUD'));
const ContactUs = lazy(() => import('../pages/contactUs/ContactUs'));
const UserManagement = lazy(() => import('../pages/userManagement/UserManagement'));
const Services = lazy(() => import('../pages/Services/Services'));
const ServiceLines = lazy(() => import('../pages/Services/ServiceLines'));
// const ServiceMaintenance = lazy(() => import('../pages/Services/ServiceMaintenance'));
const ServiceTagging = lazy(() => import('../pages/Services/ServiceTagging'));
// const Login = lazy(() => import('../pages/Login'));

const route: RouteObject = {
	path: '/admin',
	element: <PrivateLayout />,
	children: [
		{ path: '', element: <Dashboard /> },
		{ path: 'locations', element: <Locations /> },
		{ path: 'locations/locationscreateedit', element: <LocationsCreateEdit /> },
		{ path: 'companyheader', element: <CompanyHeader /> },
		{ path: 'companyheader/companyheadercrud', element: <CompanyHeaderCRUD /> },
		{ path: 'subcontent', element: <SubContent /> },
		{ path: 'findus', element: <FindUs /> },
		{ path: 'pin-point-marker', element: <PinPointMarker /> },
		{ path: 'aboutus', element: <AboutUs /> },
		{ path: 'missionandvision', element: <MissionandVision /> },
		{ path: 'corevalues', element: <CoreValues /> },
		{ path: 'ourleaders', element: <OurLeaders /> },
		{ path: 'ourleaders/ourleaderscrud', element: <OurLeadersCRUD /> },
		{ path: 'doctors', element: <Doctors /> },
		{ path: 'doctor-find-us', element: <DoctorsFindUs /> },
		{ path: 'telemedicine', element: <Telemedicine /> },
		{ path: 'tele-medicine-line', element: <TeleMedicineLine /> },
		{ path: 'executive-checkup', element: <MedicalRecords /> },
		{ path: 'partners', element: <Partners /> },
		{ path: 'partners/partnerscrud', element: <PartnersCRUD /> },
		{ path: 'careers', element: <Careers /> },
		{ path: 'howtoapply', element: <HowToApply /> },
		{ path: 'physiciansandproviders', element: <PhysiciansandProviders /> },
		{ path: 'whyworkwithus', element: <WhyWorkWithUs /> },
		{ path: 'listofcareers', element: <ListOfCareers /> },
		{ path: 'footer', element: <Footer /> },
		{ path: 'newsandupdates', element: <NewsAndUpdates /> },
		{ path: 'newsandupdates/newsandupdatescrud', element: <NewsAndUpdatesCRUD /> },
		{ path: 'contactus', element: <ContactUs /> },
		{ path: 'usermanagement', element: <UserManagement /> },
		{ path: 'servicessubcontent', element: <ServicesSubContent /> },
		{ path: 'servicessubcontent/servicessubcontentcrud', element: <ServicesSubContentCRUD /> },
		{ path: 'services', element: <Services /> },
		{ path: 'service-lines', element: <ServiceLines /> },
		// { path: 'service-maintenance', element: <ServiceMaintenance /> },
		{ path: 'service-tagging', element: <ServiceTagging /> },
	],
	//children: [],
};

export default route;
