import { strict as assert } from "assert";
import http from "http";
import { app, stop } from "../server";
import { describe, before, after, it } from "node:test";
import path from "path";
import FormData from "form-data";
import fs from "fs";

function makeMultipartRequest(
  options: http.RequestOptions,
  formData: FormData
): Promise<any> {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = "";

      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        (res as any).body = JSON.parse(data);
        resolve(res);
      });
    });

    req.on("error", (e) => reject(e));

    formData.pipe(req);
  });
}

describe("Image Processing API (using form-data for uploads)", () => {
  let server: http.Server;

  before((done: any) => {
    server = app.listen(3000, done);
  });

  after((done: any) => {
    server.close(done);
    stop();
  });

  describe("POST /img-upload", () => {
    it("should upload an image successfully", async () => {
      const form = new FormData();
      form.append(
        "filename",
        fs.createReadStream(path.resolve(__dirname, "test.jpg"))
      );

      const options = {
        hostname: "localhost",
        port: 3000,
        path: "/img-upload",
        method: "POST",
        headers: form.getHeaders(),
      };

      const res = await makeMultipartRequest(options, form);

      assert.equal(res.statusCode, 200);
      assert.equal(res.body.status, "success");
      assert.equal(res.body.message, "File uploaded successfully!");
    });

    //should fix my code
    // it("should handle upload errors", async () => {
    //   const form = new FormData();

    //   const options = {
    //     hostname: "localhost",
    //     port: 3000,
    //     path: "/img-upload",
    //     method: "POST",
    //     headers: form.getHeaders(),
    //   };

    //   const res = await makeMultipartRequest(options, form);

    //   assert.equal(res.statusCode, 400);
    //   assert.equal(res.body.status, "error");
    //   assert.equal(res.body.message, "Failed to upload file.");
    // });
  });

  describe("POST /img-resize", () => {
    it("should resize image successfully", async () => {
      const form = new FormData();
      form.append(
        "filename",
        fs.createReadStream(path.resolve(__dirname, "test.jpg"))
      );

      const options = {
        hostname: "localhost",
        port: 3000,
        path: "/img-resize?width=100&hight=100",
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
        port: 3000,
        path: "/img-resize?width=100&hight=100",
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

  // add other test cases for img-crop, img-download, img-filter...
});
