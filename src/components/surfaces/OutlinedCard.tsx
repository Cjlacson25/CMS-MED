import React from 'react';
import { styled } from '@mui/material/styles';

interface OutlinedCardProps {
	label?: string;
	paddingTop?: string | number;
	paddingBottom?: string | number;
	paddingLeft?: string | number;
	paddingRight?: string | number;
	fontSize?: string | number;
	className?: string;
	color?: string;
	position?: 'left' | 'right';
	borderWidth?: string | number;
	children?: React.ReactNode;
}

const Root = styled('div', {
	shouldForwardProp: (prop: string) =>
		!['paddingTop', 'paddingBottom', 'paddingLeft', 'paddingRight', 'label', 'borderWidth'].includes(prop),
})<OutlinedCardProps>((props) => ({
	position: 'relative',
	// borderWidth: props.borderWidth ?? '1px',
	// borderStyle: 'solid',
	// borderColor: 'black',
	paddingTop: props.paddingTop ?? (props.label ? '10%' : '15px'),
	paddingBottom: props.paddingBottom ?? '5%',
	paddingLeft: props.paddingLeft ?? '5%',
	paddingRight: props.paddingRight ?? '5%',

	'@media screen and (min-width: 560px)': {
		paddingTop: props.paddingTop ?? (props.label ? '40px' : '15px'),
		paddingBottom: props.paddingBottom ?? '25px',
		paddingLeft: props.paddingLeft ?? '20px',
		paddingRight: props.paddingRight ?? '20px',
	},
}));

const LabelContainer = styled('h1', {
	shouldForwardProp: (prop: string) => !['fontSize', 'color', 'position'].includes(prop),
})<OutlinedCardProps>((props) => ({
	position: 'absolute',
	left: props.position === 'left' ? '10px' : undefined,
	right: props.position === 'right' ? '10px' : undefined,
	top: 0,
	transform: 'translateY(-50%)',
	padding: '0 5px',
	backgroundColor: 'white',
	fontSize: props.fontSize ?? '25px',
	fontWeight: 'bold',
	color: props.color,
}));

const OutlinedCard = ({ children, label, fontSize, color, position = 'left', ...props }: OutlinedCardProps) => {
	return (
		<Root {...props} label={label}>
			<div></div>
			{label && <LabelContainer {...{ fontSize, color, position }}>{label}</LabelContainer>}

			{children}
		</Root>
	);
};

export default OutlinedCard;
