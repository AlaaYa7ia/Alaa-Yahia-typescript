const express = require("express");
const router = express.Router();
const controller = require("../controllers/controller");
const uploadMiddleware = require("../middlewares/files_middleware");

router.post(
  "/img-upload",
  uploadMiddleware.single("filename"),
  controller.img_upload
);

module.exports = router;
