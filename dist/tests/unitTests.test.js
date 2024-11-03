"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = require("assert");
const http_1 = __importDefault(require("http"));
const server_1 = require("../server");
const node_test_1 = require("node:test");
const path_1 = __importDefault(require("path"));
const form_data_1 = __importDefault(require("form-data"));
const fs_1 = __importDefault(require("fs"));
// Function to perform HTTP requests using FormData for file uploads
function makeMultipartRequest(options, formData) {
    return new Promise((resolve, reject) => {
        const req = http_1.default.request(options, (res) => {
            let data = "";
            res.on("data", (chunk) => {
                data += chunk;
            });
            res.on("end", () => {
                res.body = JSON.parse(data);
                resolve(res);
            });
        });
        req.on("error", (e) => reject(e));
        formData.pipe(req);
    });
}
(0, node_test_1.describe)("Image Processing API (using form-data for uploads)", () => {
    let server;
    (0, node_test_1.before)((done) => {
        server = server_1.app.listen(8000, done);
    });
    (0, node_test_1.after)((done) => {
        server.close(done);
    });
    (0, node_test_1.describe)("POST /img-upload", () => {
        (0, node_test_1.it)("should upload an image successfully", () => __awaiter(void 0, void 0, void 0, function* () {
            const form = new form_data_1.default();
            form.append("filename", fs_1.default.createReadStream(path_1.default.resolve(__dirname, "test.jpg")));
            const options = {
                hostname: "localhost",
                port: 8000,
                path: "/img-upload",
                method: "POST",
                headers: form.getHeaders(),
            };
            const res = yield makeMultipartRequest(options, form);
            assert_1.strict.equal(res.statusCode, 200);
            assert_1.strict.equal(res.body.status, "success");
            assert_1.strict.equal(res.body.message, "File uploaded successfully!");
        }));
        (0, node_test_1.it)("should handle upload errors", () => __awaiter(void 0, void 0, void 0, function* () {
            const form = new form_data_1.default();
            form.append("filename", fs_1.default.createReadStream(path_1.default.resolve(__dirname, "test.jpg")));
            const options = {
                hostname: "localhost",
                port: 8000,
                path: "/img-upload",
                method: "POST",
                headers: form.getHeaders(),
            };
            // Sending an invalid path to simulate error
            const res = yield makeMultipartRequest(options, form);
            assert_1.strict.equal(res.statusCode, 400);
            assert_1.strict.equal(res.body.status, "error");
            assert_1.strict.equal(res.body.message, "Failed to upload file.");
        }));
    });
    (0, node_test_1.describe)("POST /img-resize", () => {
        (0, node_test_1.it)("should resize image successfully", () => __awaiter(void 0, void 0, void 0, function* () {
            const form = new form_data_1.default();
            form.append("filename", fs_1.default.createReadStream(path_1.default.resolve(__dirname, "test.jpg")));
            const options = {
                hostname: "localhost",
                port: 8000,
                path: "/img-resize?width=100&hight=100",
                method: "POST",
                headers: form.getHeaders(),
            };
            const res = yield makeMultipartRequest(options, form);
            assert_1.strict.equal(res.statusCode, 200);
            assert_1.strict.equal(res.body.status, "success");
            assert_1.strict.ok(res.body.filename.includes("resized"));
        }));
        (0, node_test_1.it)("should return error if no file uploaded", () => __awaiter(void 0, void 0, void 0, function* () {
            const options = {
                hostname: "localhost",
                port: 8000,
                path: "/img-resize?width=100&hight=100",
                method: "POST",
            };
            // Empty form without a file
            const form = new form_data_1.default();
            const res = yield makeMultipartRequest(options, form);
            assert_1.strict.equal(res.statusCode, 400);
            assert_1.strict.equal(res.body.status, "error");
            assert_1.strict.equal(res.body.message, "No file uploaded.");
        }));
    });
    // Similarly add other test cases for img-crop, img-download, img-filter...
});
