import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import api from 'api/api';
import { dateTimeFormat } from 'helpers/utils/date';
import { joinStrings } from 'helpers/utils/string';
import { observer } from 'mobx-react-lite';
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CompanyNewsUpdateModel from 'types/company-news-update.model';
import CompanyModel from 'types/company.model';
interface ViewNewsAndUpdatesPageProps {}
type NewsAndUpdateModel = CompanyNewsUpdateModel &
	CompanyModel & {
		moreNews: CompanyNewsUpdateModel[];
	};

function getWindowDimensions() {
	const { innerWidth: width, innerHeight: height } = window;
	return {
		width,
		height,
	};
}

function useWindowDimensions() {
	const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

	useEffect(() => {
		function handleResize() {
			setWindowDimensions(getWindowDimensions());
		}

		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	return windowDimensions;
}

const ViewNewsAndUpdatesPage: React.FC<ViewNewsAndUpdatesPageProps> = () => {
	const { slug } = useParams();
	const navigate = useNavigate();
	const [, setLoading] = useState(true);
	const [newsAndUpdate, setNewsAndUpdate] = useState<NewsAndUpdateModel>({} as NewsAndUpdateModel);
	const targetRef = useRef<HTMLDivElement>(null);
	const [contentDimensions, setContentDimensions] = useState({ width: 0, height: 0 });

	const [currentScreenWidth, setCurrentScreenWidth] = useState(0);
	const ScreenWidth = () => {
		const { width } = useWindowDimensions();
		if (width !== currentScreenWidth) {
			setCurrentScreenWidth(width);
		}

		return <div>{width}</div>;
	};

	const initialize = useCallback(() => {
		setLoading(true);
		api()
			.get(`company-news-updates/${slug}/client`)
			.then(({ data }) => {
				setNewsAndUpdate(data.response);
			})
			.finally(() => {
				setLoading(false);
			});
	}, [slug]);
	const getContentHolderHeight = useCallback(() => {
		const heightdiv = targetRef.current?.clientHeight;
		// heightdiv = document?.querySelector('#contentHolder')?.clientHeight;
		if (heightdiv === contentDimensions.height) {
			setContentDimensions({ width: 0, height: heightdiv !== undefined ? heightdiv : 0 });
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [newsAndUpdate]);
	useEffect(() => {
		initialize();
		// getContentHolderHeight();
	}, [initialize]);
	// useEffect(() => {
	//  setLoading(true)
	//  api()
	//      .get(`company-news-updates/${slug}/client`)
	//      .then(({ data }) => {
	//          setNewsAndUpdate(data.response);
	//      });
	// }, [slug]);
	// useEffect(() => {
	//  contentHeight = targetRef.current ? targetRef.current.offsetHeight : 0;
	//  setContentDimensions({ width: 0, height: contentHeight });
	//  console.log(contentHeight);
	// }, [targetRef]);
	// console.log(contentHeight ?? 0);
	return (
		<div className="container flex flex-grow flex-col mx-auto py-10 px-5" style={{ minHeight: '100%', position: 'relative' }}>
			<div className="text-center">
				<div className="text-neutral-500">
					{joinStrings([
						newsAndUpdate.Address,
						newsAndUpdate.Barangay,
						newsAndUpdate.TownCity,
						newsAndUpdate.Province,
						newsAndUpdate.Region,
					])}
				</div>
				<Typography fontSize={32}>{newsAndUpdate.Title}</Typography>
				<div className="text-neutral-500">
					{dateTimeFormat(newsAndUpdate.CreatedDateTime)} | {newsAndUpdate.CreatedBy}
				</div>
			</div>

			{/* <div style={{ display: 'none' }}>
				<ScreenWidth />
			</div>
			<div id="contentHolder" className="mt-10 mb-10" ref={targetRef}>
				<div dangerouslySetInnerHTML={{ __html: newsAndUpdate.Content }} />
			</div>
			<div
				style={{
					flex: 1,
					justifyContent: 'flex-end',
					position: contentDimensions.height > 300 || currentScreenWidth < 900 ? 'relative' : 'absolute',
					bottom: 0,
					width: '100%',
				}}
			>
				<div className="text-lg mt-10 mb-3">More News and Updates</div>
				<Grid container spacing={2}>
					{newsAndUpdate.moreNews?.map((news, index) => (
						<Grid item xs={12} lg={4}>
							<Paper
								elevation={2}
								className="p-3 cursor-pointer"
								key={index}
								sx={{
									transition: '.3s',
									':hover': { boxShadow: 5 },
								}}
								onClick={() => navigate('/news-and-updates/' + news.Slug)}
							>
								<div className="flex gap-x-4">
									<img className="w-40 h-40 object-cover object-center" src={news.ImagePath} alt="" />
									<div>
										<div className="text-neutral-500">
											{dateTimeFormat(news.CreatedDateTime)} | {news.CreatedBy}
										</div>
										<div className="text-lg font-bold mt-1">{news.Title}</div>
										<div className="mt-1.5" dangerouslySetInnerHTML={{ __html: news.PreContent }} />
									</div>
								</div>
							</Paper>
						</Grid>
					))}
				</Grid>
			</div> */}
			<div className="flex flex-col flex-grow justify-between">
				<div className="mt-10 mb-10">
					<div dangerouslySetInnerHTML={{ __html: newsAndUpdate.Content }} />
				</div>
				<div>
					<div className="text-lg mt-10 mb-3">More News and Updates</div>
					<Grid container spacing={2}>
						{newsAndUpdate.moreNews?.map((news, index) => (
							<Grid item xs={12} lg={4} md={6} key={index}>
								<Paper
									elevation={2}
									className="p-3 cursor-pointer"
									sx={{
										transition: '.3s',
										':hover': { boxShadow: 5 },
									}}
									onClick={() => navigate('/news-and-updates/' + news.Slug)}
								>
									<div className="flex gap-x-4">
										<img className="w-40 h-40 object-cover object-center" src={news.ImagePath} alt="" />
										<div>
											<div className="text-neutral-500">
												{dateTimeFormat(news.CreatedDateTime)} | {news.CreatedBy}
											</div>
											<div className="text-lg font-bold mt-1">{news.Title}</div>
											<div className="mt-1.5" dangerouslySetInnerHTML={{ __html: news.PreContent }} />
										</div>
									</div>
								</Paper>
							</Grid>
						))}
					</Grid>
				</div>
			</div>
		</div>
	);
};
export default observer(ViewNewsAndUpdatesPage);
