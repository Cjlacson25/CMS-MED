import { Grid } from '@mui/material';
import { observer } from 'mobx-react-lite';
import React from 'react';
import Page from '../../../../components/layout/Page';
import AuthStore from '../../../../stores/AuthStore';
import { styled } from '@mui/material/styles';

interface DashboardProps {}

const Title = styled('div')({
	fontSize: '100px',
	fontWeight: 'bold',
	marginBottom: '15px',
});

const SubTitle = styled('div')({
	fontSize: '25px',
	marginBottom: '15px',
});

const Dashboard: React.FC<DashboardProps> = () => {
	return (
		<Page title="Dashboard">
			<Grid container spacing={0} className="bg-gray-100 p-8 flex flex-col flex-grow">
				<Grid item lg={12} md={6} xs={12} className="p-24">
					<Title>Hello, {AuthStore.user?.Name}</Title>
					<SubTitle>Welcome to Content Management System</SubTitle>
				</Grid>
			</Grid>
		</Page>
	);
};

export default observer(Dashboard);
