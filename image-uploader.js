// const mysqlConnection = require("./connection");
const multer = require("multer");
const path = require("path");
const express = require("express");
const imageUploder = express();

const storage = multer.diskStorage({
	destination: "./public/uploads/",
	filename: function (req, file, cb) {
		cb(
			null,
			file.fieldname + "-" + Date.now() + path.extname(file.originalname)
		);
	},
});

const upload = multer({
	storage: storage,
	//   limits: { fileSize: 1000000 },
	fileFilter: function (req, file, cb) {
		checkFileType(file, cb);
	},
}).single("my_image");

function checkFileType(file, cb) {
	const filetypes = /jpeg|jpg|png|gif/;

	const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

	const mimetype = filetypes.test(file.mimetype);

	if (mimetype && extname) {
		return cb(null, true);
	} else {
		cb("Error: Images only!");
	}
}

imageUploder.post("/upload-product-image", (req, res) => {
	upload(req, res, (err) => {
		if (err) {
			console.log(err);
		} else {
			if (req.file == undefined) {
				console.log("no file selected");
			}
			res.send(req.file);
		}
	});
});

module.exports = imageUploder;
