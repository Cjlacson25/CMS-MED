import React from 'react';
import { observer } from 'mobx-react-lite';
import CompanyStore from 'modules/public/stores/CompanyStore';
import Banner from './components/Banner';
import CompanySubContent from './components/CompanySubContent';
import NewsAndUpdates from './components/NewsAndUpdates';

const LandingPage = () => {
	return (
		<div className="flex flex-col flex-grow">
			<Banner items={CompanyStore.company?.headers ?? []} />
			<CompanySubContent items={CompanyStore.company?.companySubContents ?? []} />
			<NewsAndUpdates />
		</div>
	);
};

export default observer(LandingPage);
