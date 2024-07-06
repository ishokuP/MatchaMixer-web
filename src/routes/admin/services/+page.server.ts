import { mysqlconnFn } from "$lib/db/mysql";

export async function load() {
  let mysqlconn = await mysqlconnFn();
  try {
    const results = await mysqlconn
      .query("SELECT * FROM services;")
      .then(function ([rows,fields]) {
              //  console.log(fields);
        return rows;
      });
    // console.log(results)
    return {
      data: results
    };
  } catch (error) {
    console.error("Got an error!!!");
    console.log(error);
    return error;
  }
}


/** @type {import('./$types').Actions} */
export const actions = {
  update: async ({ request }) => {
      const formUpdated = await request.formData();
      const serviceID = formUpdated.get('serviceID');
      const serviceName = formUpdated.get('serviceName');
      const serviceType = formUpdated.get('serviceType');
      const servicePrice = formUpdated.get('servicePrice');
      const serviceRate = formUpdated.get('serviceRate');
      const serviceInclusion = formUpdated.get('serviceInclusion');

      console.log(formUpdated);
      console.log("save clicked");

      try {
          const connection = await mysqlconnFn();

          // Check if the serviceID exists
          const [existingService] = await connection.query(
              `SELECT 1 FROM services WHERE id = ?`, [serviceID]
          );

          if (existingService.length > 0) {
              // Update existing service
              await connection.execute(`
                  UPDATE services SET
                      name = ?,
                      type = ?,
                      price = ?,
                      rate = ?,
                      inclusion = ?
                  WHERE id = ?`,
                  [serviceName, serviceType, servicePrice, serviceRate, serviceInclusion, serviceID]
              );
          } else {
              // Insert new service
              await connection.execute(`
                  INSERT INTO services (id, name, type, price, rate, inclusion) VALUES (?, ?, ?, ?, ?, ?)`,
                  [serviceID, serviceName, serviceType, servicePrice, serviceRate, serviceInclusion]
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