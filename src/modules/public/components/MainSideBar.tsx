import { styled } from '@mui/material/styles';
import { observer } from 'mobx-react-lite';
import React from 'react';
import CompanyStore from '../stores/CompanyStore';

interface MainSideBarProps {}

const StyledSidebar = styled('div')(({ theme }) => ({
	position: 'fixed',
	top: 0,
	right: 0,
	width: `${(1 / 7) * 100}vw`,
	backgroundColor: theme.palette.primary.main,
	minHeight: '100vh',
	flexShrink: 0,
	zIndex: 900,

	'& img': {
		position: 'absolute',
		bottom: '30px',
		left: '50%',
		transform: 'translateX(-50%)',
		width: '60%',
	},
}));

const MainSideBar: React.FC<MainSideBarProps> = () => {
	return (
		<StyledSidebar>
			<img src={CompanyStore.company?.SDAImagePath} alt="" />
		</StyledSidebar>
	);
};

export default observer(MainSideBar);
