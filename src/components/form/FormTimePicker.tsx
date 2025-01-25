import React from 'react';

import { HFormTimePicker, HFormTimePickerProps } from '@hybrain/mui.ui.formik.h-form-time-picker';

const FormTimePicker = (props: HFormTimePickerProps<Date, Date>) => {
	return <HFormTimePicker {...props} />;
};

export default FormTimePicker;
