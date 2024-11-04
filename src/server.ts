import express, { Request, Response } from "express";
const path = require("path");

export const app = express();
const routes = require("./routes/routes");

app.set("view engine", "ejs");

app.use("/uploads", express.static(path.join(__dirname, "uploads"))); //TODO: see  if it works to change it to "public" folder
// ASK: should I have the uploads in public folder?

const port: number = 3000;
let server: any;

app.get("/", (req: Request, res: Response) => {
  res.send(`Welcome to Image Processing API
    Actions Available:
    POST /img-upload -> uplaod the image in the body.
    POST /img-resize/?:height&:width -> uplaod the image in the body.
    POST /img-crop/?:height&:width&:top$:left -> uplaod the image in the body.
    POST /img-downlaod/
    POST /img-filter/?:filter -> grayscale or blur -> uplaod the image in the body.

    `);
});

app.use(routes);

app.use((err: Error, req: Request, res: Response, next: any) => {
  console.error(err.stack);
  res.status(500).send(err.message);
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
