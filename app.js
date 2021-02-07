const express = require("express");
const customerappRoutes = require("./routes/customer");
const app = express();
app.use(express.json());
customerappRoutes(app, "/customer-app");

module.exports = app;
