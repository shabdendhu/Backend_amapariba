const express = require("express");
const customerappRoutes = require("./routes/customer");
const adminRoutes = require("./routes/admin");
const app = express();
app.use(express.static(__dirname + "/public"));
var cors = require("cors");
app.use(cors());
app.use(express.json());
customerappRoutes(app, "/customer-app");
adminRoutes(app, "/site-management");

module.exports = app;
