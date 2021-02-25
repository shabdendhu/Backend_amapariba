const db = require("../db");
const response = require("../model/response");
const Joi = require("joi");
class Order {
	async get_all_orders(req, res) {
		let rows = await db.get_rows("select * from orders", []);
		res.json(response(true, "success", rows));
	}
	async make_new_order(req, res) {
		const { body } = req;
		let q =
			"insert into `orders` ( `product_id`, `order_date`, `status`, `user_id`,`product_amt`) values(?,?,?,?,?)";
		const insert_res = await db.query(q, [
			body.product_id,
			body.order_date,
			body.status,
			body.user_id,
			body.product_amt,
		]);
		if (insert_res.affectedRows >= 1) {
			res.json(response(true, "Created successfully", insert_res));
		} else {
			res.json(response(true, "something went wrong", insert_res));
		}
	}
}
module.exports = new Order();
