// import path from "path";
// import db from "../db";
// import response from "../model/response";
const db = require("../db");
const response = require("../model/response");
const Joi = require("joi");
const reqSchema = {
  addUpdateNewProduct: {
    product_id: Joi.number(),
    product_name: Joi.string().required(),
    product_price: Joi.number().required(),
    unit_quantity: Joi.string().required(),
    discount: Joi.number().required(),
    image_url: Joi.string(),
    product_category_id: Joi.number().required(),
    default_amt: Joi.number().required()
  },
  addProductCategory: {
    category_name: Joi.string().required(),
    category_img: Joi.string().required()
  }
};
class product {
  async get_products(req, res) {
    let rows = await db.get_rows("select * from product", []);
    res.json(response(true, "success", rows));
  }
  async get_products_by_id(req, res) {
    let rows = await db.get_row("select * from product where product_id=?", [
      req.params.id
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
      body.default_amt
    ]);
    if (insert_res.affectedRows >= 1) {
      res.json(response(true, "Created successfully", insert_res));
    }
  }
  async update_product(req, res) {
    const { body } = req;
    const result = Joi.validate(body, reqSchema.addUpdateNewProduct);
    if (result.error) {
      res.json(response(false, result.error.message, result.error));
    }
    let q =
      "update product set  product_name=?, product_price=?, unit_quantity=?,discount=?,image_url=?,product_category_id=?,default_amt=? where product_id=?";

    const update_res = await db.query(q, [
      body.product_name,
      body.product_price,
      body.unit_quantity,
      body.discount,
      body.image_url,
      body.product_category_id,
      body.default_amt,
      body.product_id
    ]);
    if (update_res.affectedRows >= 1) {
      res.json(response(true, "updated succeccfully", {}));
    }
  }
  async delete_product(req, res) {
    const product_id = req.params.product_id;
    let deleteRes = await db.query("DELETE FROM product WHERE product_id=?", [
      product_id
    ]);
    if (deleteRes.affectedRows >= 1) {
      res.json(response(true, "deleted succeccfully", {}));
    }
  }
  async get_product_category(req, res) {
    let rows = await db.get_rows("select * from product_category");
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
      body.category_img
    ]);
    if (insert_res.affectedRows >= 1) {
      res.json(response(true, "Created successfully", insert_res));
    }
  }
  async get_product_qnt_option(req, res) {
    let rows = await db.get_rows(
      "SELECT * FROM product_qnt_options WHERE product_id = ?",
      [req.params.id]
    );
    res.json(response(true, "success", rows));
  }
  async get_products_by_category(req, res) {
    let rows = await db.get_rows(
      "SELECT * FROM product WHERE product_category_id = ?",
      [req.params.id]
    );
    res.json(response(true, "success", rows));
  }
}
module.exports = new product();
