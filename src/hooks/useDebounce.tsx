import { useCallback, useEffect } from 'react';

const useDebounce = (effect: () => void, delay: number = 500, deps: any[]) => {
	// eslint-disable-next-line react-hooks/exhaustive-deps
	const callback = useCallback(effect, deps);

	useEffect(() => {
		const handler = setTimeout(() => {
			callback();
		}, delay);

		return () => {
			clearTimeout(handler);
		};
	}, [callback, delay]);
};

export default useDebounce;
