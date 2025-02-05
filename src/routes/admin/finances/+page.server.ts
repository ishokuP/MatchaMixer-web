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
    employeeRole?: string;
    email?: string;
    contactNumber?: string;
}


interface LoadResult {
    eventResults: Event[];
    employeeResults: { [key: number]: Employee[] };
}


  
export async function load(): Promise<LoadResult> {
	let mysqlconn = await mysqlconnFn();
	try {
				// Fetch all events
                const events: Event[] = await mysqlconn.query(
                    `SELECT DISTINCT e.eventID, e.eventName 
                     FROM events e`
                ).then(([rows]) => rows);
                
        
                // Fetch employees grouped by event
                const eventEmployeeMap: { [key: number]: Employee[] } = {};
        
                const employeeRows = await mysqlconn.query(
                    `SELECT ee.eventID, emp.ID AS employeeID, emp.Name AS employeeName
                    FROM eventemployee ee
                    JOIN employee emp ON ee.employeeID = emp.ID`
                ).then(([rows]) => rows);
        
                // Organize employees by eventID
                employeeRows.forEach((row: any) => {
                    if (!eventEmployeeMap[row.eventID]) {
                        eventEmployeeMap[row.eventID] = [];
                    }
                    eventEmployeeMap[row.eventID].push({
                        employeeID: row.employeeID,
                        employeeName: row.employeeName
                    });
                });

                const financesdata = await mysqlconn.query(
                      `SELECT * FROM financesemployees`   
                ).then(([rows]) => rows);
        
                // Merge employees into event results
                const eventResults = events.map(event => ({
                    ...event,
                    employees: eventEmployeeMap[event.eventID] || [] // Ensure employees exist even if empty
                }));
        
                return { eventResults, employeeResults: eventEmployeeMap,  };
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

        let connection;

        try {
            connection = await mysqlconnFn();
            await connection.beginTransaction();

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
        // const formDeleted = await request.formData();
        // const eventID = formDeleted.get('eventID');
        // console.log(eventID);
        console.log('delete clicked');

        // if (!eventID) {
        //     return {
        //         status: 400,
        //         body: { error: 'Event ID is required for delete operations.' }
        //     };
        // }

        let connection;

        // try {
        //     connection = await mysqlconnFn();
        //     await connection.beginTransaction();

        //     // Fetch the paymentID associated with the event
        //     const [event] = await connection.query(`SELECT paymentID FROM events WHERE eventID = ?`, [eventID]);
        //     const paymentID = event[0]?.paymentID;

        //     // Delete associated records from eventemployee table
        //     await connection.query(`DELETE FROM eventemployee WHERE eventID = ?`, [eventID]);

        //     // Delete associated records from eventequipment table
        //     await connection.query(`DELETE FROM eventequipment WHERE eventID = ?`, [eventID]);

        //     // Delete the event itself
        //     await connection.query(`DELETE FROM events WHERE eventID = ?`, [eventID]);

        //     // Optionally, delete the associated payment record if it exists
        //     if (paymentID) {
        //         await connection.query(`DELETE FROM payments WHERE id = ?`, [paymentID]);
        //     }

        //     await connection.commit();

        //     return {
        //         status: 303,
        //         headers: { Location: '/' }
        //     };
        // } catch (error) {
        //     console.error('Failed to delete event details:', error);
        //     if (connection) {
        //         console.log("Rollback due to error");
        //         await connection.rollback();
        //     }
        //     return { status: 500, body: { error: 'Failed to delete event.' } };
        // }
    }
};
