import { mysqlconnFn } from '$lib/db/mysql';

export async function load() {
    let mysqlconn = await mysqlconnFn();
    try {
        const results = await mysqlconn
            .query(`
                SELECT 
                    eq.id AS EquipmentID,
                    eq.name AS EquipmentName,
                    eq.status AS EquipmentStatus,
                    eq.Econdition AS EquipmentCondition,
                    GROUP_CONCAT(ev.eventName SEPARATOR ', ') AS AssignedEvents
                FROM 
                    equipments eq
                LEFT JOIN 
                    eventequipment eveq ON eq.id = eveq.equipmentID
                LEFT JOIN 
                    events ev ON eveq.eventID = ev.eventID
                GROUP BY 
                    eq.id, eq.name, eq.status, eq.Econdition;
            `)
            .then(function ([rows, fields]) {
                return rows.map(row => ({
                    id: row.EquipmentID,
                    name: row.EquipmentName,
                    status: row.EquipmentStatus,
                    Econdition: row.EquipmentCondition,
                    AssignedEvents: row.AssignedEvents ? row.AssignedEvents.split(', ') : []
                }));
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
