import { Request, Response } from "express";

import sharp from "sharp";

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

module.exports = {
  img_upload,
};
