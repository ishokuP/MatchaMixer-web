import { mysqlconnFn } from "$lib/db/mysql";
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: "dw0yb2ova",
  api_key: "786712415546285",
  api_secret: "e7WkI-Pi09e9AUnacjZudinlhqM"
});

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
  imagePath: string;
}

interface LoadResult {
  data: Services[];
  equipmentResults: { [key: number]: Equipment[] };
  allEquipment: Equipment[];
}

function getStringValue(formData: FormData, key: string, defaultValue: string = ''): string {
  const value = formData.get(key);
  return value !== null && value !== undefined ? value.toString() : defaultValue;
}

export async function load(): Promise<LoadResult> {
  let mysqlconn = await mysqlconnFn();
  try {
    const results = await mysqlconn
      .query("SELECT * FROM services;")
      .then(([rows]) => rows.map(row => ({ ...row }))); // Convert to POJO

    let equipmentResults: { [key: number]: Equipment[] } = {};
    console.log('here!!!!!!!!!!!!!!!!!');

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
                  EEQ.serviceID = ?;`, [service.id]
        )
        .then(([rows]) => {
          equipmentResults[service.id] = rows.map(row => ({ ...row })); // Convert to POJO
        })
    );
    await Promise.all(equipmentPromises);

    const allEquipment: Equipment[] = await mysqlconn
      .query(`SELECT * FROM equipments`)
      .then(([rows]) => rows.map(row => ({ ...row }))); // Convert to POJO

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

    console.log("Updating Service:", serviceID, serviceName);

    let imagePath: string | null = null;

    try {
      const connection = await mysqlconnFn();

      if (image && image.size > 0) {
        const arrayBuffer = await image.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const uploadResult = await new Promise((resolve, reject) => {
          cloudinary.uploader.upload_stream({ folder: "services" }, (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }).end(buffer);
        });

        imagePath = (uploadResult as any).secure_url;
      }

      const [existingService] = await connection.query(
        `SELECT id FROM services WHERE id = ?`, 
        [serviceID]
      );
      
      if (existingService.length > 0) {
        // Update existing service
        await connection.execute(
          `UPDATE services SET name = ?, price = ?, inclusion = ?, rate = ?, imagepath = ? WHERE id = ?`,
          [serviceName, servicePrice, serviceInclusion, serviceRate, imagePath, serviceID]
        );
      } else {
        // Generate a new unique ID
        const [maxId] = await connection.query(`SELECT MAX(id) AS maxID FROM services`);
        const newServiceID = (maxId[0].maxID || 0) + 1; // Ensure a new unique ID
      
        // Insert new service with a unique ID
        await connection.execute(
          `INSERT INTO services (id, name, price, inclusion, rate, imagepath) VALUES (?, ?, ?, ?, ?, ?);`,
          [newServiceID, serviceName, servicePrice, serviceInclusion, serviceRate, imagePath]
        );
      }

      await connection.query(`DELETE FROM serviceequipment WHERE serviceID = ?`, [serviceID]);
      for (const equipment of equipmentNeeded) {
        await connection.query(
          `INSERT INTO serviceequipment (serviceID, equipmentID) VALUES (?, ?)`,
          [serviceID, equipment.value]
        );
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

    console.log("Deleting Service ID:", serviceID);

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
