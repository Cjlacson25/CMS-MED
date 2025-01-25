import React, { useEffect } from 'react';

import clsx from 'clsx';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';

const Root = styled('div')({
	display: 'flex',
	flexDirection: 'column',
	flexGrow: 1,
	margin: '5px',
});

const Title = styled('div')({
	display: 'flex',
	justifyContent: 'space-between',
	fontSize: '25px',
	marginBottom: '15px',
	fontWeight: 600,
});

export interface PageProps {
	title?: string;
	noContainer?: boolean;
	containerProps?: React.HTMLAttributes<HTMLDivElement>;
	headerActions?: JSX.Element;
	className?: string;
	children?: React.ReactNode;
}

const Page = ({ title, children, noContainer, containerProps, headerActions, className }: PageProps) => {
	useEffect(() => {
		document.title = (title ? title : process.env.REACT_APP_NAME || 'React App') + ` | ${process.env.REACT_APP_PROJECT_NAME}`;
	}, [title]);

	return (
		<Root className={className}>
			{title && (
				<Title>
					<div hidden>{title}</div>
					<div>{headerActions}</div>
				</Title>
			)}
			{noContainer ? (
				children
			) : (
				<Paper {...containerProps} elevation={4} className={clsx('flex-grow flex flex-col p-4', containerProps?.className)}>
					{children}
				</Paper>
			)}
		</Root>
	);
};

export default Page;
