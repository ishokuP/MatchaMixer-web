import { mysqlconnFn } from '$lib/db/mysql';
import { v2 as cloudinary } from 'cloudinary';
import { fail, redirect } from '@sveltejs/kit';

// Configure Cloudinary using environment variables
/*cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});*/

cloudinary.config({
    cloud_name: "dw0yb2ova",
    api_key: "786712415546285",
    api_secret: "e7WkI-Pi09e9AUnacjZudinlhqM"
});

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
                    eq.filepath AS EquipmentImagePath,
                    GROUP_CONCAT(ev.eventName SEPARATOR ', ') AS AssignedEvents
                FROM 
                    equipments eq
                LEFT JOIN 
                    eventequipment eveq ON eq.id = eveq.equipmentID
                LEFT JOIN 
                    events ev ON eveq.eventID = ev.eventID
                GROUP BY 
                    eq.id, eq.name, eq.status, eq.Econdition, eq.filepath;
            `)
            .then(function ([rows, fields]) {
                return rows.map(row => ({
                    id: row.EquipmentID,
                    name: row.EquipmentName,
                    status: row.EquipmentStatus,
                    Econdition: row.EquipmentCondition,
                    imagePath: row.EquipmentImagePath,  // Now stores Cloudinary URL
                    AssignedEvents: row.AssignedEvents ? row.AssignedEvents.split(', ') : []
                }));
            });
        return {
            data: results
        };
    } catch (error) {
        console.error('Error fetching data:', error);
        return error;
    }
}

/** @type {import('./$types').Actions} */
export const actions = {
    update: async ({ request }) => {
        const form = await request.formData();
        
        const equipmentID = form.get('equipID');
        const name = form.get('equipName');
        const status = form.get('equipStatus');
        const Econdition = form.get('equipCondition');
        const image = form.get('equipImage') as File;

        console.log("Form Data for Update:", { equipmentID, name, status, Econdition, image });

        let imagePath: string | null = null;

        try {
            const connection = await mysqlconnFn();

            // Handle Cloudinary Upload if a new image is provided
            if (image && image.name) {
                const buffer = Buffer.from(await image.arrayBuffer());
                const base64String = buffer.toString('base64');
                
                const uploadResponse = await cloudinary.uploader.upload(`data:image/png;base64,${base64String}`, {
                    folder: 'equipment_images',
                    public_id: `${name}_${Date.now()}`
                });

                imagePath = uploadResponse.secure_url;
            }

            // Update equipment in MySQL
            await connection.execute(`
                UPDATE equipments SET
                    name = ?,
                    status = ?,
                    Econdition = ?,
                    filepath = COALESCE(?, filepath)
                WHERE id = ?`, 
                [name, status, Econdition, imagePath, equipmentID]
            );

            console.log("Equipment updated successfully");
            return { status: 200, headers: { Location: '/success' } };
        } catch (error) {
            console.error('Failed to update equipment:', error);
            return { status: 500, body: { error: 'Failed to update equipment.' } };
        }
    },

    delete: async ({ request }) => {
        const form = await request.formData();
        const equipmentID = form.get('equipID');

        console.log("Form Data for Deletion:", { equipmentID });

        try {
            const connection = await mysqlconnFn();
            await connection.execute(`DELETE FROM equipments WHERE id = ?`, [equipmentID]);

            console.log("Equipment deleted successfully");
            return { status: 204, headers: { Location: '/success' } };
        } catch (error) {
            console.error('Failed to delete equipment:', error);
            return { status: 500, body: { error: 'Failed to delete equipment.' } };
        }
    },

    add: async ({ request }) => {
        const form = await request.formData();
        const name = form.get('equipName');
        const status = form.get('equipStatus');
        const Econdition = form.get('equipCondition');
        const image = form.get('equipImage') as File;

        console.log("Form Data for New Equipment:", { name, status, Econdition, image });

        let imagePath: string | null = null;

        try {
            const connection = await mysqlconnFn();
            
            const [rows]: any = await connection.execute(
                `SELECT id FROM equipments ORDER BY id DESC LIMIT 1`
            );
    
            let newId = "eq001"; // Default if no records exist
    
            if (rows.length > 0) {
                const lastId = rows[0].id;  // e.g., "eq002"
                const numPart = parseInt(lastId.substring(2)); // Extract "002" -> 2
                const nextNum = (numPart + 1).toString().padStart(3, '0'); // "3" -> "003"
                newId = `eq${nextNum}`; // Format back to "eq003"
            }
            // Upload image to Cloudinary
            if (image && image.name) {
                const buffer = Buffer.from(await image.arrayBuffer());
                const base64String = buffer.toString('base64');

                const uploadResponse = await cloudinary.uploader.upload(`data:image/png;base64,${base64String}`, {
                    folder: 'equipment_images',
                    public_id: `${name}_${Date.now()}`
                });

                imagePath = uploadResponse.secure_url;
            }

            // Insert new equipment into MySQL
            await connection.execute(`
                INSERT INTO equipments (id, name, status, Econdition, filepath)
                VALUES (?,?, ?, ?, ?)`, 
                [newId,name, status, Econdition, imagePath]);

            console.log("Cloudinary URL:", imagePath);
            console.log("New equipment added successfully");
            return { status: 200, headers: { Location: '/success' } };
        } catch (error) {
            console.error('Failed to add new equipment:', error);
            return { status: 500, body: { error: 'Failed to add new equipment.' } };
        }
    }
};
