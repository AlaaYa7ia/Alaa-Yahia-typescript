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
  "/img-resize", //?:height&:width
  files_middleware.single("filename"),
  controller.img_resize
);

router.post(
  "/img-crop", //?:height&:width&:top$:left
  files_middleware.single("filename"),
  controller.img_crop
);

router.post(
  "/img-downlaod", //?:type&:name
  files_middleware.single("filename"),
  controller.img_download
);

router.post(
  "/img-filter", //?:/filter
  files_middleware.single("filename"),
  controller.img_filter
);

module.exports = router;
