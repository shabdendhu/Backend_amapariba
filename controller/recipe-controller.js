const db = require("../db");
const response = require("../model/response");
const Joi = require("joi");
const reqSchema = {
	makeNewRecipe: {
		name: Joi.string().required(),
		icon: Joi.string().required(),
		is_popular: Joi.number().required(),
		detail_header: Joi.string().required(),
		cook_process: Joi.string().required(),
	},
	asyncProductToRecipe: {
		recipe_id: Joi.string().required(),
		product_id: Joi.string().required(),
		amt_for_recipe: Joi.string().required(),
		image: Joi.string().required(),
		default_amount: Joi.string().required(),
	},
};
class Recipe {
	async get_recipe(req, res) {
		let rows = await db.get_rows("select * from recipes");
		res.json(response(true, "success", rows));
	}
	async get_popular_recipe_list(req, res) {
		let rows = await db.get_rows(
			"select id,name,icon,detail_header from recipes WHERE is_popular=1",
			[req.params.is_popular]
		);
		res.json(response(true, "success", rows));
	}
	async get_recipe_list(req, res) {
		let rows = await db.get_rows(
			"select id,name,icon,detail_header from recipes"
		);
		res.json(response(true, "success", rows));
	}
	async get_recipe_detail(req, res) {
		let recipe_row = await db.get_row("select * from recipes WHERE id=?", [
			req.params.id,
		]);

		let recipeIngridients_row = await db.get_rows(
			"select * from recipe_ingridients where recipe_id=?",
			[req.params.id]
		);
		const details = {
			id: recipe_row.id,
			name: recipe_row.detail_header,
			cooking_process: recipe_row.cook_process,
			image: recipe_row.icon,
			recipeIngridients: recipeIngridients_row,
		};
		res.json(response(true, "success", details));
	}
	async make_new_recipe(req, res) {
		const { body } = req;
		const result = Joi.validate(body, reqSchema.makeNewRecipe);
		if (result.error) {
			res.json(response(false, result.error.message, result.error));
			return;
		}
		let q =
			"INSERT INTO `database_2`.`recipes` ( `name`, `icon`, `is_popular`, `detail_header`, `cook_process`) VALUES (?, ?,?, ?, ?);";
		const insert_res = await db.query(q, [
			body.name,
			body.icon,
			body.is_popular,
			body.detail_header,
			body.cook_process,
		]);
		if (insert_res.affectedRows >= 1) {
			res.json(response(true, "Created successfully", insert_res));
		}
	}
	async async_ingridients_to_recipe(req, res) {
		const { body } = req;
		const result = Joi.validate(body, reqSchema.asyncProductToRecipe);
		if (result.error) {
			res.json(response(false, result.error.message, result.error));
			return;
		}
		let q =
			"INSERT INTO `recipe_ingridients` (`recipe_id`, `product_id`, `amt_for_recipe`, `image`, `default_amount`) VALUES ( ?, ?, ?, ?, ?);";
		const insert_res = await db.query(q, [
			body.recipe_id,
			body.product_id,
			body.amt_for_recipe,
			body.image,
			body.default_amount,
		]);
		if (insert_res.affectedRows >= 1) {
			res.json(response(true, "Created successfully", insert_res));
		}
	}
}
module.exports = new Recipe();
