"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
exports.stop = stop;
const express_1 = __importDefault(require("express"));
const path = require("path");
exports.app = (0, express_1.default)();
const routes = require("./routes/routes");
exports.app.set("view engine", "ejs");
exports.app.use("/uploads", express_1.default.static(path.join(__dirname, "uploads"))); //se if it works to change it to "public" folder
const port = 3000;
let server;
exports.app.get("/", (req, res) => {
    res.send(`Welcome to Image Processing API
    Actions Available:
    POST /img-upload -> uplaod the image in the body.
    POST /img-resize/?:height&:width -> uplaod the image in the body.
    POST /img-crop/?:height&:width&:top$:left -> uplaod the image in the body.
    POST /img-downlaod/
    POST /img-filter/?:filter -> grayscale or blur -> uplaod the image in the body.

    `);
});
exports.app.use(routes);
exports.app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send(err.message);
});
function start() {
    server = exports.app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });
    return server;
}
function stop() {
    //TODO: temporary fix I will get red of it when I find a good solution.
    server.close();
}
start();
