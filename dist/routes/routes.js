"use strict";
const express = require("express");
const router = express.Router();
const controller = require("../controllers/controller");
const files_middleware = require("../middlewares/files_middleware");
router.post("/img-upload", files_middleware.single("filename"), controller.img_upload);
router.post("/img-resize", //?:hight&:width
files_middleware.single("filename"), controller.img_resize);
router.post("/img-crop", //?:hight&:width&:top$:left
files_middleware.single("filename"), controller.img_crop);
router.post("/img-downlaod", //?:type&:name
controller.img_download);
module.exports = router;
