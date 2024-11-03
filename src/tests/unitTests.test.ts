import { strict as assert } from "assert";
import http from "http";
import { app, stop } from "../server";
import { describe, before, after, it, afterEach } from "node:test";
import path from "path";
import FormData from "form-data";
import fs from "fs";

//TODO: split into files.

const port: number = 8000;

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

describe("POST /img-upload", () => {
  let server: http.Server;

  before((done: any) => {
    server = app.listen(port, done);
  });

  after((done: any) => {
    server.close(done);
    stop();
  });

  it("should upload an image successfully", async () => {
    const form = new FormData();
    form.append(
      "filename",
      fs.createReadStream(path.resolve(__dirname, "test.jpg"))
    );

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
    assert.equal(res.body.message, "Failed to upload file.");
  });
});

describe("POST /img-resize", () => {
  let server: http.Server;

  before((done: any) => {
    server = app.listen(port, done);
  });

  after((done: any) => {
    server.close(done);
    stop();
  });

  it("should resize image successfully", async () => {
    const form = new FormData();
    form.append(
      "filename",
      fs.createReadStream(path.resolve(__dirname, "test.jpg"))
    );

    const options = {
      hostname: "localhost",
      port: port,
      path: "/img-resize?width=100&height=100",
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
      path: "/img-resize?width=100&height=100",
      method: "POST",
    };

    // Empty form without a file
    const form = new FormData();

    const res = await makeMultipartRequest(options, form);

    assert.equal(res.statusCode, 400);
    assert.equal(res.body.status, "error");
    assert.equal(res.body.message, "No file uploaded.");
  });
});

describe("POST /img-crop", () => {
  let server: http.Server;

  before((done: any) => {
    server = app.listen(port, done);
  });

  after((done: any) => {
    server.close(done);
    stop();
  });

  it("should crop the image successfully", async () => {
    const form = new FormData();
    form.append(
      "filename",
      fs.createReadStream(path.resolve(__dirname, "test.jpg"))
    );

    const options = {
      hostname: "localhost",
      port: port,
      path: "/img-crop/?left=10&top=10&width=100&height=100",
      method: "POST",
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
      path: "/img-crop?width=100&height=100&top=10&left=10",
      method: "POST",
    };

    const form = new FormData();

    const res = await makeMultipartRequest(options, form);

    assert.equal(res.statusCode, 400);
    assert.equal(res.body.status, "error");
    assert.equal(res.body.message, "No file uploaded.");
  });
});

describe("POST /img-download", () => {
  let server: http.Server;

  before((done: any) => {
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
    assert.equal(res.body.message, "No file uploaded.");
  });
});

describe("POST /img-filter", () => {
  let server: http.Server;

  before((done: any) => {
    server = app.listen(port, done);
  });

  after((done: any) => {
    server.close(done);
    stop();
  });

  it("should apply grayscale filter to the image", async () => {
    const form = new FormData();
    form.append(
      "filename",
      fs.createReadStream(path.resolve(__dirname, "test.jpg"))
    );

    const options = {
      hostname: "localhost",
      port: port,
      path: "/img-filter?filter=grayscale",
      method: "POST",
      headers: form.getHeaders(),
    };

    const res = await makeMultipartRequest(options, form);

    assert.equal(res.statusCode, 200);
    assert.equal(res.body.status, "success");
    assert.ok(res.body.filename.includes("grayscale"));
  });

  it("should apply blur filter to the image", async () => {
    const form = new FormData();
    form.append(
      "filename",
      fs.createReadStream(path.resolve(__dirname, "test.jpg"))
    );

    const options = {
      hostname: "localhost",
      port: port,
      path: "/img-filter?filter=blur",
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
      path: "/img-filter?filter=grayscale",
      method: "POST",
    };

    const form = new FormData();

    const res = await makeMultipartRequest(options, form);

    assert.equal(res.statusCode, 400);
    assert.equal(res.body.status, "error");
    assert.equal(res.body.message, "No file uploaded.");
  });
});
// });
