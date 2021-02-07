const db = require("../db");
const response = require("../model/response");
const Joi = require("joi");
const reqSchema = {
  getUserDetails: {
    mobile_no: Joi.number()
      .required()
      .min(1000000000)
      .max(9999999999)
      .label("Mobile no."),
    password: Joi.string()
      .required()
      .max(20)
  },
  registerNewUser: {
    mobile_no: Joi.number()
      .required()
      .min(1000000000)
      .max(9999999999)
      .label("Mobile no."),
    password: Joi.string()
      .required()
      .max(20)
  }
};
class User {
  async get_user_details(req, res) {
    const { body } = req;
    const result = Joi.validate(body, reqSchema.getUserDetails);
    if (result.error) {
      res.json(response(false, result.error.details[0].message, result.error));
      return;
    }
    let rows = await db.get_rows("SELECT * FROM users WHERE mobile_no = ?", [
      body.mobile_no
    ]);
    if (rows.length > 0) {
      if (rows[0].password === body.password) {
        res.json(response(true, "success", rows));
      } else {
        res.json(response(false, "username & password doesn't match"));
      }
    } else {
      res.json(response(true, "Please enter correct username", rows));
    }
  }
  async register_new_user(req, res) {
    const { body } = req;
    const result = Joi.validate(body, reqSchema.registerNewUser);
    if (result.error) {
      res.json(response(false, result.error.details[0].message, result.error));
      return;
    }

    let exist_user = await db.get_rows(
      "SELECT * FROM users WHERE mobile_no = ?",
      [body.mobile_no]
    );
    if (exist_user.length > 0) {
      if (exist_user[0].mobile_no === body.mobile_no) {
        res.json(response(false, "Mobile number already exist", {}));
        return;
      }
    }
    let q = "INSERT INTO users (`mobile_no`, `password`) VALUES (?,?);";
    const insert_res = await db.query(q, [body.mobile_no, body.password]);
    if (insert_res.affectedRows >= 1) {
      let rows = await db.get_rows("SELECT * FROM users WHERE mobile_no = ?", [
        body.mobile_no
      ]);
      res.json(response(true, "Created successfully", rows));
    }
  }
}
module.exports = new User();
