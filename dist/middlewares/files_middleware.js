"use strict";
const multer = require("multer");
const fs = require("fs");
const path = require("path");
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
module.exports = upload;
