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


/** @type {import('./$types').Actions} */
export const actions = {
    update: async ({ request }) => {
        const form = await request.formData();
        const employeeID = form.get('employeeID');
        const employeeName = form.get('employeeName');
        const employeeNumber = form.get('employeeNumber');
        const employeeAddress = form.get('employeeAddress');
        const employeeFBName = form.get('employeeFBName');
        const employeeRole = form.get('employeeRole');
		const employeeEmail = form.get('employeeEmail')
		const employeePassword = form.get('employeePassword')

        console.log(form);
        console.log("save clicked");

        try {
            const connection = await mysqlconnFn();

            // Check if the employeeID exists
            const [existingEmployee] = await connection.query(
                `SELECT 1 FROM employee WHERE id = ?`, [employeeID]
            );

            if (existingEmployee.length > 0) {
                // Update existing employee
                await connection.execute(`
                    UPDATE employee SET
                        name = ?,
                        number = ?,
                        address = ?,
                        fbname = ?,
                        role = ?,
                        email = ?,
						password = ?
                    WHERE id = ?`,
                    [employeeName, employeeNumber, employeeAddress, employeeFBName, employeeRole,employeeEmail, employeePassword,employeeID]
                );
            } else {
                // Insert new employee
                await connection.execute(`
                    INSERT INTO employee (id, name, number, address, fbname,email,  password, role) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                    [employeeID, employeeName, employeeNumber, employeeAddress, employeeFBName,employeeEmail, employeePassword ,employeeRole]
                );
            }

            return { status: 200 };
        } catch (error) {
            console.error('Failed to update employee:', error);
            return { status: 500, body: { error: 'Failed to update employee.' } };
        }
    },
    delete: async ({ request }) => {
        const form = await request.formData();
        const employeeID = form.get('employeeID');

        console.log(form);
        console.log("delete clicked");

        try {
            const connection = await mysqlconnFn();
            await connection.execute(`DELETE FROM employee WHERE id = ?`, [employeeID]);

            return { status: 200 };
        } catch (error) {
            console.error('Failed to delete employee:', error);
            return { status: 500, body: { error: 'Failed to delete employee.' } };
        }
    }
};
