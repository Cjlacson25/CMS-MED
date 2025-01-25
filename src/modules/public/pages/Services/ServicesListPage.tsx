import useApi from 'hooks/useApi';
import { NavbarLinkPropsChildren } from 'modules/public/components/MainNavbar';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CompanyServiceModel from 'types/company-service.model';
import ResponseModel from 'types/response.model';
import { styled } from '@mui/material/styles';
import noImage from 'assets/images/no-image.png';

interface ServicesListPageProps {}

const BannerTitle = styled('h1')(({ theme }) => ({
	position: 'absolute',
	left: '50%',
	top: '20%',
	marginBottom: '100px',
	transform: 'translateX(-50%)',
	fontSize: '40px',
	fontWeight: 'bold',
	textTransform: 'uppercase',
	color: theme.palette.primary.main,
}));

const ServicesListPage: React.FC<ServicesListPageProps> = () => {
	const navigate = useNavigate();
	const [services, setServices] = useState<NavbarLinkPropsChildren[]>([]);

	useApi({
		url: 'service-taggings/dropdown',
		onSuccess({ response }: ResponseModel<CompanyServiceModel[]>) {
			console.log(response);
			setServices(
				response?.map((service) => ({
					label: service.Title,
					path: `/services/${service.Slug}`,
					imagePath: service.ImagePath,
				}))
			);
		},
	});
	return (
		<div>
			<BannerTitle>Services</BannerTitle>
			<div className="mt-48">
				{services.map((servicemap, index) => (
					<div
						className="flex ml-20 mt-8 cursor-pointer text-lg font-bold items-center "
						key={index}
						onClick={() => navigate(servicemap.path)}
					>
						<img src={servicemap.imagePath ?? noImage} className="w-full md:w-24 mr-6" alt="" />
						<div className="inline-block ">{servicemap.label}</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default ServicesListPage;
