"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
module.exports = {
    img_upload,
};
