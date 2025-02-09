import mysql from "mysql2/promise";

let mysqlconn = null;

export function mysqlconnFn() {
  if (!mysqlconn) {
    // used for development with MAMP
    // mysqlconn = mysql.createConnection({
    //   host: "127.0.0.1",
    //   user: "root",
    //   password: "",
    //   database: "statedata",
    // });
    mysqlconn = mysql.createConnection({
      host: "junction.proxy.rlwy.net",
      port: 30491,
      user: "root",
      password: "VtKjycSrQrqrdTRYbHfarUqsgvYXdqAI",
      database: "railway",
    });
  }

  return mysqlconn;
}