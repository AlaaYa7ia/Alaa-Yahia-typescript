import express, { Request, Response } from "express";
const path = require("path");

export const app = express();
const routes = require("./routes/routes");

app.set("view engine", "ejs");

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const port: number = 3000;
let server: any;

app.get("/", (req: Request, res: Response) => {
  res.send(`<h1>Welcome to Image Processing API</h1>
    <p>Actions Available:</p>
    <p>POST /img-upload -> uplaod the image in the body.</p>
    <p>POST /img-resize/ -> uplaod the image, and insert height and width in the body.</p>
    <p>POST /img-crop/ -> uplaod the image, and insert top, left, height and width in the body.</p>
    <p>POST /img-downlaod/ -> uplaod the image in the body.</p>
    <p>POST /img-filter/ -> grayscale or blur -> uplaod the image, and insert filter in the body.</p>

    `);
});

app.use(routes);

app.use((err: Error, req: Request, res: Response, next: any) => {
  res.status(500).send(err.message);
});
app.all("*", (req, res) => {
  res.status(404).send("Pequest not suported");
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
