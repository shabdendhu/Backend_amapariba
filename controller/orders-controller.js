const db = require("../db");
const response = require("../model/response");
const Joi = require("joi");
const reqSchema = {
  makeNewOrder: {
    order_date: Joi.string().required(),
    status: Joi.string().required(),
    user_id: Joi.string().required(),
    product_id: Joi.number().required(),
    product_amt: Joi.string().required(),
    delivery_address: Joi.string().required(),
    mobile: Joi.string().required(),
    postal_coad: Joi.string().required(),
    land_mark: Joi.string().required(),
    delivery_time: Joi.string().required(),
    total_price: Joi.number().required(),
    payment_status: Joi.string().required(),
    dalivery_date: Joi.string().required(),
  },
};

class Order {
  async get_all_orders(req, res) {
    let rows = await db.get_rows("select * from orders", []);
    res.json(response(true, "success", rows));
  }
  async make_new_order(req, res) {
    const { body } = req;
    const result = Joi.validate(body, reqSchema.makeNewOrder);
    if (result.error) {
      res.json(response(false, result.error.message, result.error));
      return;
    }
    let q =
      "INSERT INTO `database_2`.`orders` ( `order_date`, `status`, `user_id`, `product_id`, `product_amt`, `delivery_address`, `mobile`, `postal_coad`, `land_mark`, `delivery_time`, `total_price`, `payment_status`, `dalivery_date`) VALUES ( ?, ?, ?, ?,?, ?, ?,?, ?, ?, ?, ?,?);";
    const insert_res = await db.query(q, [
      body.product_id,
      body.order_date,
      body.status,
      body.user_id,
      body.product_amt,
      body.delivery_address,
      body.mobile,
      body.postal_coad,
      body.land_mark,
      body.delivery_time,
      body.total_price,
      body.payment_status,
      body.dalivery_date,
    ]);
    if (insert_res.affectedRows >= 1) {
      res.json(response(true, "Ordered successfully", insert_res));
    } else {
      res.json(response(true, "something went wrong", insert_res));
    }
  }
}
module.exports = new Order();
