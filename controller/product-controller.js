// import path from "path";
// import db from "../db";
// import response from "../model/response";
const db = require("../db");
const response = require("../model/response");
const Joi = require("joi");
const { get_row } = require("../db");
const {
  get_formdata,
  get_current_datetime,
} = require("../library/commonmethords");
const path = require("path");
// import fs, { readdirSync, readFileSync } from 'fs';
const fs = require("fs");
const reqSchema = {
  addUpdateNewProduct: {
    product_id: Joi.number(),
    product_name: Joi.string().required(),
    product_price: Joi.number().required(),
    unit_quantity: Joi.string().required(),
    discount: Joi.number().required(),
    image_url: Joi.string(),
    product_category_id: Joi.number().required(),
    default_amt: Joi.number().required(),
  },
  addProductCategory: {
    category_name: Joi.string().required(),
    category_img: Joi.string().required(),
    is_popular: Joi.number().required(),
  },
  addToBasket: {
    user_id: Joi.number().required(),
    product_id: Joi.number().required(),
    product_qnt: Joi.string().required(),
    product_price: Joi.number().required(),
    // product_count: Joi.number(),
    product_name: Joi.string().required(),
    image_url: Joi.string().required(),
  },
  makeNewProductQntOption: {
    quantity: Joi.number().required(),
    product_id: Joi.number().required(),
    price: Joi.number().required(),
    discount: Joi.number().required(),
    unit_id: Joi.number().required(),
  },
  makeSeasonsBest: {
    is_popular: Joi.number().required(),
    product_id: Joi.number().required(),
  },
  editSeasonsBest: {
    is_popular: Joi.number().required(),
    id: Joi.number().required(),
  },
};
class product {
  async get_units(req, res) {
    let rows = await db.get_rows("SELECT * FROM database_2.uints;", []);
    res.json(response(true, "success", rows));
  }
  async get_products(req, res) {
    let rows = await db.get_rows(
      "SELECT product_id,product_name,unit_quantity,image_url,product_category_id,default_amt, ROUND(product_price - (product_price*discount)/100) as discounted_price,product_price,discount FROM database_2.product;",
      []
    );
    rows.forEach((element) => {
      element.image_url = `/product_image/${element.image_url}`;
    });
    res.json(response(true, "success", rows));
  }

  async get_products_by_id(req, res) {
    let rows = await db.get_row("select * from product where product_id=?", [
      req.params.id,
    ]);
    res.json(response(true, "success", rows));
  }
  async add_new_product(req, res) {
    const { fields, files } = await get_formdata(req);
    // console.log(files);
    console.log(files.image.path);

    const result = Joi.validate(fields, reqSchema.addUpdateNewProduct);
    if (result.error) {
      res.json(response(false, result.error.message, result.error));
      return;
    }
    let oldPath = files.image.path;
    let now = get_current_datetime();
    now = now.replace(/ /g, "-");
    now = now.replace(/:/g, "-");
    let image_name = `product_image__${now}${path.extname(files.image.name)}`;
    let newPath = `${path.dirname(
      require.main.filename
    )}/public/product_image/${image_name}`;

    let q =
      "insert into product ( `product_name`, `product_price`, `unit_quantity`,`discount`,`image_url`,`product_category_id`,`default_amt`) values(?,?,?,?,?,?,?)";
    const insert_res = await db.query(q, [
      fields.product_name,
      fields.product_price,
      fields.unit_quantity,
      fields.discount,
      image_name,
      fields.product_category_id,
      fields.default_amt,
    ]);
    if (insert_res.affectedRows >= 1) {
      fs.rename(oldPath, newPath, (err) => {});
      res.json(response(true, "Created successfully", insert_res));
      return;
    }
  }
  async add_product_to_basket(req, res) {
    const { body } = req;
    const result = Joi.validate(body, reqSchema.addToBasket);
    if (result.error) {
      res.json(response(false, result.error.message, result.error));
      return;
    }
    let q =
      "INSERT INTO basket (`user_id`, `product_id`, `product_qnt`, `product_price`, `product_name`, `image_url`) VALUES (?,?, ?, ?, ?,?);";
    const insert_res = await db.query(q, [
      body.user_id,
      body.product_id,
      body.product_qnt,
      body.product_price,
      body.product_name,
      body.image_url,
    ]);
    console.log(insert_res.insertId);
    if (insert_res) {
      if (insert_res.affectedRows >= 1) {
        let row = await db.get_row("SELECT * FROM basket WHERE id = ?", [
          insert_res.insertId,
        ]);
        res.json(response(true, "Created successfully", row));
      }
    }
  }
  async remove_product_from_basket(req, res) {
    const { body } = req;
    // console.log(body);
    // let row = await db.get_row(
    //   `SELECT id FROM basket where product_id=${body.product_id} and product_qnt=${body.product_qnt} and user_id=${body.user_id};`
    // );

    // if (rows.length > 0) {
    //   console.log(rows);
    // const delete_req = await db.query("DELETE FROM `basket` WHERE `id`=?", [
    //   rows[0].id,
    // ]);
    const delete_req = await db.query(
      "UPDATE `basket` SET `status`='inactive' WHERE `id`=?",
      [body.item_id]
    );
    console.log(body.item_id);
    console.log(delete_req);
    if (delete_req.affectedRows >= 1) {
      res.json(response(true, "deleted succeccfully", delete_req));
    } else {
      res.json(response(true, "something went wrong", {}));
    }
    // } else {
    //   res.json(response(true, "Product Doesnot Exist", {}));
    // }
    // console.log(delete_req);
  }
  async get_basket_items(req, res) {
    const { body } = req;
    console.log(body);
    // let basket_rows = await db.get_rows(
    //   "SELECT * FROM product INNER join basket ON product.product_id=basket.product_id where user_id=?",
    //   [body.user_id]
    // );
    let basket_rows = await db.get_rows(
      `SELECT product_id as id,id as item_id,image_url as image,product_name as name,product_price as price,product_qnt as amount FROM  basket where user_id=${body.user_id} and status="active"`
    );
    res.json(response(true, "success", basket_rows));
  }
  async update_product(req, res) {
    const { fields, files } = await get_formdata(req);
    const { body } = req;
    console.log(body);

    let image_path = await db.get_row(
      `SELECT image_url FROM database_2.product where product_id=${req.params.id};`
    );
    console.log(
      fs.existsSync(`${__dirname}/public/product_image/${image_path}`)
    );

    const result = Joi.validate(fields, reqSchema.addUpdateNewProduct);
    if (result.error) {
      res.json(response(false, result.error.message, result.error));
    }
    let oldPath = files.image.path;
    let now = get_current_datetime();
    now = now.replace(/ /g, "-");
    now = now.replace(/:/g, "-");
    let image_name = `product_image__${now}${path.extname(files.image.name)}`;
    let newPath = `${path.dirname(
      require.main.filename
    )}/public/product_image/${image_name}`;

    let q = `update product set  product_name=?, product_price=?, unit_quantity=?,discount=?,image_url=?,product_category_id=?,default_amt=? where product_id=${req.params.id}`;

    const update_res = await db.query(q, [
      fields.product_name,
      fields.product_price,
      fields.unit_quantity,
      fields.discount,
      image_name,
      fields.product_category_id,
      fields.default_amt,
    ]);
    if (update_res.affectedRows >= 1) {
      if (Object.keys(files).length !== 0) {
        let old_image = image_path;
        old_image = `${path.dirname(
          require.main.filename
        )}/public/product_image/${old_image}`;
        if (fs.existsSync(old_image)) {
          fs.unlink(old_image, (err) => {});
        }
        fs.rename(oldPath, newPath, (err) => {});
      }
      res.json(response(true, "updated succeccfully", {}));
    }
  }
  async delete_product(req, res) {
    const product_id = req.params.product_id;

    let image_path = await db.get_row(
      `SELECT image_url FROM product where product_id=${product_id};`
    );
    if (!image_path) {
      res.json(response(false, "Invalid product_id", {}));
      return;
    }
    let deleteRes = await db.query("DELETE FROM product WHERE product_id=?", [
      product_id,
    ]);
    let old_image = image_path.image_url;
    old_image = `${path.dirname(
      require.main.filename
    )}/public/product_image/${old_image}`;
    console.log(old_image);
    if (fs.existsSync(old_image)) {
      fs.unlink(old_image, (err) => {
        console.log(err);
      });
    }
    if (deleteRes.affectedRows >= 1) {
      res.json(response(true, "deleted succeccfully", {}));
    }
  }
  async get_all_product_category(req, res) {
    let rows = await db.get_rows("select * from product_category");
    // console.log(rows);
    res.json(response(true, "success", rows));
  }
  async get_product_category(req, res) {
    const { body } = req;
    let rows = await db.get_rows(
      "select * from product_category where is_popular=?",
      [body.is_popular]
    );
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
      "INSERT INTO `product_category` (`category_name`, `category_img`, `is_popular`) VALUES (?, ?, ?);";
    const insert_res = await db.query(q, [
      body.category_name,
      body.category_img,
      body.is_popular,
    ]);
    if (insert_res.affectedRows >= 1) {
      res.json(response(true, "Created successfully", insert_res));
    }
  }
  //
  async update_product_category(req, res) {
    const { body } = req;
    const result = Joi.validate(body, reqSchema.addProductCategory);
    if (result.error) {
      res.json(response(false, result.error.message, result.error));
    }
    let q = `UPDATE product_category SET category_name=?, category_img=?, is_popular=? WHERE id=${req.params.id};`;
    const update_res = await db.query(q, [
      body.category_name,
      body.category_img,
      body.is_popular,
    ]);
    if (update_res.affectedRows >= 1) {
      res.json(response(true, "updated succeccfully", {}));
    }
  }
  //
  async delete_product_category(req, res) {
    let deleteRes = await db.query(
      "DELETE FROM `product_category` WHERE `id`=?;",
      [req.params.id]
    );
    if (deleteRes.affectedRows >= 1) {
      res.json(response(true, "deleted succeccfully", {}));
    }
  }
  async get_product_qnt_option(req, res) {
    let rows = await db.get_rows(
      "SELECT *,round( product_qnt_options.price-(product_qnt_options.price*product_qnt_options.discount)/100) as discounted_price FROM product_qnt_options INNER join uints ON product_qnt_options.unit_id=uints.id where product_qnt_options.product_id=?",
      [req.params.id]
    );
    res.json(response(true, "success", rows));
  }
  async make_product_qnt_option(req, res) {
    const { body } = req;
    const result = Joi.validate(body, reqSchema.makeNewProductQntOption);
    if (result.error) {
      res.json(response(false, result.error.message, result.error));
    }
    let q =
      "INSERT INTO `database_2`.`product_qnt_options` ( `quantity`, `product_id`, `price`, `discount`,`unit_id`) VALUES (?, ?, ?, ?,?)";

    const inseart_res = await db.query(q, [
      body.quantity,
      body.product_id,
      body.price,
      body.discount,
      body.unit_id,
    ]);
    if (inseart_res.affectedRows >= 1) {
      res.json(response(true, "created succeccfully", {}));
    }
  }
  async delete_product_qnt_option(req, res) {
    let deleteRes = await db.query(
      "DELETE FROM `product_qnt_options` WHERE `id`=?",
      [req.params.id]
    );
    if (deleteRes.affectedRows >= 1) {
      res.json(response(true, "deleted succeccfully", {}));
    }
  }
  async get_products_by_category(req, res) {
    let rows = await db.get_rows(
      "SELECT product_id,product_name,unit_quantity,image_url,product_category_id,default_amt, ROUND(product_price - (product_price*discount)/100) as discounted_price,product_price,discount FROM database_2.product where product_category_id=?",
      [req.params.id]
    );
    rows.forEach((element) => {
      element.image_url = `/product_image/${element.image_url}`;
    });
    res.json(response(true, "success", rows));
  }
  async get_product_by_name(req, res) {
    let rows = await db.query(
      `SELECT product_name,product_id,product_category_id,image_url,default_amt,unit_quantity,product_price FROM product where product_name like "%${req.body.product_name}%" `
    );
    res.json(response(true, "success", rows));
  }
  async get_product_details(req, res) {
    let product = await db.get_row("select * from product where product_id=?", [
      req.params.id,
    ]);
    // let product_details_row = await db.get_row(
    //   "SELECT*FROM product_details WHERE product_id=?",
    //   [req.params.id]
    // );
    let product_qnt_option = await db.get_rows(
      "SELECT *,round( product_qnt_options.price-(product_qnt_options.price*product_qnt_options.discount)/100) as discounted_price FROM product_qnt_options INNER join units ON product_qnt_options.unit_id=units.unit_id where product_qnt_options.product_id=?",
      [req.params.id]
    );
    if (product && product_qnt_option) {
      const details = {
        // id: product.product_id,
        product: product,
        // name: product_details_row.header_name,
        // image: product.image_url,
        // price: product.product_price,
        pack_size: product_qnt_option,
        // about_product: product_details_row.about_product,
      };
      res.json(response(true, "success", details));
    } else {
      res.json(response(false, "something went wrong", []));
    }
  }
  async get_seasons_best_items(req, res) {
    let rows = [];
    if (req.params.is_popular) {
      rows = await db.get_rows(
        "SELECT product.product_id,product.product_name,product.image_url FROM product INNER join seasons_best ON product.product_id=seasons_best.product_id where is_popular=?",
        [req.params.is_popular]
      );
      rows.forEach((element) => {
        element.image_url = `/product_image/${element.image_url}`;
      });
    } else {
      rows = await db.get_rows(
        "SELECT product.product_id,product.product_name,product.image_url FROM product INNER join seasons_best ON product.product_id=seasons_best.product_id"
      );
      rows.forEach((element) => {
        element.image_url = `/product_image/${element.image_url}`;
      });
    }

    res.json(response(true, "success", rows));
  }
  async delete_seasons_best_items(req, res) {
    const { body } = req;
    let deleteRes = await db.query("DELETE FROM `seasons_best` WHERE `id`=?", [
      body.id,
    ]);
    if (deleteRes) {
      if (deleteRes.affectedRows >= 1) {
        res.json(response(true, "deleted succeccfully", {}));
      }
    }
  }
  async make_seasons_best_items(req, res) {
    const { body } = req;
    const result = Joi.validate(body, reqSchema.makeSeasonsBest);
    if (result.error) {
      res.json(response(false, result.error.message, result.error));
    }
    let q =
      "INSERT INTO `seasons_best` ( `is_popular`, `product_id`) VALUES ( ?, ?);";

    const inseart_res = await db.query(q, [body.is_popular, body.product_id]);
    if (inseart_res.affectedRows >= 1) {
      res.json(response(true, "created succeccfully", {}));
    }
  }
  async edit_seasons_best_items(req, res) {
    const { body } = req;
    const result = Joi.validate(body, reqSchema.editSeasonsBest);
    if (result.error) {
      res.json(response(false, result.error.message, result.error));
    }

    const update_res = await db.query(
      `UPDATE seasons_best SET is_popular=${body.is_popular} WHERE id=${body.id};`
    );
    if (update_res.affectedRows >= 1) {
      res.json(response(true, "updated succeccfully", update_res));
    }
  }
  async get_seasons_best_items_by_product_id(req, res) {
    let rows = await db.get_row(
      "SELECT product.product_id,product.product_name,product.image_url,seasons_best.is_popular,seasons_best.id FROM product INNER join seasons_best ON product.product_id=seasons_best.product_id where product.product_id=?",
      [req.params.product_id]
    );
    res.json(response(true, "success", rows ? rows : []));
  }
  async get_search_suggestion(req, res) {
    const { body } = req;
    let product_suggestion = await db.get_rows(
      `SELECT product_name,product_id FROM product where product_name like "%${req.body.product_name}%" `
    );
    let recipe_suggesstion = await db.get_rows(
      `SELECT name  as product_name,id from recipes where name like "%${body.product_name}%"`
    );
    const suggestion = {
      productSuggest: product_suggestion,
      recipeSuggest: recipe_suggesstion,
    };
    res.json(response(true, "success", suggestion));
  }
  async get_top_deals(req, res) {
    let top_deals = await db.get_rows(
      "SELECT product.product_id,product_name,unit_quantity,image_url,product_category_id,default_amt, ROUND(product_price - (product_price*discount)/100) as discounted_price,product_price,discount FROM database_2.product join top_deals on product.product_id=top_deals.product_id"
    );
    top_deals.forEach((element) => {
      element.image_url = `/product_image/${element.image_url}`;
    });
    res.json(response(true, "success", top_deals));
  }
  async make_product_top_deal(req, res) {
    const { body } = req;
    let top_deal = await db.get_rows(
      "INSERT INTO `database_2`.`top_deals` ( `product_id`) VALUES (?)",
      [body.product_id]
    );
    res.json(response(true, "success", top_deal));
  }
  async delete_product_from_top_deals(req, res) {
    const { body } = req;
    let deleteRes = await db.query("DELETE FROM `top_deals` WHERE `id`=?", [
      body.id,
    ]);
    if (deleteRes) {
      if (deleteRes.affectedRows >= 1) {
        res.json(response(true, "deleted succeccfully", {}));
      }
    }
  }
  async upload_product_image(req, res) {
    const { fields, files } = await get_formdata(req);
    let oldPath = files.image.path;
    let now = get_current_datetime();
    now = now.replace(/ /g, "-");
    now = now.replace(/:/g, "-");
    let image_name = `product_image__${now}${path.extname(files.image.name)}`;
    let newPath = `${path.dirname(require.main.filename)}/public/${image_name}`;

    fs.rename(oldPath, newPath, (err) => {});
  }
}
module.exports = new product();
