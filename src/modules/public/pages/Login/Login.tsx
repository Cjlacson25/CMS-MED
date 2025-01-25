import React, { useEffect } from 'react';
import logo from '../../../../assets/images/logo.png';
import { Card, Grid, InputAdornment } from '@mui/material';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import PersonIcon from '@mui/icons-material/Person';
import api from '../../../../api/api';
import localforage from 'localforage';
import LoginIcon from '@mui/icons-material/Login';
import { useNavigate } from 'react-router-dom';
import AuthStore from '../../../../stores/AuthStore';
import BaseForm from 'components/form/BaseForm';
import FormTextField from 'components/form/FormTextField';
import { styled } from '@mui/material/styles';

interface LoginProps {}

const Navbar = styled('div')({
	position: 'sticky',
	zIndex: 2,
	top: '0px',
	justifyContent: 'space-between',
	alignItems: 'center',
	padding: '5px 15px',
	height: '150px',
	'@media screen and (min-width: 600px)': {
		display: 'flex',
	},
});

const Logo = styled('img')({
	height: '130%',
	marginLeft: '50%',
	transform: 'translate(-50%, 10%)',
});

const Container = styled(Card)({
	borderRadius: '20px',
	width: '90%',
	maxWidth: '500px',
	minHeight: '400px',
});

const Login: React.FC<LoginProps> = () => {
	const navigate = useNavigate();
	useEffect(() => {
		document.title = 'Login';
	}, []);
	return (
		<div className="flex flex-col min-h-screen">
			<Navbar className="text-center w-sticky top-0 z-50 flex flex-grow ">
				<Logo src={logo} alt="" />
			</Navbar>
			<div className="flex flex-col flex-grow items-center justify-center">
				<Container elevation={20} className="h-60 items-center justify-center pb-4">
					<BaseForm
						submitButtonProps={{ startIcon: <LoginIcon /> }}
						submitButtonText="Sign in"
						submitButtonPosition="center"
						initialValues={{
							Username: '',
							Password: '',
						}}
						onSubmit={async (values) => {
							try {
								// console.log(values);
								// return;
								const { data } = await api().post<any>('/login', values);
								AuthStore.setUser(data.user);
								// AuthStore.setaccessToken(data.accessToken);
								await localforage.setItem('user', data.user);
								await localforage.setItem('accessToken', data.accessToken);
								navigate('/admin');
							} catch {}
						}}
					>
						<Grid className="p-8" container rowSpacing={2} columnSpacing={5}>
							<Grid item xs={12} className="text-center text-4xl">
								Login
							</Grid>
							<Grid item xs={12}>
								<FormTextField
									name="Username"
									label="Username"
									InputProps={{
										startAdornment: (
											<InputAdornment position="start">
												<PersonIcon />
											</InputAdornment>
										),
									}}
								></FormTextField>
							</Grid>
							<Grid item xs={12}>
								<FormTextField
									label="Password"
									name="Password"
									type="password"
									InputProps={{
										startAdornment: (
											<InputAdornment position="start">
												<VpnKeyIcon />
											</InputAdornment>
										),
									}}
								></FormTextField>
							</Grid>
						</Grid>
					</BaseForm>
				</Container>
			</div>
		</div>
	);
};

export default Login;
