import React from 'react';

import { HButton, HButtonProps } from '@hybrain/mui.ui.inputs.h-button';

export type BaseButtonProps = HButtonProps;

const BaseButton: React.FC<HButtonProps> = (props) => {
	return <HButton {...props} />;
};

export default BaseButton;
