import React, { Suspense, useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { CssBaseline, Grid } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import HomeIcon from '@mui/icons-material/Home';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CreateIcon from '@mui/icons-material/Create';
import AddLocationIcon from '@mui/icons-material/AddLocation';
import InfoIcon from '@mui/icons-material/Info';
import ModeStandbyIcon from '@mui/icons-material/ModeStandby';
import CottageIcon from '@mui/icons-material/Cottage';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import MedicationIcon from '@mui/icons-material/Medication';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import ListAltIcon from '@mui/icons-material/ListAlt';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import CellTowerIcon from '@mui/icons-material/CellTower';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import PostAddIcon from '@mui/icons-material/PostAdd';
import CleanHandsIcon from '@mui/icons-material/CleanHands';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import HailIcon from '@mui/icons-material/Hail';
import DragHandleIcon from '@mui/icons-material/DragHandle';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import CallIcon from '@mui/icons-material/Call';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import LogoutIcon from '@mui/icons-material/Logout';
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';
import logo from '../../../assets/images/logo.png';
import { HLoadingIndicator } from '@hybrain/mui.ui.feedback.h-loading-indicator';
import AuthStore, { User } from '../../../stores/AuthStore';
import localforage from 'localforage';
import { HDialog } from '@hybrain/mui.ui.dialogs.h-dialog';
import { HForm } from '@hybrain/mui.ui.formik.h-form';
import { HGridFormTextField } from '@hybrain/mui.ui.formik.grid.h-grid-form-text-field';
import api from 'api/api';
import DialogStore from 'stores/DialogStore';
import MenuIcon from '@mui/icons-material/Menu';
import { HSideBar } from '@hybrain/mui.ui.navigation.h-side-bar';

interface PrivateLayoutProps {}

function getWindowDimensions() {
	const { innerWidth: width, innerHeight: height } = window;
	return {
		width,
		height,
	};
}

function useWindowDimensions() {
	const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

	useEffect(() => {
		function handleResize() {
			setWindowDimensions(getWindowDimensions());
		}

		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	return windowDimensions;
}

const PrivateLayout: React.FC<PrivateLayoutProps> = () => {
	const navigate = useNavigate();
	const [openFormDialog, setOpenFormDialog] = useState(false);
	const [openPasswordFormDialog, setOpenPasswordFormDialog] = useState(false);
	const [sideBarState, setSideBarState] = useState(true);
	const [currentScreenWidth, setCurrentScreenWidth] = useState(0);
	const DIALOG_TIMEOUT = 6000;
	const ScreenWidth = () => {
		const { width } = useWindowDimensions();
		if (width !== currentScreenWidth) {
			setCurrentScreenWidth(width);

			if (width < 1000) setSideBarState(false);
			else setSideBarState(true);
		}

		return <div>{width}</div>;
	};
	function handleLogout() {
		localforage.clear();
		AuthStore.setUser({} as User);
		navigate('/login');
	}
	useEffect(() => {
		(async () => {
			const user = await localforage.getItem('user');
			AuthStore.setUser(user as User);

			if (!user) navigate('/login');
		})();
	}, [navigate]);
	function handleOpenProfileDialog() {
		setOpenFormDialog(true);
	}
	function handleOpenPasswordDialog() {
		setOpenPasswordFormDialog(true);
	}
	const handleSubmit = async (values: any) => {
		try {
			if (values.Password !== values.ConfirmPassword) {
				DialogStore.error("Passwords don't match");
				setTimeout(() => {
					DialogStore.close();
				}, DIALOG_TIMEOUT);
				return;
			}
			values.ConfirmPassword = undefined;
			await api().patch<any[]>('users/' + AuthStore.user.UserID, values);
			setOpenFormDialog(false);
			setOpenPasswordFormDialog(false);
		} catch {}
	};

	return (
		<div className="flex min-h-screen">
			<CssBaseline />
			<HSideBar
				mini={true}
				className="m-0"
				drawerWidth="350px"
				open={sideBarState}
				drawerMiniWidth="80px !important"
				onClose={() => {
					setSideBarState(!sideBarState);
				}}
				expandIcon={<MenuIcon />}
				headerContent={
					<Grid container display="flex" justifyContent="center">
						<img src={logo} alt="" style={{ width: '90%' }} />
						<div hidden>
							<ScreenWidth />
						</div>
					</Grid>
				}
				topSidebarItems={[
					{
						text: 'Home',
						path: '/admin',
						icon: <HomeIcon style={{ marginRight: '40px' }} />,
					},
					{
						text: 'Company',
						icon: <DashboardIcon style={{ marginRight: '40px' }} />,
						subItems: [
							{
								text: 'Basic Information',
								path: '/admin/locations',
								icon: <LocationOnIcon />,
							},
							{
								text: 'Company Header',
								path: '/admin/companyheader',
								icon: <CreateIcon />,
							},
							{
								text: 'Sub Content',
								path: '/admin/subcontent',
								icon: <CreateIcon />,
							},
							// {
							// 	text: 'Services Sub Content',
							// 	path: '/admin/servicessubcontent',
							// 	icon: <CreateIcon />,
							// },
							{
								text: 'Find Us',
								path: '/admin/findus',
								icon: <AddLocationIcon />,
							},
							{
								text: 'Pin Point Marker',
								path: '/admin/pin-point-marker',
								icon: <LocationOnIcon />,
							},
							{
								text: 'About Us',
								path: '/admin/aboutus',
								icon: <InfoIcon />,
							},
							{
								text: 'Mission and Vision',
								path: '/admin/missionandvision',
								icon: <ModeStandbyIcon />,
							},
							{
								text: 'Core Values',
								path: '/admin/corevalues',
								icon: <CottageIcon />,
							},
							{
								text: 'Our Leaders',
								path: '/admin/ourleaders',
								icon: <PersonOutlineIcon />,
							},
						],
					},
					{
						text: 'Doctors',
						icon: <MedicationIcon style={{ marginRight: '40px' }} />,
						subItems: [
							{
								text: 'Doctors',
								path: '/admin/doctors',
								icon: <MedicationIcon />,
							},
							{
								text: 'Doctor Banner',
								path: '/admin/doctor-find-us',
								icon: <MedicationIcon />,
							},
						],
					},
					{
						text: 'Patient Resources',
						icon: <DashboardIcon style={{ marginRight: '40px' }} />,
						subItems: [
							// {
							// 	text: 'Telemedicine',
							// 	path: '/admin/telemedicine',
							// 	icon: <VideoCallIcon />,
							// },
							// {
							// 	text: 'Telemedicine Services',
							// 	path: '/admin/tele-medicine-line',
							// 	icon: <VideoCallIcon />,
							// },
							{
								text: 'Executive Checkup', //previously medical records
								path: '/admin/executive-checkup', // '/admin/medicalrecords'
								icon: <ListAltIcon />,
							},
							{
								text: 'Partners',
								path: '/admin/partners',
								icon: <PeopleAltIcon />,
							},
						],
					},
					{
						text: 'Services',
						icon: <CellTowerIcon style={{ marginRight: '40px' }} />,
						subItems: [
							{
								text: 'Services',
								path: '/admin/services',
								icon: <PersonSearchIcon />,
							},
							{
								text: 'Services Lines',
								path: '/admin/service-lines',
								icon: <PersonSearchIcon />,
							},
							// {
							// 	text: 'Services Maintenance',
							// 	path: '/admin/service-maintenance',
							// 	icon: <PersonSearchIcon />,
							// },
							{
								text: 'Services Tagging',
								path: '/admin/service-tagging',
								icon: <PersonSearchIcon />,
							},
						],
					},
					{
						text: 'Careers',
						icon: <DashboardIcon style={{ marginRight: '40px' }} />,
						subItems: [
							{
								text: 'Careers',
								path: '/admin/careers',
								icon: <PersonSearchIcon />,
							},
							{
								text: 'How to Apply',
								path: '/admin/howtoapply',
								icon: <PostAddIcon />,
							},
							{
								text: 'Physicians and Providers',
								path: '/admin/physiciansandproviders',
								icon: <CleanHandsIcon />,
							},
							{
								text: 'Why work with us',
								path: '/admin/whyworkwithus',
								icon: <PersonAddIcon />,
							},
							{
								text: 'List of Careers',
								path: '/admin/listofcareers',
								icon: <HailIcon />,
							},
						],
					},
					{
						text: 'Footer',
						path: '/admin/footer',
						icon: <DragHandleIcon style={{ marginRight: '40px' }} />,
					},
					{
						text: 'News and Updates',
						path: '/admin/newsandupdates',
						icon: <NewspaperIcon style={{ marginRight: '40px' }} />,
					},
					{
						text: 'Contact Us',
						path: '/admin/contactus',
						icon: <CallIcon style={{ marginRight: '40px' }} />,
					},
					{
						text: 'User Management',
						path: '/admin/usermanagement',
						icon: <SupervisedUserCircleIcon style={{ marginRight: '40px' }} />,
					},
				]}
				bottomSidebarItems={[
					{
						text: 'Profile',
						icon: <PersonIcon />,
						onClick: handleOpenProfileDialog,
					},
					{
						text: 'Change Password',
						icon: <LockIcon />,
						onClick: handleOpenPasswordDialog,
					},
					{
						text: 'Logout',
						icon: <LogoutIcon />,
						onClick: handleLogout,
					},
				]}
			/>
			<Suspense
				fallback={
					<div className="flex-grow">
						<HLoadingIndicator />
					</div>
				}
			>
				<Outlet></Outlet>
			</Suspense>
			<HDialog maxWidth="sm" title="Profile" open={openFormDialog} onClose={() => setOpenFormDialog(false)}>
				<HForm
					dialog
					enableReinitialize
					initialValues={{
						Name: AuthStore.user.Name ?? '',
						EmailAddress: AuthStore.user.EmailAddress ?? '',
					}}
					onSubmit={handleSubmit}
				>
					<Grid container columnSpacing={5} rowSpacing={2}>
						<HGridFormTextField size="small" name="Name" label="Name" xs={12} />
						<HGridFormTextField size="small" name="EmailAddress" label="Email Address" xs={12} />
					</Grid>
				</HForm>
			</HDialog>
			<HDialog
				maxWidth="sm"
				title="Change Password"
				open={openPasswordFormDialog}
				onClose={() => setOpenPasswordFormDialog(false)}
			>
				<HForm
					dialog
					enableReinitialize
					initialValues={{
						Password: '',
						ConfirmPassword: '',
					}}
					onSubmit={handleSubmit}
				>
					<Grid container columnSpacing={5} rowSpacing={2}>
						<HGridFormTextField type="password" size="small" name="Password" label="New Password" xs={12} />
						<HGridFormTextField type="password" size="small" name="ConfirmPassword" label="Confirm New Password" xs={12} />
					</Grid>
				</HForm>
			</HDialog>
		</div>
	);
};

export default PrivateLayout;
