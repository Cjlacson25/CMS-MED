import useResizeObserver from '@react-hook/resize-observer';
import React from 'react';

const useSize = (target: any) => {
	const [size, setSize] = React.useState<any>('');

	React.useLayoutEffect(() => {
		setSize(target.current?.offsetHeight);
	}, [target]);

	// Where the magic happens
	useResizeObserver(target, (entry) => setSize(entry.contentRect));
	return size;
};

export default useSize;
