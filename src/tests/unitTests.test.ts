import { strict as assert } from "assert";
import http from "http";
import { app, stop } from "../server";
import { describe, before, after, it } from "node:test";
import path from "path";
import FormData from "form-data";
import fs from "fs";

//TODO: split into files.

const port: number = 8000;

const fileName: string = path.resolve(__dirname, "test.jpg");
const pathToUploads = "../../uploads";

async function makeMultipartRequest(
  options: http.RequestOptions,
  formData: FormData
): Promise<{ statusCode: number; body: any }> {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = "";

      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        try {
          const parsedBody = JSON.parse(data);
          resolve({ statusCode: res.statusCode || 500, body: parsedBody });
        } catch (err) {
          reject(new Error("Failed to parse JSON response"));
        }
      });
    });

    req.on("error", reject);

    // Set a timeout to prevent the request from hanging indefinitely
    req.setTimeout(10000, () => {
      req.destroy(new Error("Request timed out"));
    });

    formData.pipe(req);
  });
}

async function deleteFile(fileName: any) {
  try {
    if (fs.existsSync(fileName)) {
      fs.unlinkSync(fileName);
      console.log(`Deleted ${fileName}`);
    }
  } catch (error: any) {
    console.error(`Got an error trying to delete the file: ${error.message}`);
  }
}

describe("POST /img-upload", () => {
  let server: http.Server;

  before(async (done: any) => {
    await deleteFile(path.resolve(__dirname, pathToUploads + "/test.jpg"));

    setTimeout(() => 5000);

    server = app.listen(port, done);
  });

  after((done: any) => {
    server.close(done);
    stop();
  });

  it("should upload an image successfully", async () => {
    const form = new FormData();
    form.append("filename", fs.createReadStream(fileName));

    const options = {
      hostname: "localhost",
      port: port,
      path: "/img-upload",
      method: "POST",
      headers: form.getHeaders(),
    };

    const res = await makeMultipartRequest(options, form);

    assert.equal(res.statusCode, 200);
    assert.equal(res.body.status, "success");
    assert.equal(res.body.message, "File uploaded successfully!");
  });

  it("should handle upload errors", async () => {
    const form = new FormData();

    const options = {
      hostname: "localhost",
      port: port,
      path: "/img-upload",
      method: "POST",
    };

    const res = await makeMultipartRequest(options, form);

    assert.equal(res.statusCode, 400);
    assert.equal(res.body.status, "error");
    assert.equal(res.body.message, "No file provided in the request");
  });
});

describe("POST /img-resize", () => {
  let server: http.Server;

  before(async (done: any) => {
    await deleteFile(path.resolve(__dirname, pathToUploads + "/test.jpg"));

    server = app.listen(port, done);
  });

  after((done: any) => {
    server.close(done);
    stop();
  });

  it("should resize image successfully", async () => {
    const form = new FormData();
    form.append("filename", fs.createReadStream(fileName));
    form.append("height", "100");
    form.append("width", "100");

    const options = {
      hostname: "localhost",
      port: port,
      path: "/img-resize",
      method: "POST",
      headers: form.getHeaders(),
    };

    const res = await makeMultipartRequest(options, form);

    assert.equal(res.statusCode, 200);
    assert.equal(res.body.status, "success");
    assert.ok(res.body.filename.includes("resized"));
  });

  it("should return error if no file uploaded", async () => {
    const options = {
      hostname: "localhost",
      port: port,
      path: "/img-resize",
      method: "POST",
    };

    // Empty form without a file
    const form = new FormData();

    const res = await makeMultipartRequest(options, form);

    assert.equal(res.statusCode, 400);
    assert.equal(res.body.status, "error");
    assert.equal(res.body.message, "No file provided in the request");
  });
});

describe("POST /img-crop", () => {
  let server: http.Server;

  before(async (done: any) => {
    await deleteFile(path.resolve(__dirname, pathToUploads + "/test.jpg"));

    server = app.listen(port, done);
  });

  after((done: any) => {
    server.close(done);
    stop();
  });

  it("should crop the image successfully", async () => {
    const form = new FormData();
    form.append("filename", fs.createReadStream(fileName));
    form.append("left", "10");
    form.append("top", "10");
    form.append("width", "100");
    form.append("height", "100");

    const options = {
      hostname: "localhost",
      port: port,
      path: "/img-crop",
      method: "POST",
      headers: form.getHeaders(),
    };

    const res = await makeMultipartRequest(options, form);

    assert.equal(res.statusCode, 200);
    assert.equal(res.body.status, "success");
    assert.ok(res.body.filename.includes("cropped"));
  });

  it("should return error if no file uploaded for cropping", async () => {
    const options = {
      hostname: "localhost",
      port: port,
      path: "/img-crop",
      method: "POST",
    };

    const form = new FormData();

    const res = await makeMultipartRequest(options, form);

    assert.equal(res.statusCode, 400);
    assert.equal(res.body.status, "error");
    assert.equal(res.body.message, "No file provided in the request");
  });
});

describe("POST /img-download", () => {
  let server: http.Server;

  before(async (done: any) => {
    await deleteFile(path.resolve(__dirname, pathToUploads + "/test.jpg"));

    server = app.listen(port, done);
  });

  after((done: any) => {
    server.close(done);
    stop();
  });

  it("should return error if no file uploaded for download", async () => {
    const options = {
      hostname: "localhost",
      port: port,
      path: "/img-downlaod",
      method: "POST",
    };

    const form = new FormData();

    const res = await makeMultipartRequest(options, form);

    assert.equal(res.statusCode, 400);
    assert.equal(res.body.status, "error");
    assert.equal(res.body.message, "No file provided in the request");
  });
});

describe("POST /img-filter", () => {
  let server: http.Server;

  before(async (done: any) => {
    await deleteFile(path.resolve(__dirname, pathToUploads + "/test.jpg"));

    server = app.listen(port, done);
  });

  after((done: any) => {
    server.close(done);
    stop();
  });

  it("should apply grayscale filter to the image", async () => {
    const form = new FormData();
    form.append("filename", fs.createReadStream(fileName));
    form.append("filter", "grayscale");

    const options = {
      hostname: "localhost",
      port: port,
      path: "/img-filter",
      method: "POST",
      headers: form.getHeaders(),
    };

    const res = await makeMultipartRequest(options, form);

    assert.equal(res.statusCode, 200);
    assert.equal(res.body.status, "success");
    assert.ok(res.body.filename.includes("grayscale"));
  });

  it("should apply blur filter to the image", async () => {
    await deleteFile(path.resolve(__dirname, pathToUploads + "/test.jpg"));

    const form = new FormData();
    form.append("filename", fs.createReadStream(fileName));
    form.append("filter", "blur");

    const options = {
      hostname: "localhost",
      port: port,
      path: "/img-filter",
      method: "POST",
      headers: form.getHeaders(),
    };

    const res = await makeMultipartRequest(options, form);

    assert.equal(res.statusCode, 200);
    assert.equal(res.body.status, "success");
    assert.ok(res.body.filename.includes("blur"));
  });

  it("should return error if no file uploaded for filtering", async () => {
    const options = {
      hostname: "localhost",
      port: port,
      path: "/img-filter",
      method: "POST",
    };

    const form = new FormData();

    const res = await makeMultipartRequest(options, form);

    assert.equal(res.statusCode, 400);
    assert.equal(res.body.status, "error");
    assert.equal(res.body.message, "No file provided in the request");
  });
});
