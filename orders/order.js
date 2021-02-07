const mysqlConnection = require("../connection");
const express = require("express");
const orders = express();

orders.get("/get-order-list", (req, res) => {
  mysqlConnection.query(
    "SELECT * FROM database_1.orders;",
    (err, rows, fields) => {
      if (!err) {
        res.send({ message: "success", status: true, data: rows });
      } else {
        res.send({ message: err.message, status: false });
      }
    }
  );
});
orders.post("/make-new-order", (req, res) => {
  mysqlConnection.query(
    "insert into`database_1`.`orders` ( `product_id`, `order_date`, `status`, `user_id`,`product_amt`) values('" +
      req.body.product_id +
      "','" +
      req.body.order_date +
      "','" +
      req.body.status +
      "','" +
      req.body.user_id +
      "','" +
      req.body.product_amt +
      "')",
    (err, rows, fields) => {
      if (!err) {
        res.send({ message: "ordered successfully", status: true });
      } else {
        res.send({ message: err.message, status: false });
      }
    }
  );
});
module.exports = orders;
