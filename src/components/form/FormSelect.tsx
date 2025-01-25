import { HFormSelect, HFormSelectProps } from '@hybrain/mui.ui.formik.h-form-select';
import React from 'react';

const FormSelect = <T extends any>(props: HFormSelectProps<T>) => {
	return <HFormSelect {...props} />;
};

export default FormSelect;
