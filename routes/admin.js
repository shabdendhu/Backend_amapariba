const productController = require("../controller/product-controller");
const userController = require("../controller/user-controller");
const recipeController = require("../controller/recipe-controller");
const orderController = require("../controller/orders-controller");
module.exports = (app, mainpath) => {
	app.route(mainpath + "/get-recipe").get(recipeController.get_recipe);
	app
		.route(mainpath + "/make-new-recipe")
		.post(recipeController.make_new_recipe);
	app
		.route(mainpath + "/get-recipe-detail")
		.post(recipeController.get_recipe_detail);
	app
		.route(mainpath + "/add-new-product")
		.post(productController.add_new_product);
	app.route(mainpath + "/get-products").get(productController.get_products);
	app
		.route(mainpath + "/get-products-by-id")
		.post(productController.get_products_by_id);
	app
		.route(mainpath + "/update-product/:id")
		.post(productController.update_product);
	app
		.route(mainpath + "/delete-product/:product_id")
		.post(productController.delete_product);
	app
		.route(mainpath + "/get-all-product-category")
		.get(productController.get_all_product_category);
	app
		.route(mainpath + "/make-new-product-category")
		.post(productController.make_new_product_category);
	app
		.route(mainpath + "/make-product-qnt-option")
		.post(productController.make_product_qnt_option);
	app
		.route(mainpath + "/make-seasons-best-items")
		.post(productController.make_seasons_best_items);
	app.route(mainpath + "/get-all-orders").get(orderController.get_all_orders);
	app.route(mainpath + "/make-new-order").post(orderController.make_new_order);
	app
		.route(mainpath + "/async-ingridients-to-recipe")
		.post(recipeController.async_ingridients_to_recipe);
};
