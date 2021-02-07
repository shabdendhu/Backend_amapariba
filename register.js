const mysqlConnection = require("./connection");

const Joi = require("joi");
const express = require("express");
const register = express();

register.use(express.json());

register.get("/registered-list", (req, res) => {
  mysqlConnection.query(
    "SELECT * FROM database_1.`users`;",
    (err, rows, fields) => {
      if (!err) {
        // res.send(rows);
        console.log(rows);
      } else {
        console.log(rows);
      }
    }
  );
});
register.get("/registered-list/:id", (req, res) => {
  mysqlConnection.query(
    "SELECT * FROM database_1.`users` WHERE id = ?",
    [req.params.id],
    (err, rows, fields) => {
      // if (err) {
      //   res.send({ err: err });
      // }
      // if (SpeechRecognitionResult.length > 0) {
      //   res.send(result);
      // } else {
      //   res.send({ message: "Worng username/password combination" });
      // }
      if (!err) {
        res.send(rows);
      } else {
        console.log(err);
      }
    }
  );
});

register.post("/new-registration-request", (req, res) => {
  mysqlConnection.query(
    "insert into database_1.`users` values('" +
      req.body.id +
      "','" +
      req.body.first_name +
      "','" +
      req.body.last_name +
      "'," +
      req.body.password +
      ")",

    (err, rows, fields) => {
      if (!err) {
        res.send(rows);
      } else {
        console.log(err);
      }
    }
  );
});

function validateCourse(course) {
  const schema = {
    name: Joi.string()
      .min(3)
      .required()
  };
  return Joi.validate(course, schema);
}

module.exports = register;
