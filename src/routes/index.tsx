import React, { Suspense } from 'react';
import { BrowserRouter, useRoutes } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { HToast } from '@hybrain/mui.ui.feedback.h-toast';
import { HLoadingIndicator } from '@hybrain/mui.ui.feedback.h-loading-indicator';

import publicRoutes from '../modules/public/routes/public-routes';
import privateRoutes from '../modules/private/routes/private-routes';
import DialogStore from '../stores/DialogStore';

const ResponseDialogComponent = observer(() => (
	<HToast
		open={DialogStore.response.status}
		onClose={() => DialogStore.close()}
		type={DialogStore.response.type}
		message={DialogStore.response.content}
	/>
));

const RoutesList = () => {
	const routes = useRoutes([...publicRoutes, privateRoutes]);

	return routes;
};

const RoutesIndex = () => {
	return (
		<BrowserRouter>
			<Suspense
				fallback={
					<div className="flex flex-col min-h-screen">
						<HLoadingIndicator />
					</div>
				}
			>
				<ResponseDialogComponent />
				<RoutesList />
			</Suspense>
		</BrowserRouter>
	);
};

export default RoutesIndex;
