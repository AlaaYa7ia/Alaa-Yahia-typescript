"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path = require("path");
const bodyParser = require("body-parser");
const app = (0, express_1.default)();
const routes = require("./routes/routes");
app.set("view engine", "ejs");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/uploads", express_1.default.static(path.join(__dirname, "uploads")));
app.use(routes);
const port = 3000;
app.get("/", (req, res) => {
    res.send(`Welcome to Image Processing API
    Actions Available:
    POST /img-upload
    `);
});
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
