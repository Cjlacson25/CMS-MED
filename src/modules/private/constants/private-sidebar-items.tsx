import { SideBarItem } from '@hybrain/mui.ui.navigation.h-side-bar';
import DashboardIcon from '@mui/icons-material/Dashboard';

const sidebarItems: SideBarItem[] = [
	{
		text: 'Dashboard',
		path: '/admin/dashboard',
		icon: <DashboardIcon />,
	},
	{
		text: 'Locations',
		path: '/admin/locations',
		icon: <DashboardIcon />,
	},
	{
		text: 'Company Header',
		path: '/admin/companyheader',
		icon: <DashboardIcon />,
	},
];

export default sidebarItems;
