import { mysqlconnFn } from '$lib/db/mysql';


interface Event {
    eventID: number;
    eventName: string;
    // Add other event fields as needed
}

interface Employee {
    employeeID: number;
    employeeName: string;
    employeeRole: string;
    email: string;
    contactNumber: string;
}

interface allEmployOriginal{
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
}

export async function load(): Promise<LoadResult> {
	
    let mysqlconn = await mysqlconnFn();
    try {
        const events: Event[] = await mysqlconn
            .query(`SELECT 
						E.*,
						P.status AS paymentStatus,
						P.cost AS paymentCost
					FROM 
						Events E
					JOIN 
						Payments P ON E.paymentID = P.id;
					`)
            .then(([rows]) => rows);
        
        let employeeResults: { [key: number]: Employee[] } = {};
        let equipmentResults: { [key: number]: Equipment[] } = {};

        const employeePromises = events.map(event => 
            mysqlconn.query(
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
            ).then(([rows]) => {
                employeeResults[event.eventID] = rows;  
            })
        );

        const equipmentPromises = events.map(event => 
            mysqlconn.query(
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
            ).then(([rows]) => {
                equipmentResults[event.eventID] = rows;  
            })
        );

		const allEmployees: allEmployOriginal[] = await mysqlconn.query(
			`SELECT * FROM Employee`
		).then(([rows]) => rows);

        // Wait for all promises to complete
        await Promise.all([...employeePromises, ...equipmentPromises]);

		// console.log(equipmentResults)

        return {
            eventResults: events,
            employeeResults,
            equipmentResults,
			allEmployees
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
		// console.log(form)
        
        // Single item entries
        const eventID = form.get('eventID');
        const eventName = form.get('eventName');
        const paymentID = form.get('paymentID');
        const clientName = form.get('clientName');
        const eventTime = form.get('eventTime');
        const eventVenue = form.get('eventVenue');
        const eventType = form.get('eventType');
        const clientNum = form.get('clientNum');
        const paymentStatus = form.get('paymentStatus');
        const additionalReq = form.get('additionalReq');


        // Entries expected to be arrays
        const employees = form.getAll('employees').filter(emp => emp); // Filter out empty values

        // Handle potential multiple date entries; if array length > 1, process accordingly
        const eventDates = form.getAll('eventDate').filter(date => date); // Removes empty strings


		console.log(employees)
		console.log('update clicked!');

        // Implement your logic to process this data, such as saving to a database

		// 	let mysqlconn = await mysqlconnFn();
		// 	const formUpdated = await request.formData();
		// 	const eventID = formUpdated.get('eventID');
		// 	const eventName = formUpdated.get('eventName');
		// 	const eventType = formUpdated.get('eventType');
		// 	const clientName = formUpdated.get('clientName');
		// 	const clientNum = formUpdated.get('clientNum');

		// 	const eventTime = formUpdated.get('eventTime');
		// 	const eventVenue = formUpdated.get('eventVenue');
		// 	const packageType = formUpdated.get('packageType');
		// 	const addOn = formUpdated.get('addOn');
		// 	const staff1 = formUpdated.get('staff1');
		// 	console.log(staff1)
		// 	const staff2 = formUpdated.get('staff2');
		// 	const staff3 = formUpdated.get('staff3');
		// 	const staff4 = formUpdated.get('staff4');
		// 	const equipNeeded = formUpdated.get('equipNeeded');
		// 	const additionalReq = formUpdated.get('additionalReq');
		// 	const paymentStatus = formUpdated.get('paymentStatus');

		// 	const eventDate = formUpdated.get('eventDate');

		// // TODO: Fix a bug in when you click edit the date format cannot be accepted
		// 	console.log(eventDate);
		// 	try {
		// 		const sql = `
		//       INSERT INTO event
		//       (eventID, eventName, eventType, clientName, clientNum, eventDate, eventTime, eventVenue, packageType, addOn, staff1, staff2, staff3, staff4, equipNeeded, additionalReq, paymentStatus)
		//       VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
		//       ON DUPLICATE KEY UPDATE
		//       eventName = VALUES(eventName),
		//       eventType = VALUES(eventType),
		//       clientName = VALUES(clientName),
		//       clientNum = VALUES(clientNum),
		//       eventDate = VALUES(eventDate),
		//       eventTime = VALUES(eventTime),
		//       eventVenue = VALUES(eventVenue),
		//       packageType = VALUES(packageType),
		//       addOn = VALUES(addOn),
		//       staff1 = VALUES(staff1),
		//       staff2 = VALUES(staff2),
		//       staff3 = VALUES(staff3),
		//       staff4 = VALUES(staff4),
		//       equipNeeded = VALUES(equipNeeded),
		//       additionalReq = VALUES(additionalReq),
		//       paymentStatus = VALUES(paymentStatus);
		//   `;

		// 		const results = await mysqlconn
		//   .query(sql, [
		// 			eventID,
		// 			eventName,
		// 			eventType,
		// 			clientName,
		// 			clientNum,
		// 			eventDate,
		// 			eventTime,
		// 			eventVenue,
		// 			packageType,
		// 			addOn,
		// 			staff1,
		// 			staff2,
		// 			staff3,
		// 			staff4,
		// 			equipNeeded,
		// 			additionalReq,
		// 			paymentStatus
		// 		]);
		//   results

		// 		return {
		// 			status: 200,
		// 		};
		// 	} catch (error) {
		// 		console.error('Error in upserting event:', error);
		// 		return {
		// 			status: 500,
		// 			body: {
		// 				message: 'Failed to process event'
		// 			}
		// 		};
		// 	}
	},
	delete: async ({ request }) => {
		const formDeleted = await request.formData();
		const formID = formDeleted.get('eventID');
		console.log(formID);
		console.log('delete clicked');

		// TODO Add query
		return { status: 303, headers: { Location: '/' } };
	}
};


