export function formatDate(date: Date | string | null, type: 'utc' | null = 'utc') {
	if (!date) return null;

	if (type === 'utc') {
		let d = new Date(date),
			month = '' + (d.getUTCMonth() + 1),
			day = '' + d.getUTCDate(),
			year = d.getUTCFullYear();

		if (month?.length < 2) month = '0' + month;
		if (day?.length < 2) day = '0' + day;

		return [month, day, year].join('/');
	} else {
		let d = new Date(date),
			month = '' + (d.getMonth() + 1),
			day = '' + d.getDate(),
			year = d.getFullYear();

		if (month?.length < 2) month = '0' + month;
		if (day?.length < 2) day = '0' + day;

		return [month, day, year].join('/');
	}
}

export function dateFormat(date: Date | null | string, options?: Intl.DateTimeFormatOptions) {
	if (!date) return null;
	if (typeof date === 'string') {
		date = new Date(date);
	}

	return date.toLocaleDateString('en-us', {
		day: '2-digit',
		month: 'numeric',
		year: 'numeric',
		...options,
	});
}

export function timeFormat(time: Date | string | null, options?: Intl.DateTimeFormatOptions) {
	if (!time) return null;
	if (typeof time === 'string') {
		time = new Date(time);
	}

	return time.toLocaleTimeString('en-us', {
		hour: 'numeric',
		minute: 'numeric',
		...options,
	});
}

export function dateTimeFormat(dateTime: Date | string | null, options?: Intl.DateTimeFormatOptions) {
	if (!dateTime) return null;
	if (typeof dateTime === 'string') {
		dateTime = new Date(dateTime);
	}

	return dateTime.toLocaleDateString('en-us', {
		day: '2-digit',
		month: 'numeric',
		year: 'numeric',
		hour: 'numeric',
		minute: 'numeric',
		...options,
	});
}

export function formatDateTime(date: Date | string | null) {
	if (!date) return null;

	return new Date(date).toLocaleTimeString('en-us', {
		month: '2-digit',
		day: '2-digit',
		year: '2-digit',
		hour: '2-digit',
		minute: '2-digit',
		hour12: true,
	});
}

export function formatDateWithTime(date: Date | string | null, time: Date | string | null) {
	if (!date) return null;
	let d = new Date(date),
		month = '' + (d.getUTCMonth() + 1),
		day = '' + d.getUTCDate(),
		year = d.getUTCFullYear();

	if (month.length < 2) month = '0' + month;
	if (day.length < 2) day = '0' + day;

	return [month, day, year].join('/') + ' ' + (time == null ? '' : new Date(date + ' ' + time).toLocaleTimeString());
}

export function formatTime(date: Date | string | null) {
	if (!date) return null;
	if (typeof date === 'string') {
		date = new Date(date);
	}

	let hours = date.getHours().toString();
	let minutes = date.getMinutes().toString();
	let seconds = date.getSeconds().toString();

	if (hours.length < 2) hours = '0' + hours;
	if (minutes.length < 2) minutes = '0' + minutes;
	if (seconds.length < 2) seconds = '0' + seconds;

	return `${hours}:${minutes}:${seconds}`;
}

export function formatTimeNoSeconds(date: Date | string | null) {
	if (!date) return null;
	if (typeof date === 'string') {
		date = new Date(date);
	}

	let hours = date.getHours().toString();
	let minutes = date.getMinutes().toString();

	if (hours.length < 2) hours = '0' + hours;
	if (minutes.length < 2) minutes = '0' + minutes;

	return `${hours}:${minutes}:00`;
}

export function timeFormat12(time: string) {
	if (!time) return null;
	const [hours, minutes] = time.split(':');
	const ampm = parseInt(hours) >= 12 ? 'PM' : 'AM';

	return `${parseInt(hours) > 12 ? parseInt(hours) - 12 : hours === '00' ? '12' : hours}:${minutes} ${ampm}`;
}

export function convertToSqlDate(date?: string | Date) {
	if (!date) return;
	if (typeof date === 'string') {
		date = new Date(date);
	}
	return `${date.getFullYear()}-${('0' + (date.getMonth() + 1)).slice(-2)}-${('0' + date.getDate()).slice(-2)}`;
}

export function convertToSqlDateTime(date: Date, time: Date) {
	if (!date || !time) return;
	if (date instanceof Date === false) {
		date = new Date(date);
	}
	if (time instanceof Date === false) {
		time = new Date(time);
	}
	return `${date.getFullYear()}-${('0' + (date.getMonth() + 1)).slice(-2)}-${('0' + date.getDate()).slice(-2)}T${
		time.toTimeString().split(' ')[0]
	}`;
}

export function subtractFromDate(days: number) {
	if (!days) return;
	return new Date(new Date().setDate(new Date().getUTCDate() - days));
}

export function getAge(dateString: string) {
	if (!dateString) return null;
	const today = new Date();
	const birthDate = new Date(dateString);
	let age = today.getUTCFullYear() - birthDate.getUTCFullYear();
	const m = today.getUTCMonth() - birthDate.getUTCMonth();
	if (m < 0 || (m === 0 && today.getUTCDate() < birthDate.getUTCDate())) {
		age--;
	}
	return age;
}

export const addMinutes = function (date: Date, minutes: number) {
	return new Date(date.getTime() + minutes * 60000);
};
