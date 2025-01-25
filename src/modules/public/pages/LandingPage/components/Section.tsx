import React, { HTMLAttributes, DetailedHTMLProps } from 'react';
import { styled } from '@mui/material/styles';

interface SectionProps {
	backgroundImage?: string;
	backgroundColor?: string;
}

const Root = styled('div', {
	shouldForwardProp: (prop: string) => !['backgroundImage', 'backgroundColor'].includes(prop),
})<Partial<SectionProps>>(({ theme, ...props }) => ({
	display: 'flex',
	flexDirection: 'column',
	minHeight: '80vh',
	paddingTop: '100px',
	paddingBottom: '50px',
	backgroundImage: `url(${props.backgroundImage})`,
	backgroundColor: props.backgroundColor === 'primary' ? theme.palette.primary.main : props.backgroundColor,
	backgroundSize: 'cover',
	backgroundPosition: 'center',
}));

const Section: React.FC<SectionProps & DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>> = ({
	children,
	...props
}) => {
	return <Root {...props}>{children}</Root>;
};

export default Section;
