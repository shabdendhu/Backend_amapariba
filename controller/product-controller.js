// import path from "path";
// import db from "../db";
// import response from "../model/response";
const db = require("../db");
const response = require("../model/response");
const Joi = require("joi");
const { get_row } = require("../db");
const reqSchema = {
	addUpdateNewProduct: {
		product_id: Joi.number(),
		product_name: Joi.string().required(),
		product_price: Joi.number().required(),
		unit_quantity: Joi.string().required(),
		discount: Joi.number().required(),
		image_url: Joi.string(),
		product_category_id: Joi.number().required(),
		default_amt: Joi.number().required(),
	},
	addProductCategory: {
		category_name: Joi.string().required(),
		category_img: Joi.string().required(),
	},
	addToBasket: {
		user_id: Joi.number().required(),
		product_id: Joi.number().required(),
	},
	makeNewProductQntOption: {
		quantity: Joi.string().required(),
		product_id: Joi.number().required(),
		price: Joi.number().required(),
		discount: Joi.number().required(),
	},
	makeSeasonsBest: {
		is_popular: Joi.number().required(),
		product_id: Joi.number().required(),
	},
};
class product {
	async get_products(req, res) {
		let rows = await db.get_rows(
			"SELECT product_id,product_name,unit_quantity,image_url,product_category_id,default_amt, ROUND(product_price - (product_price*discount)/100) as discounted_price,product_price,discount FROM database_2.product;",
			[]
		);
		// let discounted_price = [];
		// for (let i = 0; i < rows.length; i++) {
		// 	let discount = parseInt(rows[i].discount) / 100;
		// 	let basic_price = rows[i].product_price;
		// 	discounted_price.push(basic_price - basic_price * discount);
		// }

		res.json(response(true, "success", await rows));
	}
	// async get_product_offers(req, res) {
	// 	let rows = await db.get_rows(
	// 		"SELECT * from product INNER JOIN product_offers ON product.product_id=product_offers.product_id",
	// 		[]
	// 	);
	// 	let discounted_price = [];

	// 	for (let i = 0; i < rows.length; i++) {
	// 		let discount = parseInt(rows[i].discount) / 100;
	// 		let basic_price = rows[i].product_price;
	// 		discounted_price.push(basic_price - basic_price * discount,);
	// 	}
	// 	const data={
	// 		discounted_price
	// 	}
	// 	res.json(response(true, "success", await rows));
	// }
	async get_products_by_id(req, res) {
		let rows = await db.get_row("select * from product where product_id=?", [
			req.params.id,
		]);
		res.json(response(true, "success", rows));
	}
	async add_new_product(req, res) {
		const { body } = req;
		const result = Joi.validate(body, reqSchema.addUpdateNewProduct);
		if (result.error) {
			res.json(response(false, result.error.message, result.error));
			return;
		}
		let q =
			"insert into product ( `product_name`, `product_price`, `unit_quantity`,`discount`,`image_url`,`product_category_id`,`default_amt`) values(?,?,?,?,?,?,?)";
		const insert_res = await db.query(q, [
			body.product_name,
			body.product_price,
			body.unit_quantity,
			body.discount,
			body.image_url,
			body.product_category_id,
			body.default_amt,
		]);
		if (insert_res.affectedRows >= 1) {
			res.json(response(true, "Created successfully", insert_res));
		}
	}
	async add_product_to_basket(req, res) {
		const { body } = req;
		const result = Joi.validate(body, reqSchema.addToBasket);
		if (result.error) {
			res.json(response(false, result.error.message, result.error));
			return;
		}
		let q =
			"INSERT INTO `database_2`.`basket` (`user_id`, `product_id`) VALUES (?,?);";
		const insert_res = await db.query(q, [body.user_id, body.product_id]);
		if (insert_res.affectedRows >= 1) {
			res.json(response(true, "Created successfully", insert_res));
		}
	}
	async remove_product_from_basket(req, res) {
		const { body } = req;
		const delete_req = await db.query("DELETE FROM `basket` WHERE `id`=?", [
			body.id,
		]);
		console.log(delete_req.affectedRows);
		if (delete_req.affectedRows >= 1) {
			res.json(response(true, "deleted succeccfully", {}));
		} else {
			res.json(response(true, "something went wrong", {}));
		}
	}
	async get_basket_items(req, res) {
		const { body } = req;
		console.log(body);
		let basket_rows = await db.get_rows(
			"SELECT * FROM product INNER join basket ON product.product_id=basket.product_id where user_id=?",
			[body.user_id]
		);
		res.json(response(true, "success", basket_rows));
	}
	async update_product(req, res) {
		const { body } = req;
		const result = Joi.validate(body, reqSchema.addUpdateNewProduct);
		if (result.error) {
			res.json(response(false, result.error.message, result.error));
		}
		let q = `update product set  product_name=?, product_price=?, unit_quantity=?,discount=?,image_url=?,product_category_id=?,default_amt=? where product_id=${req.params.id}`;

		const update_res = await db.query(q, [
			body.product_name,
			body.product_price,
			body.unit_quantity,
			body.discount,
			body.image_url,
			body.product_category_id,
			body.default_amt,
		]);
		if (update_res.affectedRows >= 1) {
			res.json(response(true, "updated succeccfully", {}));
		}
	}
	async delete_product(req, res) {
		const product_id = req.params.product_id;
		let deleteRes = await db.query("DELETE FROM product WHERE product_id=?", [
			product_id,
		]);
		if (deleteRes.affectedRows >= 1) {
			res.json(response(true, "deleted succeccfully", {}));
		}
	}
	async get_all_product_category(req, res) {
		let rows = await db.get_rows(
			"select id,category_name,category_img from product_category"
		);
		res.json(response(true, "success", rows));
	}
	async get_product_category(req, res) {
		const { body } = req;
		let rows = await db.get_rows(
			"select id,category_name,category_img from product_category where is_popular=?",
			[body.is_popular]
		);
		res.json(response(true, "success", rows));
	}
	async make_new_product_category(req, res) {
		const { body } = req;
		const result = Joi.validate(body, reqSchema.addProductCategory);
		if (result.error) {
			res.json(response(false, result.error.message, result.error));
			return;
		}
		let q =
			"insert into product_category ( `category_name`, `category_img`) values(?,?)";
		const insert_res = await db.query(q, [
			body.category_name,
			body.category_img,
		]);
		if (insert_res.affectedRows >= 1) {
			res.json(response(true, "Created successfully", insert_res));
		}
	}
	async get_product_qnt_option(req, res) {
		let rows = await db.get_rows(
			"SELECT id,quantity,product_id,price,discount,round( price-(price*discount)/100) as discounted_price FROM database_2.product_qnt_options where product_id=?",
			[req.params.id]
		);
		res.json(response(true, "success", rows));
	}
	async make_product_qnt_option(req, res) {
		const { body } = req;
		const result = Joi.validate(body, reqSchema.makeNewProductQntOption);
		if (result.error) {
			res.json(response(false, result.error.message, result.error));
		}
		let q =
			"INSERT INTO `database_2`.`product_qnt_options` ( `quantity`, `product_id`, `price`, `discount`) VALUES (?, ?, ?, ?)";

		const inseart_res = await db.query(q, [
			body.quantity,
			body.product_id,
			body.price,
			body.discount,
		]);
		if (inseart_res.affectedRows >= 1) {
			res.json(response(true, "updated succeccfully", {}));
		}
	}
	async get_products_by_category(req, res) {
		let rows = await db.get_rows(
			"SELECT product_id,product_name,unit_quantity,image_url,product_category_id,default_amt, ROUND(product_price - (product_price*discount)/100) as discounted_price,product_price,discount FROM database_2.product where product_category_id=?",
			[req.params.id]
		);
		res.json(response(true, "success", rows));
	}
	async get_product_by_name(req, res) {
		let rows = await db.query(
			`SELECT product_name,product_id,product_category_id,image_url,default_amt,unit_quantity FROM product where product_name like "%${req.body.product_name}%" `
		);
		res.json(response(true, "success", rows));
	}
	async get_product_details(req, res) {
		let product = await db.get_row("select * from product where product_id=?", [
			req.params.id,
		]);
		let product_details_row = await db.get_row(
			"SELECT*FROM product_details WHERE product_id=?",
			[req.params.id]
		);
		let product_qnt_option = await db.get_rows(
			"SELECT * FROM product_qnt_options WHERE product_id=?",
			[req.params.id]
		);
		if (product && product_details_row && product_qnt_option) {
			const details = {
				id: product.product_id,
				name: product_details_row.header_name,
				image: product.image_url,
				price: product.product_price,
				pack_size: product_qnt_option,
				about_product: product_details_row.about_product,
			};
			res.json(response(true, "success", details));
		} else {
			res.json(response(false, "something went wrong", []));
		}
	}
	async get_seasons_best_items(req, res) {
		let rows = await db.get_rows(
			"SELECT * FROM product INNER join seasons_best ON product.product_id=seasons_best.product_id"
		);
		res.json(response(true, "success", rows));
	}
	async make_seasons_best_items(req, res) {
		const { body } = req;
		const result = Joi.validate(body, reqSchema.makeSeasonsBest);
		if (result.error) {
			res.json(response(false, result.error.message, result.error));
		}
		let q =
			"INSERT INTO `seasons_best` ( `is_popular`, `product_id`) VALUES ( ?, ?);";

		const inseart_res = await db.query(q, [body.is_popular, body.product_id]);
		if (inseart_res.affectedRows >= 1) {
			res.json(response(true, "created succeccfully", {}));
		}
	}
	async get_search_suggestion(req, res) {
		const { body } = req;
		let product_suggestion = await db.get_rows(
			`SELECT product_name,product_id FROM product where product_name like "%${req.body.product_name}%" `
		);
		let recipe_suggesstion = await db.get_rows(
			`SELECT name,id from recipes where name like "%${body.product_name}%"`
		);
		const suggestion = {
			suggest: product_suggestion.concat(recipe_suggesstion),
		};
		res.json(response(true, "success", suggestion));
	}
}
module.exports = new product();
