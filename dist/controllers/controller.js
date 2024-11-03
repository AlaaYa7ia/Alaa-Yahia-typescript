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
exports.img_filter = exports.img_download = exports.img_crop = exports.img_resize = exports.img_upload = void 0;
const sharp = require("sharp");
const path = require("path");
const img_upload = (req, res) => {
    try {
        if (!req.file) {
            return res
                .status(400)
                .send({ status: "error", message: "Failed to upload file." });
        }
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
exports.img_upload = img_upload;
const img_resize = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.file) {
            return res
                .status(400)
                .send({ status: "error", message: "No file uploaded." });
        }
        const outputPath = path.join(__dirname, "../../uploads/resized/", "resized-" + req.file.filename);
        const height = req.query.height;
        const width = req.query.width;
        yield sharp(req.file.path)
            .resize(parseInt(width), parseInt(height), { fit: "fill" })
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
exports.img_resize = img_resize;
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
        const height = req.query.height;
        const cropOptions = {
            left: parseInt(left), // X coordinate (horizontal offset)
            top: parseInt(top), // Y coordinate (vertical offset)
            width: parseInt(width), // Width of the crop area
            height: parseInt(height), // Height of the crop area
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
exports.img_crop = img_crop;
const img_download = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.file) {
            return res
                .status(400)
                .send({ status: "error", message: "No file uploaded." });
        }
        const outputPath = path.join(__dirname, "../../uploads", `${req.file.filename}`);
        res.download(outputPath, (err) => {
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
            message: "Failed to download image.",
        });
    }
});
exports.img_download = img_download;
const img_filter = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.file) {
            return res
                .status(400)
                .send({ status: "error", message: "No file uploaded." });
        }
        const filter = req.query.filter; //grayscale, blur
        const outputPath = path.join(__dirname, `../../uploads/${filter}/`, `${filter}ed-` + req.file.filename);
        const watermarkPath = path.join(__dirname, "../../public/assets", "watermark.jpg");
        let image = sharp(req.file.path);
        yield sharp(req.file.path);
        if (filter === "grayscale") {
            // TODO: make it case -swich
            image = image.grayscale();
        }
        else if (filter === "blur") {
            image = image.blur(5);
        }
        else if (filter == "watermark") {
            const metadata = yield image.metadata();
            const watermarkImage = yield sharp(watermarkPath)
                .resize({ width: metadata.width, height: metadata.height })
                .toBuffer();
            image = image.composite([
                {
                    input: watermarkImage,
                    gravity: "southeast",
                    blend: "overlay",
                },
            ]);
        }
        else {
            return res
                .status(400)
                .send({ status: "error", message: "No filter query parameter found." });
        }
        yield image.toFile(outputPath);
        res.send({
            status: "success",
            message: "File uploaded and processed successfully!",
            filename: `${filter}-${req.file.filename}`,
            url: `/uploads/${filter}-${req.file.filename}`,
        });
    }
    catch (err) {
        console.log(err);
        res
            .status(500)
            .send({ status: "error", message: "Failed to process image." });
    }
});
exports.img_filter = img_filter;
module.exports = {
    img_upload: exports.img_upload,
    img_resize: exports.img_resize,
    img_crop: exports.img_crop,
    img_download: exports.img_download,
    img_filter: exports.img_filter,
};
