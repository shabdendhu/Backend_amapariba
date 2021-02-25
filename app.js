const express = require("express");
const customerappRoutes = require("./routes/customer");
const app = express();
var cors = require("cors");
app.use(cors());
app.use(express.json());
customerappRoutes(app, "/customer-app");

module.exports = app;
