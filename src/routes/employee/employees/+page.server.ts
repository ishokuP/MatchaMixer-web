import { mysqlconnFn } from '$lib/db/mysql';

export async function load() {
	let mysqlconn = await mysqlconnFn();
	try {
		const results = await mysqlconn
			.query('SELECT * FROM employee;')
			.then(function ([rows, fields]) {
				return rows;
			});
		return {
			data: results
		};
	} catch (error) {
		console.error('Got an error!!!');
		console.log(error);
		return error;
	}
}
