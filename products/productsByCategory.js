const mysqlConnection = require("../connection");

const express = require("express");
const productsByCategory = express();

productsByCategory.use(express.json());
productsByCategory.get("/get-productsbycategory/:id", (req, res) => {
  console.log(req.file);
  mysqlConnection.query(
    "SELECT * FROM database_1.`product` WHERE product_category_id = ?",
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
module.exports = productsByCategory;
