import React from 'react';
import { HButton, HButtonProps } from '@hybrain/mui.ui.inputs.h-button';
import UploadFileIcon from '@mui/icons-material/UploadFile';
interface UploadButtonProps {}

const UploadButton: React.FC<UploadButtonProps & HButtonProps> = ({ children, ...props }) => {
	return (
		<HButton size="large" width="130px" {...props}>
			<UploadFileIcon /> {children ?? 'Browse'}
		</HButton>
	);
};

export default UploadButton;
