import React from 'react';
import { styled } from '@mui/material/styles';
import logo from 'assets/images/logo.png';
import OutlinedCard from 'components/surfaces/OutlinedCard';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel, { StepLabelProps } from '@mui/material/StepLabel';
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';

interface PatientResourcesPageProps {}

const PrimaryTitle = styled('div')(({ theme }) => ({
	color: '#2F95B4',
	fontWeight: 'bold',
	fontSize: 50,
}));

const TeleMedImage = styled('img')({
	width: 'clamp(400px,100%, 500px)',
	boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.3)',
});

const StepperIconConnector = styled(StepConnector)({
	[`&.${stepConnectorClasses.alternativeLabel}`]: {
		top: 35,
	},

	[`& .${stepConnectorClasses.line}`]: {
		height: 2,
		border: 0,
		backgroundColor: '#707070',
		borderRadius: 1,
	},
});

const StyledStepperIcon = styled('div')({
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
	backgroundColor: '#2C7AB8',
	color: 'white',
	fontSize: 30,
	fontWeight: 'bold',
	width: 70,
	height: 70,
	borderRadius: '100px',
	border: '1px solid black',
	zIndex: 1,
});

const StyledStepLabel = styled(StepLabel)({
	'& .MuiStepLabel-label': {
		width: '220px',
		marginLeft: 'auto',
		marginRight: 'auto',
	},
});

const Banner = styled('img')({
	height: '320px',
	width: '100%',
	objectFit: 'cover',
	objectPosition: 'center',
	marginTop: '15px',
	boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.3)',
});

const MedicalRecordsContent = styled('div')({
	border: '3px solid black',
	borderRadius: '8px',
	backgroundImage: 'linear-gradient(#7CC1F8, white)',
	padding: '20px',
	color: '#085294',
	fontStyle: 'italic',
	fontWeight: 'bold',
	fontSize: 20,
	marginTop: 20,
});

const Hospital = styled('div')({
	width: '180px',
});

const StepperIcon = ({ icon }: StepLabelProps) => {
	return <StyledStepperIcon>{icon}</StyledStepperIcon>;
};

const PatientResourcesPage: React.FC<PatientResourcesPageProps> = () => {
	return (
		<div className="container mx-auto pt-4 pb-10">
			<div className="flex items-center justify-between gap-x-6">
				<PrimaryTitle>TELEMEDICINE</PrimaryTitle>

				<TeleMedImage src={logo} alt="" />
			</div>

			<OutlinedCard className="mt-10" label="How to use our Telemedicine services" fontSize={20}>
				<Stepper activeStep={3} alternativeLabel connector={<StepperIconConnector />}>
					<Step>
						<StyledStepLabel StepIconComponent={StepperIcon}>Insert instruction number 1 here a paragraph form</StyledStepLabel>
					</Step>
					<Step>
						<StyledStepLabel StepIconComponent={StepperIcon}>Insert instruction number 2 here a paragraph form</StyledStepLabel>
					</Step>
					<Step>
						<StyledStepLabel StepIconComponent={StepperIcon}>Insert instruction number 3 here a paragraph form</StyledStepLabel>
					</Step>
				</Stepper>
			</OutlinedCard>

			<div className="mt-28"></div>

			<PrimaryTitle>MEDICAL RECORDS</PrimaryTitle>
			<Banner src={logo} alt="" />

			<MedicalRecordsContent>
				Lorem ipsum dolor sit amet consectetur adipisicing elit. Sunt praesentium provident qui in repellendus, nostrum, veritatis
				nulla quo, numquam quibusdam aut voluptates nisi. Earum nam error deserunt non ab aliquid!
			</MedicalRecordsContent>

			<div className="mt-20 flex flex-wrap justify-center gap-x-10 gap-y-12">
				{[...Array(10)].map((_, i) => (
					<Hospital key={i}>
						<img src={logo} className="w-full" alt="" />

						<div className="mt-2">
							<div className="underline text-lg text-blue-500">CMS</div>
						</div>
					</Hospital>
				))}
			</div>

			<div className="mt-20"></div>

			<PrimaryTitle className="mb-8">PARTNERS</PrimaryTitle>

			<div className="flex flex-col gap-y-12">
				{[...Array(4)].map((_, i) => (
					<OutlinedCard
						label="Content Management System"
						fontSize={18}
						paddingLeft={30}
						paddingRight={30}
						paddingBottom={30}
						key={i}
					>
						<div className="flex flex-wrap justify-between gap-8 items-center">
							{[...Array(4)].map((_, i) => (
								<img src={logo} className="w-64" alt="" key={i} />
							))}
						</div>
					</OutlinedCard>
				))}
			</div>
		</div>
	);
};

export default PatientResourcesPage;
