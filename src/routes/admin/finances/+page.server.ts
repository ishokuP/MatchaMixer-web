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
    financesdata: any[];
}

function getStringValue(formData: FormData, key: string, defaultValue: string = ''): string {
	const value = formData.get(key);
	return value !== null && value !== undefined ? value.toString() : defaultValue;
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

        // Fetch the finances data for employee payouts (status and amount)
        const financesdata = await mysqlconn.query(
            `SELECT * FROM financesemployees`   
        ).then(([rows]) => rows);

        // Merge event data with employee payout information (status and amount)
        const eventResults = events.map(event => {
            // Find corresponding finances data for each event
            const financesForEvent = financesdata.filter(finance => finance.eventID === event.eventID);

            // Merge the finances data with employee details for each event
            const employeesWithPayouts = (eventEmployeeMap[event.eventID] || []).map(employee => {
                // Find the corresponding payout status for this employee
                const payout = financesForEvent.find(finance => finance.employeeName === employee.employeeName);
                return {
                    ...employee,
                    status: payout ? payout.status : 'Unpaid', // Default to 'Unpaid' if not found
                    payoutAmount: payout ? payout.amount : 0 // Add the payout amount if found
                };
            });

            return {
                ...event,
                employees: employeesWithPayouts
            };
        });

        return { eventResults, financesdata, employeeResults: eventEmployeeMap };
    } catch (error) {
        console.error('Got an error:', error);
        throw error;
    }
}

/** @type {import('./$types').Actions} */
export const actions = {
    update: async ({ request }) => {
        const form = await request.formData();
        const eventName = getStringValue(form, 'eventName');
        const employeeName = getStringValue(form, 'employeeName');
        const payoutAmount = getStringValue(form, 'payoutAmount');
        const currentStatus = getStringValue(form, 'currentStatus');

        let connection;

        try {
            connection = await mysqlconnFn();
            await connection.beginTransaction();

            // Check if the employee already has a record in financesemployees
            const [existingRecord] = await connection.query(
                `SELECT * FROM financesemployees WHERE eventName = ? AND employeeName = ?`,
                [eventName, employeeName]
            );

            if (existingRecord.length === 0) {
                // If no record exists, insert a new one with 'Unpaid' status
                await connection.query(
                    `INSERT INTO financesemployees (eventName, employeeName, amount, status) 
                     VALUES (?, ?, ?, ?)`,
                    [eventName, employeeName, payoutAmount, 'Unpaid'] // Default to 'Unpaid'
                );
                console.log("Inserted new record into financesemployees.");
            } else {
                // If record exists, toggle the status
                if (currentStatus === 'Paid') {
                    await connection.query(
                        `UPDATE financesemployees 
                         SET status = 'Unpaid' 
                         WHERE eventName = ? AND employeeName = ?`,
                        [eventName, employeeName]
                    );
                    console.log(`Updated status to 'Unpaid' for ${employeeName}`);
                } else {
                    await connection.query(
                        `UPDATE financesemployees 
                         SET status = 'Paid' 
                         WHERE eventName = ? AND employeeName = ?`,
                        [eventName, employeeName]
                    );
                    console.log(`Updated status to 'Paid' for ${employeeName}`);
                }
            }

            await connection.commit();
            return { status: 200, body: { success: true } };
        } catch (error) {
            console.error('Failed to update event details:', error);
            if (connection) {
                console.log("Rollback due to error");
                await connection.rollback();
            }
            return { status: 500, body: { error: 'Failed to update event.' } };
        }
    }
};

