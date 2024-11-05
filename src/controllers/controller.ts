import { Request, Response } from "express";
const sharp = require("sharp");
const path = require("path");
const { validationResult } = require("express-validator");

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

export const img_upload = (req: Request, res: Response) => {
  try {
    console.log(req);

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()[1].msg,
      });
    }
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

export const img_resize = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty() || !req.file) {
      return res.status(400).json({
        success: false,
        errors: errors.array()[1].msg,
      });
    }
    const outputPath = path.join(
      __dirname,
      "../../uploads/resized/",
      "resized-" + req.file.filename
    );

    const height: any = req.body.height; //todo: add to body - change all
    const width: any = req.body.width;

    await sharp(req.file.path)
      .resize(parseInt(width), parseInt(height), { fit: "fill" })
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

export const img_crop = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty() || !req.file) {
      return res.status(400).json({
        success: false,
        errors: errors.array()[1].msg,
      });
    }
    const outputPath = path.join(
      __dirname,
      "../../uploads/cropped/",
      "cropped-" + req.file.filename
    );

    const left: any = req.body.left;
    const top: any = req.body.top;
    const width: any = req.body.width;
    const height: any = req.body.height;

    const cropOptions = {
      left: parseInt(left), // X coordinate (horizontal offset)
      top: parseInt(top), // Y coordinate (vertical offset)
      width: parseInt(width), // Width of the crop area
      height: parseInt(height), // Height of the crop area
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

export const img_download = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty() || !req.file) {
      return res.status(400).json({
        success: false,
        errors: errors.array()[1].msg,
      });
    }

    const outputPath = path.join(
      __dirname,
      "../../uploads",
      `${req.file.filename}`
    );

    res.download(outputPath, (err: any) => {
      if (err) {
        console.error(err);
        res
          .status(500)
          .send({ status: "error", message: "Failed to download image." });
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      status: "error",
      message: "Failed to download image.",
    });
  }
};

export const img_filter = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty() || !req.file) {
      return res.status(400).json({
        success: false,
        errors: errors.array()[1].msg,
      });
    }

    const filter = req.body.filter; //grayscale, blur
    const outputPath = path.join(
      __dirname,
      `../../uploads/${filter}/`,
      `${filter}ed-` + req.file.filename
    );

    const watermarkPath = path.join(
      __dirname,
      "../../public/assets",
      "watermark.jpg"
    );

    let image = sharp(req.file.path);
    await sharp(req.file.path);

    switch (filter) {
      case "grayscale":
        image = image.grayscale();
        break;
      case "blur":
        image = image.blur(5);
        break;
      case "watermark":
        const metadata = await image.metadata();
        const watermarkImage = await sharp(watermarkPath)
          .resize({ width: metadata.width, height: metadata.height })
          .toBuffer();

        image = image.composite([
          {
            input: watermarkImage,
            gravity: "southeast",
            blend: "overlay",
          },
        ]);
        break;
      default:
        return res.status(400).send({
          status: "error",
          message: "No filter query parameter found.",
        });
    }

    await image.toFile(outputPath);
    res.send({
      status: "success",
      message: "File uploaded and processed successfully!",
      filename: `${filter}-${req.file.filename}`,
      url: `/uploads/${filter}-${req.file.filename}`,
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
  img_download,
  img_filter,
};
