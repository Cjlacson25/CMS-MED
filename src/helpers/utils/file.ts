export const convertToFormData = (payload: any) => {
	const formData = new FormData();
	Object.keys(payload).forEach((property: any) => {
		if ((payload as any)[property]) {
			formData.append(property, (payload as any)[property]);
		}
	});

	return formData;
};
