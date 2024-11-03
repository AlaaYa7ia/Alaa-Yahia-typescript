"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const path = require("path");
exports.app = (0, express_1.default)();
const routes = require("./routes/routes");
exports.app.set("view engine", "ejs");
exports.app.use("/uploads", express_1.default.static(path.join(__dirname, "uploads"))); //se if it works to change it to "public" folder
exports.app.use(routes);
const port = 3000;
exports.app.get("/", (req, res) => {
    res.send(`Welcome to Image Processing API
    Actions Available:
    POST /img-upload -> uplaod the image in the body.
    POST /img-resize/?:hight&:width -> uplaod the image in the body.
    POST /img-crop/?:hight&:width&:top$:left -> uplaod the image in the body.
    POST /img-downlaod/?:type&:name
    POST /img-filter/?:filter -> grayscale or blur -> uplaod the image in the body.

    `);
});
exports.app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
