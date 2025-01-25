import React, { useEffect, useMemo, useState } from 'react';
import { styled } from '@mui/material/styles';
import CompanyNewsUpdateModel from 'types/company-news-update.model';
import api from 'api/api';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import { useNavigate } from 'react-router-dom';
import { groupArray } from 'helpers/utils/array';
import { useMediaQuery } from '@mui/material';

interface NewsAndUpdatesProps {}

const Root = styled('div')({
	padding: '50px 13%',
	// flexGrow: 1,
});

const Title = styled('div')({
	fontSize: '24px',
});

const News = styled('div')({
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
	paddingBottom: 50,
	columnGap: 20,

	// display: 'flex',
	// justifyContent: 'center',
	// flexDirection: 'column',
	// alignItems: 'center',
	// columnGap: '.5rem',
	// rowGap: '10px',
	// textAlign: 'center',
	// width: 400,
	// '@media screen and (min-width: 360px)': {
	// 	flexDirection: 'row',
	// 	textAlign: 'left',
	// },
});

const NewsContent = styled('div')({
	width: 200,
	// flexShrink: 1,
	// width: 230,
	// width: '100%',
	// '@media screen and (min-width: 360px)': {
	// 	width: 230,
	// },
});

const NewsTitle = styled('div')({
	fontSize: 17,
	lineHeight: 1.2,
	marginBottom: 10,
	textTransform: 'uppercase',
});

const NewsBody = styled('div')({
	// width: '100%',
	// '@media screen and (min-width: 510px)': {
	// 	width: '250px',
	// },
});

const NewsImage = styled('img')({
	width: 100,
	height: 100,
	flexShrink: 1,
	objectFit: 'cover',
	objectPosition: 'center',
});

const NewsAndUpdates: React.FC<NewsAndUpdatesProps> = () => {
	const navigate = useNavigate();
	const [news, setNews] = useState<CompanyNewsUpdateModel[]>([]);
	const desktop = useMediaQuery('(min-width:1700px)');
	const ipad = useMediaQuery('(min-width:1368px)');

	useEffect(() => {
		api()
			.get('company-news-updates/landing-page')
			.then(({ data }) => {
				setNews(data.response);
			});
	}, []);

	const newsGroup = useMemo(() => {
		if (desktop) {
			return groupArray(news, 3);
		}

		if (ipad) {
			return groupArray(news, 2);
		}

		return groupArray(news, 1);
	}, [news, desktop, ipad]);

	return (
		<Root>
			<Title className="mb-8">NEWS & UPDATES</Title>

			<div className="-mx-14">
				<Splide className="mx-14" options={{ arrows: newsGroup.length > 1, type: 'fade' }}>
					{newsGroup.map((group, index) => (
						<SplideSlide key={index}>
							<div className={`flex flex-wrap gap-8 pb-10 justify-center`}>
								{group.map((news, index) => (
									<News key={index}>
										<NewsImage src={news.ImagePath} />
										<NewsContent>
											<NewsTitle dangerouslySetInnerHTML={{ __html: news.Title }}></NewsTitle>
											<NewsBody dangerouslySetInnerHTML={{ __html: news.PreContent }}></NewsBody>

											<div
												className="text-blue-500 cursor-pointer text-right mt-1"
												onClick={() => navigate(`/news-and-updates/${news.Slug}`)}
											>
												Read more
											</div>
										</NewsContent>
									</News>
								))}
							</div>
						</SplideSlide>
					))}
				</Splide>
			</div>

			{newsGroup.length > 1 && (
				<div className="text-blue-500 mt-5 text-right">
					<span className="cursor-pointer" onClick={() => navigate('/news-and-updates')}>
						View more news and updates
					</span>
				</div>
			)}
		</Root>
	);
};

export default NewsAndUpdates;
