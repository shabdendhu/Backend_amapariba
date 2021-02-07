const mysqlConnection = require("../connection");

const Joi = require("joi");
const express = require("express");
const response = require("../model/response");
const product = express();

product.use(express.json());

product.get("/", (req, res) => {
  res.send("HELLOW WORLD!!!!");
});
product.get("/get-product-list", (req, res) => {
  mysqlConnection.query(
    "SELECT * FROM database_1.`product`",
    (err, rows, fields) => {
      if (!err) {
        res.json(response(true, "sucesses", rows));
      } else {
        res.send({ message: err.message, status: false });
      }
    }
  );
});
product.get("/get-product-list/:id", (req, res) => {
  mysqlConnection.query(
    "SELECT * FROM database_1.`product` WHERE product_id = ?",
    [req.params.id],
    (err, rows, fields) => {
      if (!err) {
        res.send(rows);
      } else {
        console.log(err);
      }
    }
  );
});

product.post("/get-product-list", (req, res) => {
  mysqlConnection.query(
    "insert into`database_1`.`product` ( `product_name`, `product_price`, `unit_quantity`,`discount`,`image_url`,`product_category_id`,`default_amt`) values('" +
      req.body.product_name +
      "','" +
      req.body.product_price +
      "','" +
      req.body.unit_quantity +
      "','" +
      req.body.discount +
      "','" +
      req.body.image_url +
      "','" +
      req.body.product_category_id +
      "','" +
      req.body.default_amt +
      "')",

    (err, rows, fields) => {
      if (!err) {
        res.send(rows);
      } else {
        console.log(err);
      }
    }
  );
});

product.put("/edit-product/:id", (req, res) => {
  mysqlConnection.query(
    "UPDATE database_1.`product` SET product_name='" +
      req.body.product_name +
      "', product_price='" +
      req.body.product_price +
      "', discount='" +
      req.body.discount +
      "', unit_quantity='" +
      req.body.unit_quantity +
      "' WHERE product_id=" +
      req.params.id,
    function(error, results, fields) {
      if (error) throw error;
      res.end(JSON.stringify(results));
    }
  );
});

product.delete("/delet-product/:id", (req, res) => {
  mysqlConnection.query(
    "DELETE FROM database_1.`product` WHERE product_id=" + req.params.id + "",
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

module.exports = product;
