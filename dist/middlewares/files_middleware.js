"use strict";
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { body, validationResult } = require("express-validator");
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        const filePath = path.join("uploads", file.originalname);
        // Check if file already exists
        if (fs.existsSync(filePath)) {
            return cb(new Error("File already exists"), undefined);
        }
        else {
            cb(null, file.originalname);
        }
    },
});
const upload = multer({ storage: storage });
// Custom middleware to validate file presence
const fileValidator = (req, res, next) => {
    if (!req.file) {
        return res
            .status(400)
            .send({ status: "error", message: "No file provided in the request" });
    }
    next();
};
const uplaodValidator = [fileValidator];
const resizeValidator = [
    fileValidator,
    body("height").exists().isString().withMessage("Height is required"),
    body("width").exists().isString().withMessage("Width is required"),
];
const cropValidator = [
    fileValidator,
    body("height").exists().isString().withMessage("Height is required"),
    body("width").exists().isString().withMessage("Width is required"),
    body("top").exists().isString().withMessage("top is required"),
    body("left").exists().isString().withMessage("left is required"),
];
module.exports = { upload, uplaodValidator, resizeValidator, cropValidator };
