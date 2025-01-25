import React from 'react';
import Grid from '@mui/material/Grid';
import OutlinedCard from 'components/surfaces/OutlinedCard';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import useApi from 'hooks/useApi';
import CompanyServiceModel from 'types/company-service.model';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import { groupArray } from 'helpers/utils/array';

interface ServicesPageProps {}

const ServiceImage = styled('img')({
	width: '100%',
});

const Hospital = styled('div')({
	width: '180px',
	cursor: 'pointer',
});

const ServicesPage: React.FC<ServicesPageProps> = () => {
	const { data: services } = useApi<CompanyServiceModel[]>({
		url: 'company-services/client',
	});

	return (
		<div className="container p-5 pt-12 mx-auto flex flex-col gap-y-28">
			{services.map((service, serviceIndex) => (
				<div key={serviceIndex}>
					<Grid container spacing={2}>
						<Grid item xs={12} md={10}>
							<OutlinedCard label={service.Title}>{service.ServiceContent}</OutlinedCard>
						</Grid>
					</Grid>

					<div className="mt-14">
						<Splide
							className="px-14"
							options={{
								arrows: groupArray(service.companyServiceLines, 3).length > 1 ? true : false,
							}}
						>
							{groupArray(service.companyServiceLines, 3).map((lines, index) => (
								<SplideSlide key={index}>
									<div className="flex flex-wrap justify-center gap-10 pb-10">
										{lines.map((line, i) => (
											<div className="w-80" key={i}>
												<ServiceImage src={line.ImagePath} alt="" />

												<Typography className="mt-6" fontSize={16}>
													{line.Content}
												</Typography>
											</div>
										))}
									</div>
								</SplideSlide>
							))}
						</Splide>
					</div>

					<div className="mt-20">
						<div className="text-center">
							<Typography
								fontSize={18}
								variant="body2"
								className="font-bold px-10 py-2 bg-gray-200 border-0 border-t border-solid"
							>
								List of Hospitals and Medical Centers that offers {service.Title}
							</Typography>

							<div className="mt-12 flex flex-wrap justify-center gap-x-10 gap-y-12">
								{service.companies.map((company, index) => (
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
				</div>
			))}
		</div>
	);
};

export default ServicesPage;
