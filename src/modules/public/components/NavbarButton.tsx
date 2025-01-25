import React from 'react';
import { styled } from '@mui/material/styles';
import BaseButton, { BaseButtonProps } from '../../../components/inputs/BaseButton';

interface NavbarButtonProps {}

const StyledButton = styled(BaseButton)({
	borderRadius: '12px',
	height: '45px',
	background: 'linear-gradient(to right, #3837D3 ,#514DF8)',
	boxShadow: 'none',
	color: 'black',
	minWidth: '180px',
});

const NavbarButton: React.FC<NavbarButtonProps & BaseButtonProps> = ({ children, ...props }) => {
	return <StyledButton {...props}>{children}</StyledButton>;
};

export default NavbarButton;
