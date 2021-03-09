// import mysql from "mysql";
// import config from "./config";
const mysql = require("mysql");
const config = require("./config");
var connection = mysql.createConnection(config.mysqldb);
connection.connect(function (err) {
  if (err) throw err;
});
const db = {
  query: function (sql, params) {
    return new Promise((resolve, reject) => {
      connection.query(sql, params, (err, result) => {
        if (err) {
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
