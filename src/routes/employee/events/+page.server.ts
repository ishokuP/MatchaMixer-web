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
