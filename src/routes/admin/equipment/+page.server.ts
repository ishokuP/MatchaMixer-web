import { mysqlconnFn } from '$lib/db/mysql';
import fs from 'fs/promises';
import path from 'path';
import { fail, redirect } from '@sveltejs/kit';

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

/** @type {import('./$types').Actions} */
export const actions = {
    update: async ({ request }) => {
        const form = await request.formData();
        function generateRandomID(): number {
            return Math.floor(Math.random() * 1000000);  // Generates a random number between 0 and 999,999
        }
        
        // Use the function to generate a random equipmentID
        const equipmentID = generateRandomID();
        
        const name = form.get('equipName');
        const status = form.get('equipStatus');
        const Econdition = form.get('equipCondition');
        const image = form.get('equipImage') as File;
        console.log("Form Data for Save:", { equipmentID, name, status, Econdition, image });

        let imagePath: string | null = null;

        try {
            const connection = await mysqlconnFn();
                        // Handle Image Upload
                        if (image && image.name) {
                            const uploadDir = path.join('static/uploads/');
                            await fs.mkdir(uploadDir, { recursive: true });
            
                            // Rename file (sanitize name, add timestamp)
                            const fileExtension = path.extname(image.name);
                            const sanitizedFilename = String(name).replace(/\s+/g, '_'); // Replace spaces with underscores
                            const newFilename = `${sanitizedFilename}_${Date.now()}${fileExtension}`;
                            const filePath = path.join(uploadDir, newFilename);
            
                            // Save file
                            const buffer = Buffer.from(await image.arrayBuffer());
                            await fs.writeFile(filePath, buffer);
            
                            // Set relative path for DB storage
                            imagePath = `/uploads/${newFilename}`;
                        }

            // Check if the equipmentID exists
            const [rows] = await connection.query('SELECT 1 FROM equipments WHERE id = ?', [equipmentID]);

            if (rows.length > 0) {
                // If exists, update
                await connection.execute(`
                    UPDATE equipments SET
                        name = ?,
                        status = ?,
                        Econdition = ?,
                        imagePath = COALESCE(?, imagePath) -- Only update if new image is provided
                    WHERE id = ?`, 
                    [name, status, Econdition, imagePath, equipmentID]);

                console.log("Equipment updated successfully");

            } else {
                // Insert new record
                await connection.execute(`
                    INSERT INTO equipments (id, name, status, Econdition, imagePath)
                    VALUES (?, ?, ?, ?, ?)`, 
                    [equipmentID, name, status, Econdition, imagePath]);

                console.log("Equipment added successfully");
            }

            return {
                status: 200, // OK, indicating successful operation
                headers: { Location: '/success' }
            };
        } catch (error) {
            console.error('Failed to save equipment:', error);
            return { status: 500, body: { error: 'Failed to save equipment.' } };
        }
    },
    delete: async ({ request }) => {
        const form = await request.formData();
        const equipmentID = form.get('equipID');
        console.log("Form Data for Deletion:", { equipmentID });

        try {
            const connection = await mysqlconnFn();
            await connection.execute(`
                DELETE FROM equipments WHERE id = ?
            `, [equipmentID]);

            console.log("Equipment deleted successfully");

            return {
                status: 204, // No Content, indicating successful deletion
                headers: { Location: '/success' }
            };
        } catch (error) {
            console.error('Failed to save equipment:', error);
            return { 
                status: 500, 
                body: { error: 'Failed to save equipment.' } 
            };
        }
    },
    add: async ({ request }) => {
        const form = await request.formData();
        const name = form.get('equipName');
        const status = form.get('equipStatus');
        const Econdition = form.get('equipCondition');

        console.log("Form Data for New Equipment:", { name, status, Econdition });

        try {
            const connection = await mysqlconnFn();

            // Insert new equipment into the database
            const [result] = await connection.execute(`
                INSERT INTO equipments (name, status, Econdition)
                VALUES (?, ?, ?)`, [name, status, Econdition]);

            console.log("New equipment added successfully");

            return {
                status: 200,
                headers: { Location: '/success' }
            };
        } catch (error) {
            console.error('Failed to add new equipment:', error);
            return { 
                status: 500, 
                body: { error: 'Failed to add new equipment.' } 
            };
        }
    }
};
