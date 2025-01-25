import React from 'react';
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import CompanyStore from 'modules/public/stores/CompanyStore';
import { observer } from 'mobx-react-lite';
import { joinStrings } from 'helpers/utils/string';
import PageContainer from 'modules/public/components/PageContainer';

interface MorePageProps {}

const Banner = styled('img')({
	height: '320px',
	width: '100%',
	objectPosition: 'center',
	objectFit: 'cover',
});

const BannerTitle = styled('h1')(({ theme }) => ({
	position: 'absolute',
	left: '50%',
	top: '50%',
	transform: 'translateX(-50%)',
	fontSize: '40px',
	fontWeight: 'bold',
	textTransform: 'uppercase',
	color: theme.palette.primary.main,
}));

const PrimaryTitle = styled('h2')(({ theme }) => ({
	color: theme.palette.primary.main,
	fontWeight: 'bold',
	fontSize: 25,
}));

const OurStoryContent = styled('div')({
	display: 'grid',
	gridTemplateColumns: '1fr',
	gap: '50px',

	'@media screen and (min-width: 900px)': {
		gridTemplateColumns: '1fr 1fr',
	},
});

const OurLeaderContent = styled('div')({
	display: 'grid',
	gridTemplateColumns: '1fr',
	gap: '50px',

	'@media screen and (min-width: 900px)': {
		gridTemplateColumns: '1fr 1fr',
	},

	'& .title': {
		fontWeight: 'bold',
		fontSize: 15,
	},

	'& .content': {
		marginTop: 10,

		'media screen and (min-width: 650px)': {
			marginLeft: 90,
		},
	},

	'& img': {
		width: '400px',
		boxShadow: '0px 0px 12px rgba(0, 0, 0, 0.3)',
		maxWidth: '100%',

		'media screen and (min-width: 650px)': {
			marginLeft: 80,
		},
	},
});

const VisionContent = styled('div')({
	display: 'grid',
	alignItems: 'center',
	gridTemplateColumns: '1fr',
	gap: '30px',

	'@media screen and (min-width: 900px)': {
		gridTemplateColumns: '30% 1fr',
	},

	'& img': {
		boxShadow: '0px 0px 12px rgba(0, 0, 0, 0.3)',
	},
});

const VisionText = styled('div', {
	shouldForwardProp: (prop) => prop !== 'textAlign',
})<any>(({ theme, ...props }) => ({
	fontSize: 22,
	fontWeight: 'bold',
	color: theme.palette.primary.main,
	textAlign: props.textAlign ?? 'right',
	marginBottom: 10,

	'@media screen and (min-width: 420px)': {
		fontSize: 30,
	},

	'@media screen and (min-width: 650px)': {
		fontSize: 40,
	},
}));

const MorePage: React.FC<MorePageProps> = () => {
	return (
		<div>
			<div className="relative">
				<Banner src={CompanyStore.company.AboutUsImagePath} alt="" />
				<BannerTitle>About Us</BannerTitle>
			</div>

			<PageContainer className="mt-10">
				<PrimaryTitle>Our Story</PrimaryTitle>

				<div className="mt-10"></div>
				<OurStoryContent>
					<div dangerouslySetInnerHTML={{ __html: CompanyStore.company.CompanyStoryContent }}></div>

					<img src={CompanyStore.company.CompanyStoryImagePath} className="w-full" alt="" />
				</OurStoryContent>

				<PrimaryTitle className="mt-20 mb-7">Our Leaders</PrimaryTitle>

				<div className="flex flex-col gap-y-14 ml-3">
					{CompanyStore.company.companyLeaders?.map((leader, index) => (
						<OurLeaderContent key={index}>
							<div>
								<div className="title">{leader.Title}</div>
								<div className="content" dangerouslySetInnerHTML={{ __html: leader.Content }} />
							</div>

							<img src={leader.ImagePath} alt="" />
						</OurLeaderContent>
					))}
				</div>

				<div className="mt-10 flex flex-col gap-y-8">
					<VisionContent>
						<img src={CompanyStore.company.VisionImagePath} className="w-full" alt="" />

						<div>
							<VisionText>VISION</VisionText>
							<div dangerouslySetInnerHTML={{ __html: CompanyStore.company.VisionContent }} />
						</div>
					</VisionContent>

					<VisionContent>
						<div>
							<VisionText textAlign="left">MISSION</VisionText>
							<div dangerouslySetInnerHTML={{ __html: CompanyStore.company.MissionContent }} />
						</div>

						<img src={CompanyStore.company.ImagePath} className="w-full" alt="" />
					</VisionContent>

					<VisionContent>
						<img src={CompanyStore.company.CoreValueImagePath} className="w-full" alt="" />

						<div>
							<VisionText>CORE VALUES</VisionText>
							<div dangerouslySetInnerHTML={{ __html: CompanyStore.company.CoreValueContent }} />
						</div>
					</VisionContent>
				</div>

				<Grid container spacing={3} className="mt-20">
					<Grid item xs={12} lg={6} md={9}>
						<Paper elevation={5} className="p-10" sx={{ backgroundColor: 'secondary.main', color: 'white' }}>
							<Typography
								sx={{
									fontSize: {
										xs: 22,
										sm: 30,
										md: 40,
									},
								}}
								fontWeight="bold"
								textAlign="center"
							>
								CONTACT US
							</Typography>

							<div className="mt-5" />
							<Grid container spacing={2} className="-mt-1" justifyContent="center">
								<Grid
									item
									xs={12}
									md={9}
									className="text-justify"
									dangerouslySetInnerHTML={{ __html: CompanyStore.company.ContactUsSubContent }}
								/>
							</Grid>

							<div className="mt-10 font-bold">Email</div>
							<div className="mt-2">{CompanyStore.company.EmailAddress}</div>

							<div className="mt-6 font-bold">Phone</div>
							<div className="mt-0">{CompanyStore.company.CompanyContactNo}</div>

							<div className="mt-6 font-bold">Address</div>
							<div className="mt-2">
								{joinStrings([
									CompanyStore.company.Address,
									CompanyStore.company.Barangay,
									CompanyStore.company.TownCity,
									CompanyStore.company.Province,
									CompanyStore.company.Region,
								])}
							</div>
						</Paper>
					</Grid>
				</Grid>
			</PageContainer>
		</div>
	);
};

export default observer(MorePage);
