import { mysqlconnFn } from "$lib/db/mysql";
import fs from 'fs/promises';
import path from 'path';
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
    data: Services[];
    equipmentResults: { [key: number]: Equipment[] };
    allEquipment: allEquipOriginal[];
}
function getStringValue(formData: FormData, key: string, defaultValue: string = ''): string {
	const value = formData.get(key);
	return value !== null && value !== undefined ? value.toString() : defaultValue;
}

export async function load():Promise<LoadResult>{
  let mysqlconn = await mysqlconnFn();
  try {
    const results = await mysqlconn
      .query("SELECT * FROM services;")
      .then(function ([rows,fields]) {
        return rows;
      });

      let equipmentResults: { [key: number]: Equipment[] } = {};
      console.log('here!!!!!!!!!!!!!!!!!')

      const equipmentPromises = results.map((service) =>
        mysqlconn
          .query(
            `SELECT 
                      EQ.id AS equipmentID,
                      EQ.name AS equipmentName,
                      EQ.status AS equipmentStatus,
                      EQ.Econdition AS equipmentCondition
                  FROM 
                      serviceequipment EEQ 
                  JOIN 
                      equipments EQ ON EEQ.equipmentID = EQ.id
                  WHERE 
                      EEQ.serviceID = ${service.id};`
          )
          .then(([rows]) => {
            equipmentResults[service.id] = rows;
          })
      );
      await Promise.all(equipmentPromises);

      const allEquipment: allEquipOriginal[] = await mysqlconn
			.query(`SELECT * FROM equipments`)
			.then(([rows]) => rows);



    return {
      data: results,
      allEquipment,
      equipmentResults
    };
  } catch (error) {
    console.error("Got an error!!!");
    console.log(error);
    throw error;
  }
}


/** @type {import('./$types').Actions} */
export const actions = {
  update: async ({ request }) => {
      const formUpdated = await request.formData();
      const serviceID = formUpdated.get('serviceID');
      const serviceName = formUpdated.get('serviceName');
      const servicePrice = formUpdated.get('servicePrice');
      const serviceRate = formUpdated.get('serviceRate');
      const serviceInclusion = formUpdated.get('serviceInclusion');
      const image = formUpdated.get('serviceImage') as File;

      const equipmentNeededJson = getStringValue(formUpdated, 'equipmentNeeded', '[]');


      const equipmentNeeded = JSON.parse(equipmentNeededJson);

      console.log("Equipment Needed:", equipmentNeeded);


      console.log(formUpdated);
      console.log("save clicked");

      let imagePath: string | null = null;


      try {
          const connection = await mysqlconnFn();

          // Check if the serviceID exists
          const [existingService] = await connection.query(
              `SELECT 1 FROM services WHERE id = ?`, [serviceID]
          );

            if (image && image.name) {
                const uploadDir = path.join('static/uploads/');
                await fs.mkdir(uploadDir, { recursive: true });

                // Rename file (sanitize name, add timestamp)
                const fileExtension = path.extname(image.name);
                const sanitizedFilename = String(serviceName).replace(/\s+/g, '_'); // Replace spaces with underscores
                const newFilename = `${sanitizedFilename}_${Date.now()}${fileExtension}`;
                const filePath = path.join(uploadDir, newFilename);

                // Save file
                const buffer = Buffer.from(await image.arrayBuffer());
                await fs.writeFile(filePath, buffer);

                // Set relative path for DB storage
                imagePath = `/uploads/${newFilename}`;
            }

          if (existingService.length > 0) {
              // Update existing service
              await connection.execute(`
                  UPDATE services SET
                      name = ?,
                      price = ?,
                      inclusion = ?,
                      rate = ?,
                      imagepath = ?
                  WHERE id = ?`,
                  [serviceName, servicePrice, serviceRate, serviceInclusion, serviceID, imagePath]
              );
          } else {
              // Insert new service
              await connection.execute(`
                  INSERT INTO services (id, name, price, inclusion, rate, imagepath ) VALUES (?, ?, ?, ?, ?, ?)`,
                  [serviceID, serviceName, servicePrice, serviceInclusion, serviceRate, imagePath]
              );

              
          }

            // Clear and reassign equipment
            await connection.query(`DELETE FROM serviceequipment WHERE serviceID = ?`, [serviceID]);
            for (const equipment of equipmentNeeded) {
                await connection.query(`INSERT INTO serviceequipment (serviceID, equipmentID) VALUES (?, ?)`, [serviceID, equipment.value]);
            }

          return { status: 200 };
      } catch (error) {
          console.error('Failed to update service:', error);
          return { status: 500, body: { error: 'Failed to update service.' } };
      }
  },
  delete: async ({ request }) => {
      const formDeleted = await request.formData();
      const serviceID = formDeleted.get('serviceID');

      console.log(formDeleted);
      console.log("delete clicked");

      try {
          const connection = await mysqlconnFn();
          await connection.execute(`DELETE FROM services WHERE id = ?`, [serviceID]);

          return { status: 200 };
      } catch (error) {
          console.error('Failed to delete service:', error);
          return { status: 500, body: { error: 'Failed to delete service.' } };
      }
  }
};