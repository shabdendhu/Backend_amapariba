// import mysql from "mysql";
// import config from "./config";
const mysql = require("mysql");
const config = require("./config");
var connection = mysql.createConnection(config.mysqldb);
//
// var connection;
// function handleDisconnect() {
//   connection = mysql.createConnection(config.mysqldb); // Recreate the connection, since the old one cannot be reused.
//   connection.connect(function onConnect(err) {
//     // The server is either down
//     if (err) {
//       // or restarting (takes a while sometimes).
//       console.log("error when connecting to db:", err);
//       setTimeout(handleDisconnect, 10000); // We introduce a delay before attempting to reconnect,
//     } else {
//       console.log("connected successfully");
//     } // to avoid a hot loop, and to allow our node script to
//   }); // process asynchronous requests in the meantime.
//   // If you're also serving http, display a 503 error.
//   connection.on("error", function onError(err) {
//     console.log("db error", err);
//     if (err.code == "PROTOCOL_CONNECTION_LOST") {
//       handleDisconnect();
//     } else {
//       throw err;
//     }
//   });
// }
// handleDisconnect();

//
connection.connect(function (err) {
  if (err) throw err;
});
const db = {
  query: function (sql, params) {
    return new Promise((resolve, reject) => {
      connection.query(sql, params, (err, result) => {
        if (err) {
          console.log(err);
          resolve(null);
        } else resolve(result);
      });
    });
  },
  get_row: function (sql, params) {
    return new Promise((resolve, reject) => {
      connection.query(sql, params, (err, result) => {
        if (err || result.length == 0) {
          resolve(null);
        } else resolve(result[0]);
      });
    });
  },
  get_rows: function (sql, params) {
    return new Promise((resolve, reject) => {
      connection.query(sql, params, (err, result) => {
        if (err || result.length == 0) {
          resolve([]);
        } else resolve(result);
      });
    });
  },
  build_query: function (sql, params) {
    const query = connection.format(sql, params);
    return query;
  },
};
module.exports = db;
