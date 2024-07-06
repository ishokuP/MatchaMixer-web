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
	update : async ({request}) =>{
	  const formUpdated = await request.formData();
  
	  // TODO Add query
	  console.log(formUpdated)
	  console.log("save clicked")
	  return { status: 303, headers: { Location: '/' } };
	},
	delete : async ({request}) =>{
	  const formDeleted = await request.formData();
	  console.log(formDeleted) 
	  console.log("delete clicked")
  
	  // TODO Add query
	  return { status: 303, headers: { Location: '/' } };
	}
  };