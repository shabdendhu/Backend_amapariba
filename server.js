const express = require("express");
const bodyParser = require("body-parser");
const product = require("./products/product");
const register = require("./register");
const ImageUploader = require("./image-uploader");
const productCategory = require("./products/productCategory");
const users = require("./users");
const orders = require("./orders/order");
const productQntOption = require("./products/productQntOption");
const productsByCategory = require("./products/productsByCategory");

var app = express();
var cors = require("cors");

app.use(express.static("./public"));

app.use(cors());
app.use(bodyParser.json());
app.use("/custumer-api/products", product);
app.use("/custumer-api/register", register);
app.use("/custumer-api/users", users);
app.use("/upload", ImageUploader);
app.use("/product-category", productCategory);
app.use("/custumer-api/orders", orders);
app.use("/custumer-api/products", productQntOption);
app.use("/custumer-api/products", productsByCategory);
// app.use("/productWithImage", productWithImage);

const port = process.env.PORT || 9000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
