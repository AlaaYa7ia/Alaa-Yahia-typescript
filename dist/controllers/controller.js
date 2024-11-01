"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const sharp = require("sharp");
const path = require("path");
const img_upload = (req, res) => {
    try {
        res.send({
            status: "success",
            message: "File uploaded successfully!",
        });
    }
    catch (err) {
        res.status(400).send({
            status: "error",
            message: "Failed to upload file.",
        });
    }
};
const img_resize = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.file) {
            return res
                .status(400)
                .send({ status: "error", message: "No file uploaded." });
        }
        const outputPath = path.join(__dirname, "../../uploads/resized/", "resized-" + req.file.filename);
        const hight = req.query.hight;
        const width = req.query.width;
        console.log(hight, width, req.file.path, req.file.filename);
        yield sharp(req.file.path)
            .resize(parseInt(width), parseInt(hight), { fit: "fill" })
            .toFile(outputPath);
        res.send({
            status: "success",
            message: "File uploaded and processed successfully!",
            filename: `resized-${req.file.filename}`,
            url: `/uploads/resized-${req.file.filename}`,
        });
    }
    catch (err) {
        console.log(err);
        res
            .status(500)
            .send({ status: "error", message: "Failed to process image." });
    }
});
const img_crop = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.file) {
            return res
                .status(400)
                .send({ status: "error", message: "No file uploaded." });
        }
        const outputPath = path.join(__dirname, "../../uploads/cropped/", "cropped-" + req.file.filename);
        const left = req.query.left;
        const top = req.query.top;
        const width = req.query.width;
        const hight = req.query.hight;
        console.log(hight, width, req.file.path, req.file.filename);
        const cropOptions = {
            left: parseInt(left), // X coordinate (horizontal offset)
            top: parseInt(top), // Y coordinate (vertical offset)
            width: parseInt(width), // Width of the crop area
            height: parseInt(hight), // Height of the crop area
        };
        yield sharp(req.file.path).extract(cropOptions).toFile(outputPath);
        res.send({
            status: "success",
            message: "File uploaded and processed successfully!",
            filename: `cropped-${req.file.filename}`,
            url: `/uploads/cropped-${req.file.filename}`,
        });
    }
    catch (err) {
        console.log(err);
        res
            .status(500)
            .send({ status: "error", message: "Failed to process image." });
    }
});
const img_download = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.file) {
            return res
                .status(400)
                .send({ status: "error", message: "No file uploaded." });
        }
        const outputFilename = `${Date.now()}-${req.file.filename}`; // Name for the processed image
        let outputPath = path.join(__dirname, "../../uploads", outputFilename);
        // const type: any = req.query.type;
        // switch (type) {
        //   case "cropped":
        //     outputPath = path.join(
        //       __dirname,
        //       "../../uploads/cropped",
        //       outputFilename
        //     );
        //     break;
        //   case "resized":
        //     outputPath = path.join(
        //       __dirname,
        //       "../../uploads/resized",
        //       outputFilename
        //     );
        //     break;
        //   default:
        //     outputPath = path.join(__dirname, "../../uploads", outputFilename);
        // }
        res.download(outputPath, outputFilename, (err) => {
            if (err) {
                console.error(err);
                res
                    .status(500)
                    .send({ status: "error", message: "Failed to download image." });
            }
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).send({
            status: "error",
            message: "Failed to process image for download.",
        });
    }
});
module.exports = {
    img_upload,
    img_resize,
    img_crop,
    img_download,
};
