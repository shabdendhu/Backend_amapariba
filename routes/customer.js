// import productController from "../products/product-controller";
const productController = require("../controller/product-controller");
const userController = require("../controller/user-controller");
const recipeController = require("../controller/recipe-controller");
const orderController = require("../controller/orders-controller");
module.exports = (app, mainpath) => {
  app.route(mainpath + "/test-api").get((req, res) => {
    res.send("test api is working");
  });
  app.route(mainpath + "/get-products").get(productController.get_products);
  app
    .route(mainpath + "/get-products/:id")
    .get(productController.get_products_by_id);
  app
    .route(mainpath + "/get-product-category")
    .post(productController.get_product_category);
  app
    .route(mainpath + "/get-all-product-category")
    .get(productController.get_all_product_category);
  app
    .route(mainpath + "/get-product-qnt-options/:id")
    .get(productController.get_product_qnt_option);
  app
    .route(mainpath + "/get-products-by-category/:id")
    .get(productController.get_products_by_category);
  app
    .route(mainpath + "/login-with-password")
    .post(userController.login_with_password);
  app
    .route(mainpath + "/register-new-user")
    .post(userController.register_new_user);
  app
    .route(mainpath + "/search-product-by-name")
    .post(productController.get_product_by_name);
  app
    .route(mainpath + "/get-product-details/:id")
    .get(productController.get_product_details);
  app
    .route(mainpath + "/get-recipe-list/:is_popular")
    .get(recipeController.get_popular_recipe_list);
  app
    .route(mainpath + "/get-recipe-list")
    .get(recipeController.get_recipe_list);
  app
    .route(mainpath + "/get-recipe-detail/:id")
    .get(recipeController.get_recipe_detail);
  app
    .route(mainpath + "/add-product-to_basket")
    .post(productController.add_product_to_basket);
  app
    .route(mainpath + "/get-basket-items")
    .post(productController.get_basket_items);
  app.route(mainpath + "/make-new-order").post(orderController.make_new_order);
  app
    .route(mainpath + "/remove-product-from-basket")
    .post(productController.remove_product_from_basket);
  app
    .route(mainpath + "/get-seasons-best-items/:is_popular")
    .get(productController.get_seasons_best_items);
  app
    .route(mainpath + "/get-seasons-best-items")
    .get(productController.get_seasons_best_items);
  app
    .route(mainpath + "/get-search-suggestion")
    .post(productController.get_search_suggestion);
  app.route(mainpath + "/get-units").get(productController.get_units);
  app.route(mainpath + "/get-top-deals").get(productController.get_top_deals);
  app
    .route(mainpath + "/update-user-details/:id")
    .post(userController.update_user_details);
  app
    .route(mainpath + "/get-user-details")
    .post(userController.get_user_details);
};
