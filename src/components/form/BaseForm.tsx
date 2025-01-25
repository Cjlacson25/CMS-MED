import React from 'react';
import { HForm, HFormProps } from '@hybrain/mui.ui.formik.h-form';

const BaseForm: React.FC<HFormProps> = (props) => {
	return <HForm {...props} />;
};

export default BaseForm;
