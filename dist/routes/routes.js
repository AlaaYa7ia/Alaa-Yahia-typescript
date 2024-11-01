"use strict";
const express = require("express");
const router = express.Router();
const controller = require("../controllers/controller");
const uploadMiddleware = require("../middlewares/files_middleware");
// const storage = multer.diskStorage({
//   destination: (
//     req: any,
//     file: any,
//     cb: (arg0: null, arg1: string) => void
//   ) => {
//     cb(null, "uploads/");
//   },
//   filename: (
//     req: any,
//     file: { originalname: any },
//     cb: (arg0: null, arg1: any) => void
//   ) => {
//     cb(null, file.originalname);
//   },
// });
// const upload = multer({ storage: storage }).single("filename");
router.post("/img-upload", uploadMiddleware.single("filename"), controller.img_upload);
module.exports = router;
