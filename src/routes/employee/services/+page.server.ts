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

