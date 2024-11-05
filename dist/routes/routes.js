"use strict";
const express = require("express");
const router = express.Router();
const controller = require("../controllers/controller");
const files_middleware = require("../middlewares/files_middleware");
router.post("/img-upload", files_middleware.upload.single("filename"), files_middleware.uplaodValidator, controller.img_upload);
router.post("/img-resize", files_middleware.upload.single("filename"), files_middleware.resizeValidator, controller.img_resize);
router.post("/img-crop", files_middleware.upload.single("filename"), files_middleware.cropValidator, controller.img_crop);
// router.post(
//   "/img-downlaod",
//   files_middleware.upload.single("filename"),
//   controller.img_download
// );
// router.post(
//   "/img-filter", //?:/filter
//   files_middleware.upload.single("filename"),
//   controller.img_filter
// );
//handle if user ask for none existing rout os function
module.exports = router;
