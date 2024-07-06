import { mysqlconnFn } from '$lib/db/mysql';
import { redirect } from "@sveltejs/kit";

interface Event {
	eventID: number;
	eventDate: Date;
	eventTime: string;
	eventName: string;
	eventClientName: string;
	eventClientContact: string;
	eventVenue: string;
	eventType: string;
	equipmentNeeded: string;
	paymentID: string;
	additionalRequests: string;
	service: number;
	employeeAssigned: number;
	paymentStatus: string;
	paymentCost: string;
}

interface Employee {
	employeeID: number;
	employeeName: string;
	employeeRole: string;
	email: string;
	contactNumber: string;
}

interface allEmployOriginal {
	id: number;
	name: number;
}

interface allEquipOriginal {
	id: number;
	name: number;
}

interface Equipment {
	equipmentID: string;
	equipmentName: string;
	equipmentStatus: string;
	equipmentCondition: string;
}

interface LoadResult {
	eventResults: Event[];
	employeeResults: { [key: number]: Employee[] };
	equipmentResults: { [key: number]: Equipment[] };
	allEmployees: allEmployOriginal[];
	allEquipment: allEquipOriginal[];
}

function parseDate(dateString: string): Date {
	const [year, month, day] = dateString.split('-').map(Number);
	return new Date(year, month - 1, day);
}
function getStringValue(formData: FormData, key: string, defaultValue: string = ''): string {
	const value = formData.get(key);
	return value !== null && value !== undefined ? value.toString() : defaultValue;
}
function formatDateToMySQL(dateStr) {
    const date = new Date(dateStr);
    // Adjust for timezone offset to get the correct date
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    return date.toISOString().slice(0, 10);  // Extracts and returns 'YYYY-MM-DD'
}
export async function load(): Promise<LoadResult> {
	let mysqlconn = await mysqlconnFn();
	try {
		const events: Event[] = await mysqlconn
			.query(
				`
            SELECT 
                E.eventID,
                DATE_FORMAT(E.eventDate, '%Y-%m-%d') AS eventDate,
                E.eventTime,
                E.eventName,
                E.eventClientName,
                E.eventClientContact,
                E.eventVenue,
                E.eventType,
                E.equipmentNeeded,
                E.paymentID,
                E.additionalRequests,
                E.service,
                E.employeeAssigned,
                P.status AS paymentStatus,
                P.cost AS paymentCost
            FROM 
                Events E
            JOIN 
                Payments P ON E.paymentID = P.id`
			)
			.then(([rows]) => {
				return rows.map((row: any) => ({
					...row,
					eventDate: parseDate(row.eventDate) // Convert to Date object
				}));
			});

		let employeeResults: { [key: number]: Employee[] } = {};
		let equipmentResults: { [key: number]: Equipment[] } = {};

		const employeePromises = events.map((event) =>
			mysqlconn
				.query(
					`SELECT 
                    EM.id AS employeeID,
                    EM.name AS employeeName,
                    EM.role AS employeeRole,
                    EM.email,
                    EM.number AS contactNumber
                FROM 
                    EventEmployee EE 
                JOIN 
                    Employee EM ON EE.employeeID = EM.id
                WHERE 
                    EE.eventID = ${event.eventID};`
				)
				.then(([rows]) => {
					employeeResults[event.eventID] = rows;
				})
		);

		const equipmentPromises = events.map((event) =>
			mysqlconn
				.query(
					`SELECT 
                    EQ.id AS equipmentID,
                    EQ.name AS equipmentName,
                    EQ.status AS equipmentStatus,
                    EQ.Econdition AS equipmentCondition
                FROM 
                    EventEquipment EEQ 
                JOIN 
                    Equipments EQ ON EEQ.equipmentID = EQ.id
                WHERE 
                    EEQ.eventID = ${event.eventID};`
				)
				.then(([rows]) => {
					equipmentResults[event.eventID] = rows;
				})
		);

		const allEmployees: allEmployOriginal[] = await mysqlconn
			.query(`SELECT * FROM Employee`)
			.then(([rows]) => rows);
		const allEquipment: allEquipOriginal[] = await mysqlconn
			.query(`SELECT * FROM Equipments`)
			.then(([rows]) => rows);

		// Wait for all promises to complete
		await Promise.all([...employeePromises, ...equipmentPromises]);

		return {
			eventResults: events,
			employeeResults,
			equipmentResults,
			allEmployees,
			allEquipment
		};
	} catch (error) {
		console.error('Got an error!!!');
		console.log(error);
		throw error;
	}
}

/** @type {import('./$types').Actions} */
export const actions = {
    update: async ({ request }) => {
        const form = await request.formData();
        console.log("Form Data:", form);

        // Safely extract form data
        const eventID = form.get('eventID') || null;
        if (!eventID) {
            return {
                status: 400,
                body: { error: 'Event ID is required for update operations.' }
            };
        }
        const eventName = getStringValue(form, 'eventName');
        const eventDateRaw = getStringValue(form, 'eventDate');
        const eventDate = formatDateToMySQL(eventDateRaw);  // Ensure this conversion is correct
        const eventTime = getStringValue(form, 'eventTime');
        const eventClientName = getStringValue(form, 'clientName');
        const eventClientContact = getStringValue(form, 'clientNum');
        const eventVenue = getStringValue(form, 'eventVenue');
        const eventType = getStringValue(form, 'eventType');
        const additionalRequests  = getStringValue(form, 'additionalReq');
        let paymentID = getStringValue(form, 'paymentID');
        const paymentStatus = getStringValue(form, 'paymentStatus');
        const paymentCost = getStringValue(form, 'paymentCost');
        const employeesNeededJson = getStringValue(form, 'employeesNeeded', '[]');
        const equipmentNeededJson = getStringValue(form, 'equipmentNeeded', '[]');

        const employeesNeeded = JSON.parse(employeesNeededJson);
        const equipmentNeeded = JSON.parse(equipmentNeededJson);

        console.log("Employees Needed:", employeesNeeded);
        console.log("Equipment Needed:", equipmentNeeded);

        let connection;

        try {
            connection = await mysqlconnFn();
            await connection.beginTransaction();

            // Check if paymentID exists in the payments table
            if (paymentID) {
                const [paymentExists] = await connection.query(`SELECT 1 FROM payments WHERE id = ?`, [paymentID]);
                if (!paymentExists.length) {
                    // Insert new payment if it doesn't exist
                    await connection.query(
                        `INSERT INTO payments (id, status, cost) VALUES (?, ?, ?)`,
                        [paymentID, paymentStatus, paymentCost]
                    );
                } else {
                    // Update payment details
                    await connection.query(
                        `UPDATE payments SET
                        status = ?,
                        cost = ?
                        WHERE id = ?`,
                        [paymentStatus, paymentCost, paymentID]
                    );
                }
            }

            // Check if eventID exists in the events table
            const [eventExists] = await connection.query(`SELECT 1 FROM events WHERE eventID = ?`, [eventID]);
            if (!eventExists.length) {
                // Insert new event if it doesn't exist
                await connection.query(
                    `INSERT INTO events (eventID, eventName, eventDate, eventTime, eventClientName, eventClientContact, eventVenue, eventType, additionalRequests, paymentID)
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    [eventID, eventName, eventDate, eventTime, eventClientName, eventClientContact, eventVenue, eventType, additionalRequests, paymentID]
                );
            } else {
                // Update existing event details
                await connection.query(
                    `UPDATE events SET
                    eventName = ?,
                    eventDate = ?,
                    eventTime = ?,
                    eventClientName = ?,
                    eventClientContact = ?,
                    eventVenue = ?,
                    eventType = ?,
                    additionalRequests = ?,
                    paymentID = ?
                    WHERE eventID = ?`,
                    [eventName, eventDate, eventTime, eventClientName, eventClientContact, eventVenue, eventType, additionalRequests, paymentID, eventID]
                );
            }

            // Clear and reassign employees
            await connection.query(`DELETE FROM eventemployee WHERE eventID = ?`, [eventID]);
            for (const employee of employeesNeeded) {
                await connection.query(`INSERT INTO eventemployee (eventID, employeeID) VALUES (?, ?)`, [eventID, employee.value]);
            }

            // Clear and reassign equipment
            await connection.query(`DELETE FROM eventequipment WHERE eventID = ?`, [eventID]);
            for (const equipment of equipmentNeeded) {
                await connection.query(`INSERT INTO eventequipment (eventID, equipmentID) VALUES (?, ?)`, [eventID, equipment.value]);
            }

            await connection.commit();

            return {
                status: 303,
                headers: { Location: '/success' }
            };
        } catch (error) {
            console.error('Failed to update event details:', error);
            if (connection) {
                console.log("Rollback due to error");
                await connection.rollback();
            }
            return { status: 500, body: { error: 'Failed to update event.' } };
        } 
    }
	,
    delete: async ({ request }) => {
        const formDeleted = await request.formData();
        const eventID = formDeleted.get('eventID');
        console.log(eventID);
        console.log('delete clicked');

        if (!eventID) {
            return {
                status: 400,
                body: { error: 'Event ID is required for delete operations.' }
            };
        }

        let connection;

        try {
            connection = await mysqlconnFn();
            await connection.beginTransaction();

            // Fetch the paymentID associated with the event
            const [event] = await connection.query(`SELECT paymentID FROM events WHERE eventID = ?`, [eventID]);
            const paymentID = event[0]?.paymentID;

            // Delete associated records from eventemployee table
            await connection.query(`DELETE FROM eventemployee WHERE eventID = ?`, [eventID]);

            // Delete associated records from eventequipment table
            await connection.query(`DELETE FROM eventequipment WHERE eventID = ?`, [eventID]);

            // Delete the event itself
            await connection.query(`DELETE FROM events WHERE eventID = ?`, [eventID]);

            // Optionally, delete the associated payment record if it exists
            if (paymentID) {
                await connection.query(`DELETE FROM payments WHERE id = ?`, [paymentID]);
            }

            await connection.commit();

            return {
                status: 303,
                headers: { Location: '/' }
            };
        } catch (error) {
            console.error('Failed to delete event details:', error);
            if (connection) {
                console.log("Rollback due to error");
                await connection.rollback();
            }
            return { status: 500, body: { error: 'Failed to delete event.' } };
        }
    },
	pickdate: async ({ request }) => {
		const dateForm = await request.formData();
		console.log(dateForm);
		console.log('delete clicked');

		// TODO Add query
		return { status: 303, headers: { Location: '/' } };
	}
};
