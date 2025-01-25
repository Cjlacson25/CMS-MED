const rules = {
	required: (value: any) => (value ? undefined : 'Required'),
	requiredArray: (value: any[]) => (value.length > 0 ? undefined : 'You need to input atleast 1'),
	requiredDate: (value: any) => (value && value !== 'Invalid Date' ? undefined : 'Required'),
	email: (value: string) => (/.+@.+\..+/.test(value) ? undefined : 'Invalid E-mail format'),
	number: (value: string) => (/^\d*\.?\d*$/.test(value) ? undefined : 'Invalid number format'),
	noLetters: (value: string) => (!/[A-Za-z]+/.test(value) ? undefined : 'Cannot contain letters'),
	onlyLetters: (value: string) => (/^[a-zA-Z]+$/.test(value) ? undefined : 'Only letters are allowed'),
};

export default rules;
