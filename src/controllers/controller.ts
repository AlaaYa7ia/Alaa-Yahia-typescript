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
      .jpeg({ quality: 80 })
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

module.exports = {
  img_upload,
  img_resize,
};
