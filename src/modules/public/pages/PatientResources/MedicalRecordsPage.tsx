import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import { PrimaryTitle } from './PatientResources.styles';
import MedicalRecordModel from 'types/medical-record.model';
import api from 'api/api';
import CompanyModel from 'types/company.model';
import PageContainer from 'modules/public/components/PageContainer';

interface MedicalRecordsPageProps {}

const Banner = styled('img')({
	height: '320px',
	width: '100%',
	objectFit: 'cover',
	objectPosition: 'center',
	marginTop: '15px',
	boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.3)',
});

const MedicalRecordsContent = styled('div')({
	// border: '3px solid black',
	borderRadius: '8px',
	// backgroundImage: 'linear-gradient(#7CC1F8, white)',
	padding: '20px',
	// color: '#085294',
	// fontStyle: 'italic',
	// fontWeight: 'bold',
	fontSize: 20,
	marginTop: 20,
});

const Hospital = styled('div')({
	width: '180px',
});

const MedicalRecordsPage: React.FC<MedicalRecordsPageProps> = () => {
	const [record, setRecord] = useState<MedicalRecordModel>({} as MedicalRecordModel);
	const [companies, setCompanies] = useState<CompanyModel[]>([]);

	useEffect(() => {
		api()
			.get('medical-records/client')
			.then(({ data }) => {
				setRecord(data.response);
			});

		api()
			.get('companies/client')
			.then(({ data }) => {
				setCompanies(data.response);
			});
	}, []);

	return (
		<PageContainer className="pt-4 pb-10">
			<PrimaryTitle>EXECUTIVE CHECKUP</PrimaryTitle>
			<Banner src={record.ImagePath} alt="" />

			<MedicalRecordsContent dangerouslySetInnerHTML={{ __html: record.Content }} />

			<div className="mt-20 flex flex-wrap justify-center gap-x-10 gap-y-12">
				{companies.map((company, i) => (
					<Hospital key={i}>
						<img src={company.ImagePath} className="w-full" alt="" />

						<div className="mt-2">
							<div className="underline text-lg text-blue-500" dangerouslySetInnerHTML={{ __html: company.Description }}></div>
						</div>
					</Hospital>
				))}
			</div>
		</PageContainer>
	);
};

export default MedicalRecordsPage;
