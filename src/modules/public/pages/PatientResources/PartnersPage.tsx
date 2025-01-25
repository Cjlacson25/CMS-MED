import React, { useEffect, useState } from 'react';
import OutlinedCard from 'components/surfaces/OutlinedCard';
import { PrimaryTitle } from './PatientResources.styles';
import CompanyModel from 'types/company.model';
import api from 'api/api';
import clsx from 'clsx';
import PageContainer from 'modules/public/components/PageContainer';

interface PartnersPageProps {}

const PartnersPage: React.FC<PartnersPageProps> = () => {
	const [companies, setCompanies] = useState<CompanyModel[]>([]);

	useEffect(() => {
		api()
			.get('/companies/client')
			.then(({ data }) => {
				setCompanies(data.response);
			});
	}, []);

	return (
		<PageContainer className="pt-4 pb-10">
			<PrimaryTitle className="mb-8">PARTNERS</PrimaryTitle>

			<div className="flex flex-col gap-y-12">
				{companies.map((company, i) => (
					<OutlinedCard
						label={company.Description}
						fontSize={18}
						// paddingLeft={30}
						// paddingRight={30}
						// paddingBottom={30}
						key={i}
					>
						<div
							className={clsx('flex flex-wrap gap-10 items-center', {
								'justify-between': company.partners.length >= 4,
							})}
						>
							{company.partners.map((partner, i) => (
								<img src={partner.ImagePath} className="w-full md:w-48" alt="" key={i} />
							))}
						</div>
					</OutlinedCard>
				))}
			</div>
		</PageContainer>
	);
};

export default PartnersPage;
