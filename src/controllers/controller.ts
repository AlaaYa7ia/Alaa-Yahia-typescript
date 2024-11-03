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

export const img_upload = (req: Request, res: Response) => {
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

export const img_resize = async (req: Request, res: Response) => {
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

export const img_crop = async (req: Request, res: Response) => {
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

export const img_download = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .send({ status: "error", message: "No file uploaded." });
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
      message: "Failed to process image for download.",
    });
  }
};

export const img_filter = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .send({ status: "error", message: "No file uploaded." });
    }
    const filter = req.query.filter; //grayscale, blur
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

    if (filter === "grayscale") {
      //make it case -swich
      image = image.grayscale();
    } else if (filter === "blur") {
      image = image.blur(5);
    } else if (filter == "watermark") {
      const metadata = await image.metadata();
      const watermarkImage = await sharp(watermarkPath)
        .resize({ width: metadata.width, height: metadata.height }) // Resize watermark to desired size
        .toBuffer();

      // Composite watermark onto the main image
      image = image.composite([
        {
          input: watermarkImage,
          gravity: "southeast", // Position watermark at the bottom-right corner
          blend: "overlay", // Apply overlay blend mode
        },
      ]);
    } else {
      return res
        .status(400)
        .send({ status: "error", message: "No filter query parameter found." });
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
