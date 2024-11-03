import express, { Request, Response } from "express";
const path = require("path");

export const app = express();
const routes = require("./routes/routes");

app.set("view engine", "ejs");

app.use("/uploads", express.static(path.join(__dirname, "uploads"))); //se if it works to change it to "public" folder

app.use(routes);

const port: number = 3000;
let server: any;

app.get("/", (req: Request, res: Response) => {
  res.send(`Welcome to Image Processing API
    Actions Available:
    POST /img-upload -> uplaod the image in the body.
    POST /img-resize/?:hight&:width -> uplaod the image in the body.
    POST /img-crop/?:hight&:width&:top$:left -> uplaod the image in the body.
    POST /img-downlaod/
    POST /img-filter/?:filter -> grayscale or blur -> uplaod the image in the body.

    `);
});

function start() {
  server = app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
  return server;
}

export function stop() {
  //TODO: temporary fix I will get red of it when I find a good solution.
  server.close();
}

start();
