import React from 'react';
import { observer } from 'mobx-react-lite';

import { styled } from '@mui/material/styles';
import RedditIcon from '@mui/icons-material/Reddit';
import YouTubeIcon from '@mui/icons-material/YouTube';
import TwitterIcon from '@mui/icons-material/Twitter';
import FacebookIcon from '@mui/icons-material/Facebook';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import PinterestIcon from '@mui/icons-material/Pinterest';
import InstagramIcon from '@mui/icons-material/Instagram';

import FooterModel from 'types/footer.model';
import useApi from 'hooks/useApi';

const Footer = styled('div')(({ theme }) => ({
	position: 'fixed',
	left: 0,
	bottom: 0,
	right: 0,
	// right: `${(1 / 7) * 100}vw`,
	display: 'flex',
	alignItems: 'center',
	minHeight: '50px',
	backgroundColor: theme.palette.primary.main,
	color: '#fff',
	fontWeight: 600,
	padding: '0 2%',
	fontSize: '14px',
	zIndex: 2,
}));

interface MainFooterProps {}

const MainFooter: React.FC<MainFooterProps> = () => {
	const { data: footers } = useApi<FooterModel[]>({
		url: '/footer/client',
	});

	const getFooterIcon = (footer: FooterModel) => {
		if (footer.ImagePath === 'facebook') {
			return <FacebookIcon />;
		} else if (footer.ImagePath === 'instagram') {
			return <InstagramIcon />;
		} else if (footer.ImagePath === 'linkedin') {
			return <LinkedInIcon />;
		} else if (footer.ImagePath === 'pinterest') {
			return <PinterestIcon />;
		} else if (footer.ImagePath === 'reddit') {
			return <RedditIcon />;
		} else if (footer.ImagePath === 'twitter') {
			return <TwitterIcon />;
		} else if (footer.ImagePath === 'youtube') {
			return <YouTubeIcon />;
		}
	};

	return (
		<Footer>
			<div className="flex justify-between container mx-auto">
				<div>Content Management System</div>

				<div className="flex gap-x-3">
					{footers.map((footer, index) => (
						<div className="cursor-pointer" key={index} onClick={() => window.open(footer.URL, '_blank', 'noopener,noreferrer')}>
							{getFooterIcon(footer)}
						</div>
					))}
				</div>
			</div>
		</Footer>
	);
};

export default observer(MainFooter);
