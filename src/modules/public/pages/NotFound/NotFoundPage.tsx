import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import React from 'react';

interface NotFoundPageProps {}

const Root = styled('div')(({ theme }) => ({
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
	flexGrow: 1,
	color: theme.palette.primary.main,
}));

const NotFoundPage: React.FC<NotFoundPageProps> = () => {
	return (
		<Root>
			<div className="text-center">
				<Typography variant="h1" fontSize={170} letterSpacing={7} fontWeight="bold">
					404
				</Typography>

				<Typography variant="h2" fontSize={35} letterSpacing={0.1} fontWeight="bold">
					Page not Found
				</Typography>
			</div>
		</Root>
	);
};

export default NotFoundPage;
