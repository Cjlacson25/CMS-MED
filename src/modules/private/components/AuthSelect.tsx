import React from 'react';
import { HFormSelect, HFormSelectProps } from '@hybrain/mui.ui.formik.h-form-select';

const AuthSelect = <T extends any>({ ...props }: HFormSelectProps<T>) => {
	return <HFormSelect size="small" {...props} />;
};

export default AuthSelect;
