const db = require("../db");
const response = require("../model/response");
const Joi = require("joi");

class Recipe {
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
		let recipeDetails_row = await db.get_row(
			"select * from recipe_details where recipe_id=?",
			[req.params.id]
		);
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
}
module.exports = new Recipe();
