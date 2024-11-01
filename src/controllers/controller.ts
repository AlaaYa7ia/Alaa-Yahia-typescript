import { Request, Response } from "express";
const sharp = require("sharp");
const path = require("path");

declare global {
  namespace Express {
    export interface File {
      filename?: string;
      path?: string;
    }
    export interface Request {
      file?: File;
    }
  }
}

const img_upload = (req: Request, res: Response) => {
  try {
    res.send({
      status: "success",
      message: "File uploaded successfully!",
    });
  } catch (err) {
    res.status(400).send({
      status: "error",
      message: "Failed to upload file.",
    });
  }
};

const img_resize = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .send({ status: "error", message: "No file uploaded." });
    }
    const outputPath = path.join(
      __dirname,
      "../../uploads/resized/",
      "resized-" + req.file.filename
    );

    const hight: any = req.query.hight;
    const width: any = req.query.width;
    console.log(hight, width, req.file.path, req.file.filename);

    await sharp(req.file.path)
      .resize(parseInt(width), parseInt(hight), { fit: "fill" })
      .toFile(outputPath);
    res.send({
      status: "success",
      message: "File uploaded and processed successfully!",
      filename: `resized-${req.file.filename}`,
      url: `/uploads/resized-${req.file.filename}`,
    });
  } catch (err) {
    console.log(err);

    res
      .status(500)
      .send({ status: "error", message: "Failed to process image." });
  }
};

const img_crop = async (req: Request, res: Response) => {
  // make with resize one function rout?
  try {
    if (!req.file) {
      return res
        .status(400)
        .send({ status: "error", message: "No file uploaded." });
    }
    const outputPath = path.join(
      __dirname,
      "../../uploads/cropped/",
      "cropped-" + req.file.filename
    );

    const left: any = req.query.left;
    const top: any = req.query.top;
    const width: any = req.query.width;
    const hight: any = req.query.hight;

    console.log(hight, width, req.file.path, req.file.filename);

    const cropOptions = {
      left: parseInt(left), // X coordinate (horizontal offset)
      top: parseInt(top), // Y coordinate (vertical offset)
      width: parseInt(width), // Width of the crop area
      height: parseInt(hight), // Height of the crop area
    };

    await sharp(req.file.path).extract(cropOptions).toFile(outputPath);
    res.send({
      status: "success",
      message: "File uploaded and processed successfully!",
      filename: `cropped-${req.file.filename}`,
      url: `/uploads/cropped-${req.file.filename}`,
    });
  } catch (err) {
    console.log(err);

    res
      .status(500)
      .send({ status: "error", message: "Failed to process image." });
  }
};

module.exports = {
  img_upload,
  img_resize,
  img_crop,
};
