import { styled } from '@mui/material/styles';
import React from 'react';

interface PageContainerProps {
	className?: string;
	children?: React.ReactNode;
}

const Root = styled('div')({
	paddingLeft: `${(1 / 7) * 100}vw`,
	paddingRight: `${(1 / 7) * 100}vw`,
});

const PageContainer = ({ children, ...props }: PageContainerProps) => {
	return <Root {...props}>{children}</Root>;
};

export default PageContainer;
