// import productController from "../products/product-controller";
const productController = require("../products/product-controller");
const userController = require("../controller/user-controller");
module.exports = (app, mainpath) => {
  app.route(mainpath + "/test-api").get((req, res) => {
    res.send("test api is working");
  });
  app.route(mainpath + "/get-products").get(productController.get_products);
  app
    .route(mainpath + "/get-products/:id")
    .get(productController.get_products_by_id);
  app
    .route(mainpath + "/create_new_product")
    .post(productController.add_new_product);
  app
    .route(mainpath + "/update-product/:product_id")
    .post(productController.update_product);
  app
    .route(mainpath + "/deleat-peoduct/:product_id")
    .post(productController.delete_product);
  app
    .route(mainpath + "/get-product-category")
    .get(productController.get_product_category);
  app
    .route(mainpath + "/make-new-product-category")
    .post(productController.make_new_product_category);
  app
    .route(mainpath + "/get-product-qnt-options/:id")
    .get(productController.get_product_qnt_option);
  app
    .route(mainpath + "/get-products-by-category/:id")
    .get(productController.get_products_by_category);
  app
    .route(mainpath + "/get-users-details")
    .post(userController.get_user_details);
  app
    .route(mainpath + "/register-new-user")
    .post(userController.register_new_user);
};
