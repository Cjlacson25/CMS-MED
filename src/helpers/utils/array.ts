export const groupArray = (array: any[], chunkSize: number) => {
	let groups = [];
	for (let i = 0; i < array.length; i += chunkSize) {
		groups.push(array.slice(i, i + chunkSize));
	}
	return groups;
};
