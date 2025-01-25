import { styled } from '@mui/material/styles';
import React from 'react';
import CompanySubContentModel from 'types/company-sub-content.model';

interface CompanySubContentProps {
	items: CompanySubContentModel[];
}

const SubContent = styled('div')({
	display: 'grid',
	gridTemplateColumns: '1fr',
	justifyContent: 'center',
	alignItems: 'center',
	minHeight: '280px',
	gap: '20px',

	'@media screen and (min-width: 850px)': {
		gridTemplateColumns: '1fr 1fr',
		paddingTop: 0,
	},

	'&:nth-of-type(even)': {
		backgroundColor: '#A1C1D0',
		minHeight: '250px',

		'& .image': {
			width: '100%',
			transform: 'translateX(0)',
			height: '320px',
		},
	},
});

const Image = styled('img')({
	width: '100%',
	height: '320px',
	objectPosition: 'center',
	objectFit: 'cover',

	'@media screen and (min-width: 1360px)': {
		width: '450px',
		height: '200px',
		transform: 'translateX(40px)',
	},
});

const Title = styled('div')({
	fontSize: '22px',
	textTransform: 'uppercase',
	marginBottom: '10px',
	width: '250px',
});

const Body = styled('div')({
	width: '100%',
	maxWidth: '100%',
	paddingRight: '15px',

	'@media screen and (min-width: 760px)': {
		width: '550px',
	},
});

const Content = styled('div')({
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	padding: '20px',
	paddingTop: '30px',
	textAlign: 'center',

	'@media screen and (min-width: 850px)': {
		display: 'block',
		paddingLeft: '13%',
		textAlign: 'left',
	},
});

const CompanySubContent: React.FC<CompanySubContentProps> = ({ items }) => {
	return (
		<div>
			{/* {JSON.stringify(items)} */}
			{items.map((item, index) => {
				return (
					<SubContent key={index}>
						<Content>
							<Title dangerouslySetInnerHTML={{ __html: item.Title }}></Title>
							<Body dangerouslySetInnerHTML={{ __html: item.Content }}></Body>
						</Content>
						<Image className="image" src={item.ImagePath} />
					</SubContent>
				);
			})}
		</div>
	);
};

export default CompanySubContent;
