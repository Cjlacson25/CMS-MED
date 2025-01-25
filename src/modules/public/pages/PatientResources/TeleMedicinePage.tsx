import React from 'react';
import { styled } from '@mui/material/styles';
import { PrimaryTitle } from './PatientResources.styles';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel, { StepLabelProps } from '@mui/material/StepLabel';
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';
import TeleMedicineModel from 'types/tele-medicine.model';
import useApi from 'hooks/useApi';
import PageContainer from 'modules/public/components/PageContainer';
import useMediaQuery from '@mui/material/useMediaQuery';
import Typography from '@mui/material/Typography';

interface TeleMedicinePageProps {}

const TeleMedImage = styled('img')({
	width: '100%',
	boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.3)',

	'@media screen and (min-width: 650px)': {
		width: 'clamp(400px,100%, 500px)',
	},
});

const StepperIconConnector = styled(StepConnector)({
	[`&.${stepConnectorClasses.root}`]: {
		marginLeft: 35,

		'@media screen and (min-width: 650px)': {
			marginLeft: 12,
		},
	},

	[`&.${stepConnectorClasses.alternativeLabel}`]: {
		top: 35,
	},

	[`& .${stepConnectorClasses.line}`]: {
		width: 2,
		border: 0,
		backgroundColor: '#707070',
		borderRadius: 1,

		'@media screen and (min-width: 650px)': {
			height: 2,
			width: 'inherit',
		},
	},
});

const StyledStepperIcon = styled('div')(({ theme }) => ({
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
	backgroundColor: theme.palette.primary.main,
	color: 'white',
	fontSize: 30,
	fontWeight: 'bold',
	width: 70,
	height: 70,
	borderRadius: '100px',
	border: '1px solid black',
	zIndex: 1,
}));

const StyledStepLabel = styled(StepLabel)({
	'& .MuiStepLabel-label': {
		width: '100%',
		marginLeft: 'auto',
		marginRight: 'auto',

		'@media screen and (min-width: 530px)': {
			width: '220px',
		},
	},
});

const StepperIcon = ({ icon }: StepLabelProps) => {
	return <StyledStepperIcon>{icon}</StyledStepperIcon>;
};

const TeleMedicinePage: React.FC<TeleMedicinePageProps> = () => {
	const desktop = useMediaQuery('(min-width:650px)');

	const { data: telemedicine } = useApi<TeleMedicineModel>({
		url: 'tele-medicines/client',
	});

	return (
		<PageContainer className="py-10">
			<div className="flex flex-wrap items-center justify-center lg:justify-between gap-6">
				<PrimaryTitle>TELEMEDICINE</PrimaryTitle>

				<TeleMedImage src={telemedicine.ImagePath} alt="" />
			</div>

			<Typography fontSize={20} fontWeight="bold" className="mt-14 mb-6">
				How to use our Telemedicine services
			</Typography>

			<Stepper alternativeLabel={desktop} connector={<StepperIconConnector />} orientation={desktop ? 'horizontal' : 'vertical'}>
				{telemedicine.teleMedicineLines?.map((line, index) => (
					<Step key={index}>
						<StyledStepLabel StepIconComponent={StepperIcon}>
							<div dangerouslySetInnerHTML={{ __html: line.Content }} />
						</StyledStepLabel>
					</Step>
				))}
			</Stepper>
			{/* <OutlinedCard className="mt-10" label="How to use our Telemedicine services" fontSize={20}>
				
			</OutlinedCard> */}
		</PageContainer>
	);
};

export default TeleMedicinePage;
