import React, { useState } from 'react';
import Grid from '@mui/material/Grid';
import OutlinedCard from 'components/surfaces/OutlinedCard';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import useApi from 'hooks/useApi';
import CompanyServiceModel from 'types/company-service.model';
import { useParams } from 'react-router-dom';
import CompanyModel from 'types/company.model';
import PageContainer from 'modules/public/components/PageContainer';
import noImage from 'assets/images/no-image.png';

interface ViewServicesPageProps {}

const ServiceImage = styled('img')({
	width: '100%',
	objectFit: 'contain',
	objectPosition: 'center',
});

const Hospital = styled('div')({
	width: '180px',
	cursor: 'pointer',
});

const StyledOutlinedCard = styled(OutlinedCard)({
	'& h1': {
		fontSize: 19,

		'@media screen and (min-width: 422px)': {
			fontSize: 25,
		},
	},
});

const ShowMoreLink = styled('div')(({ theme }) => ({
	marginTop: 20,
	textAlign: 'right',
	cursor: 'pointer',
	fontWeight: 600,
	color: theme.palette.primary.main,
	fontSize: 16,
}));

const ViewServicesPage: React.FC<ViewServicesPageProps> = () => {
	const { serviceSlug } = useParams();
	const [service, setService] = useState<CompanyServiceModel>({} as CompanyServiceModel);
	const [otherCompanies, setOtherCompanies] = useState<CompanyModel[]>([]);
	const [showMore, setShowMore] = useState(false);

	useApi({
		url: `service-taggings/${serviceSlug}/client`,
		onSuccess(data) {
			setService(data.response);
		},
		dependencies: [serviceSlug],
	});

	useApi({
		url: `service-taggings/${serviceSlug}/other`,
		onSuccess(data) {
			setOtherCompanies(data.response);
		},
		dependencies: [serviceSlug],
	});
	console.log(service);
	return (
		<PageContainer className="py-12">
			<Grid container spacing={2}>
				<Grid item xs={12} md={8}>
					<StyledOutlinedCard label={service.Title}>
						<div className="mt-1.5" dangerouslySetInnerHTML={{ __html: service.ServiceContent }} />
					</StyledOutlinedCard>
				</Grid>
				<Grid item xs={12} md={4}>
					<img src={service.ImagePath ?? noImage} className="w-full object-cover" alt="" />
				</Grid>
			</Grid>

			<div className="-mx-5 sm:mx-0 mt-14">
				<div className="flex flex-wrap gap-10 pb-10">
					{(showMore ? service.serviceLines : service.serviceLines?.slice(0, 3))?.map((line, index) => (
						<div className="w-full lg:w-80" key={index}>
							<ServiceImage src={line.ImagePath} alt="" className="aspect-video" />

							<Typography className="mt-6" fontSize={16}>
								{line.Content}
							</Typography>
						</div>
					))}
				</div>

				<ShowMoreLink onClick={() => setShowMore(!showMore)}>Show {showMore ? 'less' : 'more'}</ShowMoreLink>
			</div>

			<div className="mt-20">
				<div className="text-center">
					<Typography fontSize={18} className="font-bold px-10 py-2 bg-gray-200 border-0 border-t border-solid">
						List of Hospitals and Medical Centers that offers {service.Title}
					</Typography>

					<div className="mt-12 flex flex-wrap justify-center gap-x-10 gap-y-12">
						{otherCompanies.map((company, index) => (
							<Hospital key={index} onClick={() => window.open(company.URLString, '_blank', 'noopener,noreferrer')}>
								<img src={company.ProductLogoPath} className="w-full" alt="" />

								<div className="mt-2">
									<div className="underline text-lg text-blue-500">{company.Description}</div>
								</div>
							</Hospital>
						))}
					</div>
				</div>
			</div>
		</PageContainer>
	);
};

export default ViewServicesPage;
