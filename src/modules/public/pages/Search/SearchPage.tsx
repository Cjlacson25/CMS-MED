import React from 'react';
import { styled } from '@mui/material/styles';
import CompanyStore from 'modules/public/stores/CompanyStore';
import Typography from '@mui/material/Typography';
import SearchStore from 'modules/public/stores/SearchStore';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';

interface SearchPageProps {}

const Banner = styled('div', { shouldForwardProp: (prop) => prop !== 'backgroundImage' })<{ backgroundImage: string }>(
	(props) => ({
		position: 'relative',
		width: '100%',
		height: '35vh',
		backgroundSize: 'cover',
		backgroundPosition: 'center',
		backgroundImage: `url(${props.backgroundImage})`,
	})
);

const BannerTitle = styled('div')(({ theme }) => ({
	position: 'absolute',
	left: '10%',
	bottom: '32%',
	color: theme.palette.primary.main,
	fontSize: 42,
	fontWeight: 'bold',
}));

const SearchPage: React.FC<SearchPageProps> = () => {
	const navigate = useNavigate();

	return (
		<div>
			<Banner backgroundImage={CompanyStore.company.FindUsImagePath}>
				<BannerTitle>SEARCH</BannerTitle>
			</Banner>

			<div className="container px-5 mt-10 mx-auto">
				<Typography fontWeight={600} fontSize={25}>
					Search results:
				</Typography>

				{SearchStore.items.locations.length > 0 && (
					<div className="mt-8">
						<Typography fontWeight={600} fontSize={32}>
							LOCATIONS
						</Typography>

						<ul className="mt-4">
							{SearchStore.items.locations.map((search, index) => (
								<li key={index}>
									<Typography fontSize={18} variant="caption" className="cursor-pointer">
										<a href={search.URLString} target="_blank" rel="noreferrer" className="no-underline text-black">
											{search.Description}
										</a>
									</Typography>
								</li>
							))}
						</ul>
					</div>
				)}

				{SearchStore.items.pages.length > 0 && (
					<div className="mt-8">
						<Typography fontWeight={600} fontSize={32}>
							PAGES
						</Typography>

						<ul className="mt-4">
							{SearchStore.items.pages.map((search, index) => (
								<li key={index}>
									<Typography
										fontSize={18}
										variant="caption"
										className="cursor-pointer"
										onClick={() => navigate(search.URLRedirect)}
									>
										{search.SearchTitle ?? search.Title}
									</Typography>
								</li>
							))}
						</ul>
					</div>
				)}

				{SearchStore.items.news.length > 0 && (
					<div className="mt-14">
						<Typography fontWeight={600} fontSize={32}>
							NEWS
						</Typography>

						<ul className="mt-4">
							{SearchStore.items.news.map((search, index) => (
								<li key={index}>
									<Typography
										fontSize={18}
										variant="caption"
										className="cursor-pointer"
										onClick={() => navigate(search.URLRedirect)}
									>
										{search.SearchTitle ?? search.Title}
									</Typography>
								</li>
							))}
						</ul>
					</div>
				)}
			</div>
		</div>
	);
};

export default observer(SearchPage);
