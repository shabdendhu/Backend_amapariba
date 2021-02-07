const mysqlConnection = require("../connection");
const express = require("express");
const productQntOption = express();

productQntOption.get("/get-product-qnt-options/:id", (req, res) => {
  mysqlConnection.query(
    "SELECT * FROM database_1.`product_qnt_options` WHERE product_id = ?",
    [req.params.id],
    (err, rows, fields) => {
      if (!err) {
        res.send({ message: "sucess", status: true, data: rows });
      } else {
        res.send({ message: err.message, status: false });
      }
    }
  );
});

module.exports = productQntOption;
