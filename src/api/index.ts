import axios, { AxiosResponse } from 'axios';
import localforage from 'localforage';
import DialogStore from '../stores/DialogStore';

export interface ApiProps {
	success?: string | boolean;
	error?: string | boolean;
	redirect?: boolean;
}

const api = (apiProps?: ApiProps) => {
	const API_URL = process.env.REACT_APP_API_URL?.replace(/\s/g, '');
	const DIALOG_TIMEOUT = 6000;

	const axiosInstance = axios.create({
		baseURL: API_URL,
	});

	axiosInstance.interceptors.request.use(async (config) => {
		if (config.baseURL === API_URL && !config?.headers?.Authorization) {
			const token = await localforage.getItem('accessToken');
			if (config.headers) {
				config.headers.Authorization = ('Bearer ' + token) as any;
			}
		}
		return config;
	});

	axiosInstance.interceptors.response.use(
		(response: AxiosResponse<any>) => {
			if (response.config.method !== 'get') {
				if (typeof apiProps?.success === 'boolean') return Promise.resolve(response);
				if (apiProps?.success) {
					DialogStore.success(apiProps?.success);
				} else {
					DialogStore.success(response?.data.message);
				}

				setTimeout(() => {
					DialogStore.close();
				}, DIALOG_TIMEOUT);
			}

			return Promise.resolve(response);
		},
		(error) => {
			if (error.response?.status === 403) {
				localStorage.clear();
				localforage.clear();
				if (apiProps?.redirect !== false) {
					window.location.href = '/login';
				}
			}

			if (typeof apiProps?.error === 'boolean') return Promise.reject(error);

			if (apiProps?.error) {
				DialogStore.error(apiProps?.error);
			} else {
				DialogStore.error(error.response?.data.message);
			}

			setTimeout(() => {
				DialogStore.close();
			}, DIALOG_TIMEOUT);

			return Promise.reject(error);
		}
	);

	return axiosInstance;
};

export default api;
