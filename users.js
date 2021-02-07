const mysqlConnection = require("./connection");

const Joi = require("joi");
const express = require("express");
const users = express();

users.use(express.json());

users.get("/get-user-list", (req, res) => {
  mysqlConnection.query(
    "SELECT * FROM database_1.users;",
    (err, rows, fields) => {
      if (!err) {
        res.send(rows);
        console.log(rows);
      } else {
        console.log(err);
      }
    }
  );
});
users.post("/authentication", (req, res) => {
  var username = req.body.user_name;
  var password = req.body.password;
  mysqlConnection.query(
    "SELECT * FROM database_1.users WHERE user_name = ?",
    [username],
    async function(error, results, fields) {
      if (error) {
        res.send({
          code: 400,
          failed: "error ocurred"
        });
      } else {
        if (results.length > 0) {
          if (password === results[0].password) {
            res.send({
              code: 200,
              success: "login sucessfull",
              login: true
            });
          } else {
            res.send({
              code: 204,
              success: "Email and password does not match",
              login: false
            });
          }
        } else {
          res.send({
            code: 206,
            success: "Email does not exits"
          });
        }
      }
    }
  );
});
users.post("/new-user-request", (req, res) => {
  mysqlConnection.query(
    "SELECT * FROM database_1.users;",
    (err, rows, fields) => {
      if (rows.length > 0) {
        const newid = rows.length + 1;
        mysqlConnection.query(
          // INSERT INTO `database_1`.`users` (`id`, `user_name`, `password`) VALUES ('5', ',kjhjh', 'hj');

          "insert into database_1.`users`  (`id`, `user_name`, `password`) values('" +
            newid +
            "','" +
            req.body.user_name +
            "'," +
            req.body.password +
            ")",
          (err, rows, fields) => {
            if (!err) {
              res.send({ message: "success", status: true, data: rows });
            } else {
              res.send({ message: err.message, status: false });
            }
          }
        );
      } else {
        console.log(err);
      }
    }
  );
});
module.exports = users;
