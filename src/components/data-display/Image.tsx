import { styled } from '@mui/material/styles';
import React from 'react';
import logo from '../../assets/images/logo.png';

const StyledImage = styled('img')(({ height, width }) => ({
	objectFit: 'cover',
	objectPosition: 'center',
	height,
	width,
}));

const Image: React.FC<React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>> = ({
	src,
	...props
}) => {
	return <StyledImage src={src ? (process.env.REACT_APP_IMAGE_URL || '') + src : logo} {...props} />;
};

export default Image;
