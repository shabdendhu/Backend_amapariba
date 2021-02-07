const mysqlConnection = require("../connection");
const express = require("express");
const productCategory = express();

productCategory.get("/get-product-category", (req, res) => {
  mysqlConnection.query(
    "SELECT * FROM database_1.product_category;",
    (err, rows, fields) => {
      if (!err) {
        res.send({ message: "success", status: true, data: rows });
      } else {
        res.send({ message: err.message, status: false });
      }
    }
  );
});
productCategory.post("/make-product-category", (req, res) => {
  mysqlConnection.query(
    "SELECT * FROM database_1.product_category;",
    (err, rows, fields) => {
      if (!err) {
        const newid = rows.length + 1;
        mysqlConnection.query(
          "insert into`database_1`.`product_category` (`id`, `category_name`, `category_img`) values('" +
            newid +
            "','" +
            req.body.category_name +
            "','" +
            req.body.category_img +
            "')",
          (err, rows, fields) => {
            if (!err) {
              res.send({ message: "sucesses", status: true, data: rows });
            } else {
              res.send({ message: err.message, status: false });
            }
          }
        );
      } else {
        res.send({ message: err.message, status: false });
      }
    }
  );
});
module.exports = productCategory;
