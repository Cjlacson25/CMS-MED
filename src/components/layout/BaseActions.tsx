import React from 'react';

import { styled } from '@mui/material/styles';

interface BaseActionsProps {
	columnGap?: string | number;
	className?: string;
	center?: boolean;
	direction?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
	rowGap?: string | number;
	justifyContent?: 'center' | 'space-between' | 'flex-start' | 'flex-end' | 'space-around';
	children?: React.ReactNode;
}

const Root = styled('div')({
	display: 'flex',
	alignItems: 'center',
});

const BaseActions = ({
	children,
	columnGap = '6px',
	center,
	direction,
	rowGap = '12px',
	justifyContent,
	...props
}: BaseActionsProps) => {
	return (
		<Root
			className={props.className}
			style={{
				columnGap,
				justifyContent: center ? 'center' : justifyContent ? justifyContent : undefined,
				flexDirection: direction,
				rowGap,
			}}
		>
			{children}
		</Root>
	);
};

export default BaseActions;
