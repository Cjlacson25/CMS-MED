import { makeAutoObservable } from 'mobx';

interface ResponseDialogProps {
	status: boolean;
	title: string;
	content: string;
	btnText: string;
	icon: JSX.Element | string;
	type: 'success' | 'error' | 'warning' | 'info' | '';
	duration: number | 'unlimited';
}

class DialogStore {
	response: ResponseDialogProps = {
		status: false,
		title: '',
		content: '',
		btnText: '',
		icon: '',
		type: '',
		duration: 6000,
	};

	constructor() {
		makeAutoObservable(this);
	}

	update(payload: Partial<ResponseDialogProps>) {
		Object.keys(this.response).forEach((property) => {
			(this.response as any)[property] = (payload as any)[property];
		});
	}

	success(message: string) {
		this.response.status = true;
		this.response.type = 'success';
		this.response.content = message;
	}

	info(message: string, duration?: number | 'unlimited') {
		this.response.status = true;
		this.response.type = 'info';
		this.response.content = message;
		this.response.duration = duration || 6000;
	}

	error(message: string) {
		this.response.status = true;
		this.response.type = 'error';
		this.response.content = message;
	}

	warning(message: string) {
		this.response.status = true;
		this.response.type = 'warning';
		this.response.content = message;
	}

	close() {
		this.response.status = false;
	}
}

export default new DialogStore();