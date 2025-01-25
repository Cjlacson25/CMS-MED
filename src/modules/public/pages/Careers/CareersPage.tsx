import React from 'react';
import { styled } from '@mui/material/styles';
import CareerModel from 'types/career.model';
import useApi from 'hooks/useApi';
import WhyWorkWithUsModel from 'types/why-work-with-us.model';
import HowToApplyModel from 'types/how-to-apply.model';
import CareerOfferModel from 'types/career-offer.model';
import PhysicianProviderModel from 'types/physician-provider.model';
import PageContainer from 'modules/public/components/PageContainer';

interface CareersPageProps {}

const Banner = styled('img')({
	height: '320px',
	width: '100%',
	objectFit: 'cover',
	objectPosition: 'center',
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

const PrimaryTitle = styled('div')(({ theme }) => ({
	fontSize: '19px',
	fontWeight: 'bold',
	color: theme.palette.primary.main,
}));

// const Number = styled('div')(({ theme }) => ({
// 	display: 'flex',
// 	justifyContent: 'center',
// 	alignItems: 'center',
// 	backgroundColor: '#FFEB3B',
// 	padding: '5px',
// 	border: '1px solid black',
// 	fontWeight: 'bold',
// 	borderRadius: '100px',
// 	width: '30px',
// 	height: '30px',
// }));

const Content = styled('div')({
	display: 'flex',
	gap: '30px',
	flexDirection: 'column',

	'@media screen and (min-width: 1100px)': {
		flexDirection: 'row',
	},
});

const ContentImage = styled('div')({
	width: '100%',

	'@media screen and (min-width: 1100px)': {
		width: '500px',
	},
});

const ListContent = styled('div')({
	display: 'flex',
	gap: '30px',
	gridTemplateColumns: '1fr',
	'& ul li': {
		marginBottom: '20px',
	},

	'@media screen and (min-width: 1100px)': {
		gridTemplateColumns: '1fr 1fr',
	},
});

const ListContentImage = styled('div')({
	width: '100%',

	'@media screen and (min-width: 1100px)': {
		width: '500px',
	},
});

const CareersPage: React.FC<CareersPageProps> = () => {
	const { data: career } = useApi<CareerModel>({
		url: '/careers/client',
	});
	console.log(career);
	const { data: howToApply } = useApi<HowToApplyModel[]>({
		url: '/how-to-apply/client',
	});

	const { data: workWithUs } = useApi<WhyWorkWithUsModel>({
		url: '/why-work-with-us/client',
	});

	const { data: careerOffer } = useApi<CareerOfferModel>({
		url: '/career-offers/client',
	});

	const { data: physician } = useApi<PhysicianProviderModel>({
		url: 'physician-providers/client',
	});

	return (
		<div>
			<div className="relative">
				<Banner src={career?.ImagePath} alt="" />
				<BannerTitle>Careers</BannerTitle>
			</div>
			<PageContainer>
				<PrimaryTitle className="mt-10" dangerouslySetInnerHTML={{ __html: howToApply?.[0]?.Title }}></PrimaryTitle>

				<div className="mt-4">
					<div dangerouslySetInnerHTML={{ __html: howToApply?.[0]?.SubContent }} />
				</div>
				{/* <div className="flex flex-col gap-y-1 mt-4">
					{howToApply.map((how, i) => (
						<div className="flex items-start gap-x-2" key={i}>
							<Number>{i + 1}</Number>

							<div className="pt-1.5" dangerouslySetInnerHTML={{ __html: how.SubContent }} />
						</div>
					))}
				</div> */}

				<div className="mt-14 sm:ml-4">
					<PrimaryTitle>Physicians and Providers</PrimaryTitle>

					<Content className="ml-6 mt-3">
						<div className="flex-grow mt-4 max-w-3xl" dangerouslySetInnerHTML={{ __html: physician?.Content }} />

						<ContentImage>
							<img src={physician?.ImagePath} className="w-full flex-shrink-0" alt="" />
						</ContentImage>
					</Content>

					<PrimaryTitle className="mt-4">Why work with us?</PrimaryTitle>
					<Content className="ml-6 mt-3">
						<div className="flex-grow mt-4 max-w-3xl" dangerouslySetInnerHTML={{ __html: workWithUs?.Content }}></div>

						<ContentImage>
							<img src={workWithUs?.ImagePath} className="w-full flex-shrink-0" alt="" />
						</ContentImage>
					</Content>

					<PrimaryTitle className="mt-12">LIST OF CAREERS AVAILABLE</PrimaryTitle>
					<ListContent className="ml-6 mt-3">
						<div className="flex-grow mt-4 max-w-3xl" dangerouslySetInnerHTML={{ __html: careerOffer?.SubContent }}></div>

						<ListContentImage>
							<img src={careerOffer?.ImagePath} className="w-full flex-shrink-0" alt="" />
						</ListContentImage>
					</ListContent>
				</div>
			</PageContainer>
		</div>
	);
};

export default CareersPage;
