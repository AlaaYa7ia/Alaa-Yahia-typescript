const express = require("express");
const router = express.Router();
const controller = require("../controllers/controller");
const files_middleware = require("../middlewares/files_middleware");

router.post(
  "/img-upload",
  files_middleware.single("filename"),
  controller.img_upload
);

router.post(
  "/img-resize", //?:hight&:width
  files_middleware.single("filename"),
  controller.img_resize
);

router.post(
  "/img-crop", //?:hight&:width
  files_middleware.single("filename"),
  controller.img_crop
);

module.exports = router;
