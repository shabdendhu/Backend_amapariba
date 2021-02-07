const mysql = require("mysql");

var mysqlConnection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Iti143.subu",
  dtatbase: "ecoVagitable",
  multipleStatements: true
});
mysqlConnection.connect(err => {
  if (!err) {
    console.log("Connected");
  } else {
    console.log("Connection Failed");
  }
});

module.exports = mysqlConnection;
