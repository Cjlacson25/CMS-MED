import React from 'react';
import { useField } from 'formik';
import ReactQuill from 'react-quill';

interface FormEditorProps {
	name: string;
}

const FormEditor = ({ name, ...props }: FormEditorProps) => {
	const [field, , { setValue }] = useField({ name });

	return (
		<ReactQuill
			className="h-80"
			modules={{
				toolbar: [
					[{ size: ['small', false, 'large', 'huge'] }],
					[{ 'header': [1, 2, 3, 4, 5, 6, false] }],
					['bold', 'italic', 'underline', 'strike'],
					[{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
					[{ script: 'sub' }, { script: 'super' }],
					['blockquote', 'code-block'],
					[{ direction: 'rtl' }, { align: [] }],
					['link', 'image', 'video', 'formula'],
					[{ color: [] }, { background: [] }],
					['clean'],
				],
			}}
			value={field.value}
			onChange={(value) => setValue(value)}
			{...props}
		/>
	);
};

export default FormEditor;
