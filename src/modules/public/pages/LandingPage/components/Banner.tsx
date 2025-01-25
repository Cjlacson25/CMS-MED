import React from 'react';
import { styled } from '@mui/material/styles';
import { observer } from 'mobx-react-lite';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import HeaderModel from 'types/header.model';
import { useNavigate } from 'react-router-dom';

const Root = styled('div')({
	display: 'flex',
	flexDirection: 'column',
	flexGrow: 1,
	position: 'relative',
	minHeight: `calc(100vh - 250px)`,
	marginBottom: '100px',

	'@media screen and (min-width: 1360px)': {
		marginBottom: '80px',
	},
});

const Title = styled('div')(({ theme }) => ({
	position: 'absolute',
	left: 0,
	bottom: '15%',
	// backgroundColor: theme.palette.primary.main,
	color: '#fff',
	padding: '13px 45px',
	minWidth: '20%',

	'@media screen and (min-width: 560px)': {
		padding: '15px 70px',
	},
}));

const PrimaryTitle = styled('h1')({
	fontSize: '22px',
	fontWeight: 100,
	textTransform: 'uppercase',
	// textShadow: '3px 3px #000000', //in case white text is too flat and not visible

	'@media screen and (min-width: 560px)': {
		fontSize: '28px',
	},
});
const SecondaryTitle = styled('h1')({
	fontSize: '25px',
	fontWeight: 600,
	textTransform: 'uppercase',
	// textShadow: '3px 3px #000000', //in case white text is too flat and not visible

	'@media screen and (min-width: 560px)': {
		fontSize: '35px',
	},
});

const Options = styled('div')({
	position: 'absolute',
	bottom: 0,
	left: '50%',
	transform: 'translate(-50%, 50%)',
	display: 'flex',
	justifyContent: 'center',
	padding: '15px 30px',
	columnGap: '20px',
	backgroundColor: '#fff',
	boxShadow: '1px 8px 12px rgba(0, 0, 0, 0.3)',
	maxWidth: '100%',

	'@media screen and (min-width: 560px)': {
		padding: '20px 48px',
		columnGap: '30px',
	},

	'@media screen and (min-width: 810px)': {
		padding: '30px 85px',
		columnGap: '50px',
	},
});

const OptionPrimaryText = styled('div')({
	fontSize: '14px',

	'@media screen and (min-width: 560px)': {
		fontSize: '18px',
	},

	'@media screen and (min-width: 810px)': {
		fontSize: '20px',
	},
});

const OptionSecondaryText = styled('div')({
	fontSize: '16px',
	fontWeight: 600,

	'@media screen and (min-width: 560px)': {
		fontSize: '20px',
	},

	'@media screen and (min-width: 810px)': {
		fontSize: '23px',
	},
});

const Divider = styled('div')({
	width: '2px',
	backgroundColor: '#BFBFBF',
});

const Image = styled('div', {
	shouldForwardProp: (prop: string) => prop !== 'backgroundImage',
})<{ backgroundImage: string }>((props) => ({
	position: 'relative',
	width: '100%',
	minHeight: `calc(100vh - 250px)`,
	backgroundImage: `url(${props.backgroundImage})`,
	backgroundSize: 'cover',
	backgroundPosition: 'center',
}));

interface BannerProps {
	items: HeaderModel[];
}

const Banner: React.FC<BannerProps> = ({ items }) => {
	const navigate = useNavigate();

	return (
		<Root>
			<Splide
				options={{
					pagination: false,
					autoplay: true,
					interval: 6000,
					rewind: true,
					pauseOnHover: false,
					pauseOnFocus: false,
				}}
			>
				{items.map((item, index) => (
					<SplideSlide key={index}>
						<Image backgroundImage={item.ImagePath}>
							{(item.TagLine1 || item.TagLine2) && (
								<Title>
									<PrimaryTitle dangerouslySetInnerHTML={{ __html: item.TagLine1 }}></PrimaryTitle>
									<SecondaryTitle dangerouslySetInnerHTML={{ __html: item.TagLine2 }}></SecondaryTitle>
								</Title>
							)}
						</Image>
					</SplideSlide>
				))}
			</Splide>

			<Options>
				<div className="cursor-pointer" onClick={() => navigate('/find-doctor')}>
					<OptionPrimaryText>Find a</OptionPrimaryText>
					<OptionSecondaryText>Doctor</OptionSecondaryText>
				</div>
				<Divider />
				<div className="cursor-pointer" onClick={() => navigate('/locations')}>
					<OptionPrimaryText>Contact</OptionPrimaryText>
					<OptionSecondaryText>Us</OptionSecondaryText>
				</div>
				<Divider />
				<div className="cursor-pointer" onClick={() => navigate('/services-list')}>
					<OptionPrimaryText>Explore</OptionPrimaryText>
					<OptionSecondaryText>Services</OptionSecondaryText>
				</div>
			</Options>
		</Root>
	);
};

export default observer(Banner);
