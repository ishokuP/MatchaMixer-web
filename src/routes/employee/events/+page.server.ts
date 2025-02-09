import { mysqlconnFn } from '$lib/db/mysql';
import { redirect } from "@sveltejs/kit";

interface Event {
	eventID: number;
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

interface Services {
	serviceID: string;
	serviceName: string;
	servicePrice: string;
	serviceInclusion: string;
	serviceRate: string;
}

interface LoadResult {
    eventResults: Event[];
    employeeResults: { [key: number]: Employee[] };
    equipmentResults: { [key: number]: Equipment[] };
    serviceResults: { [key: number]: Services[] };
    allEmployees: allEmployOriginal[];
    allEquipment: allEquipOriginal[];
    allServices: Services[];
}

function parseDate(dateString: string | undefined): string {
    // Check if the dateString is defined and not empty
    if (dateString && typeof dateString === 'string') {
        return dateString.split(' ')[0]; // Just an example: split by space to get the date part
    } else {
        console.error('Invalid date string:', dateString); // Optional: log the error
        return ''; // Return a default value or handle the error as needed
    }
}
function getStringValue(formData: FormData, key: string, defaultValue: string = ''): string {
	const value = formData.get(key);
	return value !== null && value !== undefined ? value.toString() : defaultValue;
}
function convertToMySQLDateTime(datetimeInput) {
    const date = new Date(datetimeInput);
  
    if (!isNaN(date.getTime())) {
      // Ensure the input is valid
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');
      
      // Return formatted MySQL datetime string: 'YYYY-MM-DD HH:MM:SS'
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    } else {
      throw new Error('Invalid date string');
    }
  }
  
export async function load(): Promise<LoadResult> {
	let mysqlconn = await mysqlconnFn();
	try {
		const events: Event[] = await mysqlconn
			.query(
				`
            SELECT 
                E.eventID,
                DATE_FORMAT(E.eventStart, '%Y-%m-%d %H:%i:%s') AS eventStart,
                DATE_FORMAT(E.eventEnd, '%Y-%m-%d %H:%i:%s') AS eventEnd,
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
                events E
            JOIN 
                finances P ON E.paymentID = P.id`
			)
			.then(([rows]) => {
				return rows.map((row: any) => ({
					...row,
					eventDate: parseDate(row.eventDate) // Convert to Date object
				}));
			});
            // console.log(events);
		let employeeResults: { [key: number]: Employee[] } = {};
		let equipmentResults: { [key: number]: Equipment[] } = {};
        let serviceResults: { [key: number]: Services[] } = {};

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
                    eventemployee EE 
                JOIN 
                    employee EM ON EE.employeeID = EM.id
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
                    eventequipment EEQ 
                JOIN 
                    equipments EQ ON EEQ.equipmentID = EQ.id
                WHERE 
                    EEQ.eventID = ${event.eventID};`
				)
				.then(([rows]) => {
					equipmentResults[event.eventID] = rows;
				})
		);

        const servicePromises = events.map((event) =>
            mysqlconn
                .query(
                    `SELECT 
                        S.id AS serviceID,
                        S.name AS serviceName,
                        S.Price AS servicePrice,
                        S.Inclusion AS serviceInclusion,
                        S.rate AS serviceRate
                    FROM 
                        serviceevent ES
                    JOIN 
                        services S ON ES.serviceid = S.ID
                    WHERE 
                        ES.eventID = ${event.eventID};`
                )
                .then(([rows]) => {
                    serviceResults[event.eventID] = rows;
                })
        );


		const allEmployees: allEmployOriginal[] = await mysqlconn
			.query(`SELECT * FROM employee`)
			.then(([rows]) => rows);
		const allEquipment: allEquipOriginal[] = await mysqlconn
			.query(`SELECT * FROM equipments`)
			.then(([rows]) => rows);
        const allServices: Services[] = await mysqlconn
			.query(`SELECT * FROM services`)
			.then(([rows]) => rows);

		// Wait for all promises to complete
		await Promise.all([...employeePromises, ...equipmentPromises, ...servicePromises]);

        return {
            eventResults: events,
            employeeResults,
            equipmentResults,
            serviceResults, 
            allEmployees,
            allEquipment,
            allServices,
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
        const eventStartRaw = getStringValue(form, 'eventStart');
        const eventEndRaw = getStringValue(form, 'eventEnd');
        const eventStart = convertToMySQLDateTime(eventStartRaw)
        const eventEnd = convertToMySQLDateTime(eventEndRaw);
        // const eventDate = formatDateToMySQL(eventDateRaw);  // Ensure this conversion is correct
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
        const servicesNeededJson = getStringValue(form, 'servicesNeeded', '[]');

        const employeesNeeded = JSON.parse(employeesNeededJson);
        const equipmentNeeded = JSON.parse(equipmentNeededJson);
        const servicesNeeded = JSON.parse(servicesNeededJson);

        console.log("Employees Needed:", employeesNeeded);
        console.log("Equipment Needed:", equipmentNeeded);
        console.log("Services Needed:", servicesNeeded);

        let connection;

        try {
            connection = await mysqlconnFn();
            await connection.beginTransaction();


            // Check if eventID exists in the events table
            const [eventExists] = await connection.query(`SELECT 1 FROM events WHERE eventID = ?`, [eventID]);
            if (!eventExists.length) {
                // Insert new event if it doesn't exist
                await connection.query(
                    `INSERT INTO events (eventID, eventName, eventStart, eventClientName, eventClientContact, eventVenue, eventType, additionalRequests, paymentID, eventEnd)
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    [eventID, eventName, eventStart, eventClientName, eventClientContact, eventVenue, eventType, additionalRequests, paymentID, eventEnd]
                );
            } else {
                // Update existing event details
                await connection.query(
                    `UPDATE events SET
                    eventName = ?,
                    eventStart = ?,
                    eventEnd = ?,
                    eventClientName = ?,
                    eventClientContact = ?,
                    eventVenue = ?,
                    eventType = ?,
                    additionalRequests = ?,
                    paymentID = ?
                    WHERE eventID = ?`,
                    [eventName, eventStart,eventEnd , eventClientName, eventClientContact, eventVenue, eventType, additionalRequests, paymentID, eventID]
                );
            }

            for (const employee of employeesNeeded) {
                const [overlapResult] = await connection.query(
                    `SELECT COUNT(*) AS overlapCount
                    FROM eventemployee EE
                    JOIN events E ON EE.eventID = E.eventID
                    WHERE EE.employeeID = ?
                    AND (
                        (E.eventStart < ? AND E.eventEnd > ?)
                    )`,
                    [employee.value, eventEnd, eventStart]
                );
            
                if (overlapResult[0].overlapCount > 0) {
                    throw new Error(
                        `Employee ID ${employee.value} is already assigned to another event that overlaps with this time range.`
                    );
                }
            }
            
            for (const equipment of equipmentNeeded) {
                const [overlappingEvents] = await connection.query(
                    `SELECT COUNT(*) AS count
                    FROM eventequipment EEQ
                    JOIN events E ON EEQ.eventID = E.eventID
                    WHERE EEQ.equipmentID = ?
                    AND (
                        (E.eventStart <= ? AND E.eventEnd > ?) OR
                        (E.eventStart < ? AND E.eventEnd >= ?)
                    )
                    AND E.eventID != ?`,
                    [equipment.value, eventEnd, eventStart, eventEnd, eventStart, eventID]
                );
            
                if (overlappingEvents[0].count > 0) {
                    throw new Error(`Equipment ID ${equipment.value} is already assigned to an overlapping event.`);
                }
            }

            for (const service of servicesNeeded) {
                const [overlappingEvents] = await connection.query(
                    `SELECT COUNT(*) AS count
                    FROM serviceevent ES
                    JOIN events E ON ES.eventID = E.eventID
                    WHERE ES.serviceID = ?
                    AND (
                        (E.eventStart <= ? AND E.eventEnd > ?) OR
                        (E.eventStart < ? AND E.eventEnd >= ?)
                    )
                    AND E.eventID != ?`,
                    [service.value, eventEnd, eventStart, eventEnd, eventStart, eventID]
                );
            
                if (overlappingEvents[0].count > 0) {
                    throw new Error(`Service ID ${service.value} is already assigned to an overlapping event.`);
                }
            }

            // Enforce the "no more than 3 events per day" rule
            for (const employee of employeesNeeded) {
                const [eventCount] = await connection.query(
                    `SELECT COUNT(*) AS count
                    FROM eventemployee EE
                    JOIN events E ON EE.eventID = E.eventID
                    WHERE EE.employeeID = ? 
                    AND DATE(E.eventStart) = (
                        SELECT DATE(eventStart) FROM events WHERE eventID = ?
                    )`,
                    [employee.value, eventID]
                );

                if (eventCount[0].count >= 3) {
                    throw new Error(`Employee ID ${employee.value} is already assigned to 3 events on the same day.`);
                }
            }

            // Clear and reassign employees if the rule is satisfied
            await connection.query(`DELETE FROM eventemployee WHERE eventID = ?`, [eventID]);
            for (const employee of employeesNeeded) {
                await connection.query(`INSERT INTO eventemployee (eventID, employeeID) VALUES (?, ?)`, [eventID, employee.value]);
            }
            

            // Enforce the "no more than max events per day" rule for equipment based on its status
            for (const equipment of equipmentNeeded) {
                // Fetch equipment status
                const [equipmentInfo] = await connection.query(
                    `SELECT status FROM equipments WHERE id = ?`,
                    [equipment.value]
                );

                if (!equipmentInfo.length) {
                    throw new Error(`Equipment ID ${equipment.value} not found.`);
                }

                const equipmentStatus = equipmentInfo[0].status;
                let maxEvents;

                // Determine max events based on equipment status
                switch (equipmentStatus) {
                    case "In-Studio":
                        maxEvents = 3;
                        break;
                    case "Deployed":
                        maxEvents = 2;
                        break;
                    case "For Repair":
                    case "For Replacement":
                    case "For Testing":
                        maxEvents = 1;
                        break;
                    case "Lost":
                    case "Retired":
                        throw new Error(`Equipment ID ${equipment.value} (${equipmentStatus}) cannot be assigned to events.`);
                    default:
                        throw new Error(`Unknown equipment status: ${equipmentStatus}`);
                }

                // Check the count of events assigned to this equipment on the same day
                const [eventCount] = await connection.query(
                    `SELECT COUNT(*) AS count
                    FROM eventequipment EEQ
                    JOIN events E ON EEQ.eventID = E.eventID
                    WHERE EEQ.equipmentID = ?
                    AND DATE(E.eventStart) = (
                        SELECT DATE(eventStart) FROM events WHERE eventID = ?
                    )`,
                    [equipment.value, eventID]
                );

                if (eventCount[0].count >= maxEvents) {
                    throw new Error(
                        `Equipment ID ${equipment.value} (${equipmentStatus}) is already assigned to ${eventCount[0].count} events on the same day. Max allowed: ${maxEvents}.`
                    );
                }
            }



            // Clear and reassign equipment
            await connection.query(`DELETE FROM eventequipment WHERE eventID = ?`, [eventID]);
            for (const equipment of equipmentNeeded) {
                await connection.query(`INSERT INTO eventequipment (eventID, equipmentID) VALUES (?, ?)`, [eventID, equipment.value]);
            }

            await connection.query(`DELETE FROM serviceevent WHERE eventID = ?`, [eventID]);
            for (const service of servicesNeeded) {
                await connection.query(`INSERT INTO serviceevent (eventID, serviceID) VALUES (?, ?)`, [eventID, service.value]);
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
