import DoctorModel from 'types/doctor.model';
import { timeFormat } from './date';

export function joinStrings(strings: string[], seperator: string = ', ') {
	return strings.filter((v) => !!v).join(seperator);
}

// export function getPatientAddress(patient: Patient) {
// 	if (!patient) return '';
// 	return [
// 		patient.street1,
// 		patient.street2,
// 		patient.barangay,
// 		patient.city,
// 		patient.state,
// 		patient.region,
// 		patient.country,
// 		patient.zip,
// 	]
// 		.filter((v) => !!v)
// 		.join(', ');
// }

// export function getPatientFullName(patient: Patient) {
// 	return [patient.first_name, patient.middle_name, patient.last_name].filter((v) => !!v).join(' ');
// }

// export function getDoctorFullName(doctor: Doctor) {
// 	return [doctor.first_name, doctor.middle_name, doctor.last_name].filter((v) => !!v).join(' ');
// }

// export function getFullName(user: Doctor | Patient) {
// 	if (!user) return '';
// 	return [user.first_name, user.middle_name, user.last_name].filter((v) => !!v).join(' ');
// }

export function getFullAddress(user: any) {
	return [user.street1, user.street2, user.barangay, user.city, user.state, user.region, user.country, user.zip]
		.filter((v) => !!v)
		.join(', ');
}

export function slugify(str: string) {
	str = str.replace(/^\s+|\s+$/g, ''); // trim
	str = str.toLowerCase();

	var from = 'àáäâèéëêìíïîòóöôùúüûñç·/_,:;';
	var to = 'aaaaeeeeiiiioooouuuunc------';
	for (var i = 0, l = from.length; i < l; i++) {
		str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
	}

	str = str
		.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
		.replace(/\s+/g, '-') // collapse whitespace and replace by -
		.replace(/-+/g, '-'); // collapse dashes

	return str;
}

export function getDoctorSchedule(doctor: DoctorModel) {
	if (doctor.doctorSchedules.length === 0) return [];

	const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

	let groupedSched: Array<any[]> = [[]];

	let groupIndex = 0;

	doctor.doctorSchedules.forEach((sched, index) => {
		if (index === 0) {
			groupedSched[groupIndex].push(sched);
		} else {
			if (
				sched.StartDateTime === doctor.doctorSchedules[index - 1].StartDateTime &&
				sched.EndDateTime === doctor.doctorSchedules[index - 1].EndDateTime
			) {
				groupedSched[groupIndex].push(sched);
			} else {
				groupIndex++;
				groupedSched.push([]);
				groupedSched[groupIndex].push(sched);
			}
		}
	});

	const scheds = groupedSched.map((group) => {
		let ascending = true;

		const sortedSched = group.map((sched) => days.indexOf(sched.Day)).sort();

		sortedSched.forEach((schedIndex, index) => {
			if (index > 0 && schedIndex - sortedSched[index - 1] !== 1) {
				ascending = false;
			}
		});

		if (!ascending) {
			const scheds: any[] = [];
			sortedSched.forEach((schedIndex) => {
				scheds.push(days[schedIndex]);
			});
			return scheds.join(', ') + ' ' + timeFormat(group[0]?.StartDateTime) + ' - ' + timeFormat(group[0]?.EndDateTime);
		} else {
			return (
				days[sortedSched[0]] +
				' - ' +
				days[sortedSched[sortedSched.length - 1]] +
				' ' +
				(timeFormat(group[0]?.StartDateTime) === null ? '' : timeFormat(group[0]?.StartDateTime)) +
				(timeFormat(group[0]?.StartDateTime) === null ? '' : ' - ') +
				(timeFormat(group[0]?.EndDateTime) === null ? '' : timeFormat(group[0]?.EndDateTime))
			);
		}
	});

	return scheds;
}

export const stripHTMLFromString = (str: string) => {
	if (!str) return '';
	return str.replace(/<(?:.|\n)*?>/gm, '');
};
