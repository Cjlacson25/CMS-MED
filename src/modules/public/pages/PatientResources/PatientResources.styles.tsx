import { styled } from '@mui/material/styles';

export const PrimaryTitle = styled('div')(({ theme }) => ({
	color: theme.palette.primary.main,
	fontWeight: 'bold',
	fontSize: 30,

	'@media screen and (min-width: 380px)': {
		fontSize: 40,
	},

	'@media screen and (min-width: 560px)': {
		fontSize: 50,
	},
}));
