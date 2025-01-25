import React from 'react';
import { HDialog, HDialogProps } from '@hybrain/mui.ui.dialogs.h-dialog';

const BaseDialog: React.FC<HDialogProps> = (props) => {
	return <HDialog {...props} />;
};

export default BaseDialog;
