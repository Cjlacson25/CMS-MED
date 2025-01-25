import api, { ApiProps } from 'api';
import { AxiosError, AxiosRequestConfig } from 'axios';
import React, { useCallback, useEffect, useRef, useState } from 'react';

type useApiProps = {
	immediate?: boolean;
	onSuccess?: (response: any) => void;
	onError?: (error: AxiosError) => void;
	onComplete?: () => void;
	dependencies?: React.DependencyList;
	responseType?: 'array' | 'object';
} & ApiProps &
	AxiosRequestConfig;

const useApi = <T>({
	immediate,
	url,
	success,
	error,
	redirect,
	method = 'GET',
	onSuccess,
	onError,
	onComplete,
	data,
	dependencies,
	responseType,
	...props
}: useApiProps) => {
	const [loading, setLoading] = useState(false);
	const [items, setItems] = useState<T>([] as any);
	const methodRef = useRef(method);
	const immediateRef = useRef(immediate);

	const callApi = useCallback((payload?: any) => {
		setLoading(true);

		let apiAction;

		if (methodRef.current === 'get' || methodRef.current === 'GET') {
			apiAction = api({ success, error, redirect }).get(url ?? '', { ...props, ...payload });
		}

		if (methodRef.current === 'post' || methodRef.current === 'POST') {
			apiAction = api({ success, error, redirect }).post(url ?? '', data ?? payload, props);
		}

		if (methodRef.current === 'put' || methodRef.current === 'PUT') {
			apiAction = api({ success, error, redirect }).put(url ?? '', data ?? payload, props);
		}

		if (methodRef.current === 'patch' || methodRef.current === 'PATCH') {
			apiAction = api({ success, error, redirect }).patch(url ?? '', data ?? payload, props);
		}

		if (methodRef.current === 'delete' || methodRef.current === 'DELETE') {
			apiAction = api({ success, error, redirect }).delete(url ?? '', props);
		}

		apiAction
			?.then(({ data }) => {
				setItems(data.response);
				onSuccess?.(data);
			})
			.catch((err) => {
				onError?.(err);
			})
			.finally(() => {
				setLoading(false);
				onComplete?.();
			});

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, dependencies ?? []);

	useEffect(() => {
		if ((methodRef.current === 'post' || methodRef.current === 'POST') && immediateRef.current === undefined) {
			immediateRef.current = false;
		} else if (immediateRef.current !== false) {
			immediateRef.current = true;
		}

		if (immediateRef.current) {
			callApi();
		}
	}, [callApi]);

	return {
		loading,
		callApi,
		data: items,
	};
};

export default useApi;
