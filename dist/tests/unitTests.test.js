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
//TODO: split into files.
const port = 8000;
const fileName = path_1.default.resolve(__dirname, "test.jpg");
const pathToUploads = "../../uploads";
function makeMultipartRequest(options, formData) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            const req = http_1.default.request(options, (res) => {
                let data = "";
                res.on("data", (chunk) => {
                    data += chunk;
                });
                res.on("end", () => {
                    try {
                        const parsedBody = JSON.parse(data);
                        resolve({ statusCode: res.statusCode || 500, body: parsedBody });
                    }
                    catch (err) {
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
    });
}
function deleteFile(fileName) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (fs_1.default.existsSync(fileName)) {
                fs_1.default.unlinkSync(fileName);
                console.log(`Deleted ${fileName}`);
            }
        }
        catch (error) {
            console.error(`Got an error trying to delete the file: ${error.message}`);
        }
    });
}
(0, node_test_1.describe)("POST /img-upload", () => {
    let server;
    (0, node_test_1.before)((done) => __awaiter(void 0, void 0, void 0, function* () {
        yield deleteFile(path_1.default.resolve(__dirname, pathToUploads + "/test.jpg"));
        setTimeout(() => 5000);
        server = server_1.app.listen(port, done);
    }));
    (0, node_test_1.after)((done) => {
        server.close(done);
        (0, server_1.stop)();
    });
    (0, node_test_1.it)("should upload an image successfully", () => __awaiter(void 0, void 0, void 0, function* () {
        const form = new form_data_1.default();
        form.append("filename", fs_1.default.createReadStream(fileName));
        const options = {
            hostname: "localhost",
            port: port,
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
        const options = {
            hostname: "localhost",
            port: port,
            path: "/img-upload",
            method: "POST",
        };
        const res = yield makeMultipartRequest(options, form);
        assert_1.strict.equal(res.statusCode, 400);
        assert_1.strict.equal(res.body.status, "error");
        assert_1.strict.equal(res.body.message, "Failed to upload file.");
    }));
});
(0, node_test_1.describe)("POST /img-resize", () => {
    let server;
    (0, node_test_1.before)((done) => __awaiter(void 0, void 0, void 0, function* () {
        yield deleteFile(path_1.default.resolve(__dirname, pathToUploads + "/test.jpg"));
        server = server_1.app.listen(port, done);
    }));
    (0, node_test_1.after)((done) => {
        server.close(done);
        (0, server_1.stop)();
    });
    (0, node_test_1.it)("should resize image successfully", () => __awaiter(void 0, void 0, void 0, function* () {
        const form = new form_data_1.default();
        form.append("filename", fs_1.default.createReadStream(fileName));
        const options = {
            hostname: "localhost",
            port: port,
            path: "/img-resize?width=100&height=100",
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
            port: port,
            path: "/img-resize?width=100&height=100",
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
(0, node_test_1.describe)("POST /img-crop", () => {
    let server;
    (0, node_test_1.before)((done) => __awaiter(void 0, void 0, void 0, function* () {
        yield deleteFile(path_1.default.resolve(__dirname, pathToUploads + "/test.jpg"));
        server = server_1.app.listen(port, done);
    }));
    (0, node_test_1.after)((done) => {
        server.close(done);
        (0, server_1.stop)();
    });
    (0, node_test_1.it)("should crop the image successfully", () => __awaiter(void 0, void 0, void 0, function* () {
        const form = new form_data_1.default();
        form.append("filename", fs_1.default.createReadStream(fileName));
        const options = {
            hostname: "localhost",
            port: port,
            path: "/img-crop/?left=10&top=10&width=100&height=100",
            method: "POST",
        };
        const res = yield makeMultipartRequest(options, form);
        assert_1.strict.equal(res.statusCode, 200);
        assert_1.strict.equal(res.body.status, "success");
        assert_1.strict.ok(res.body.filename.includes("cropped"));
    }));
    (0, node_test_1.it)("should return error if no file uploaded for cropping", () => __awaiter(void 0, void 0, void 0, function* () {
        const options = {
            hostname: "localhost",
            port: port,
            path: "/img-crop?width=100&height=100&top=10&left=10",
            method: "POST",
        };
        const form = new form_data_1.default();
        const res = yield makeMultipartRequest(options, form);
        assert_1.strict.equal(res.statusCode, 400);
        assert_1.strict.equal(res.body.status, "error");
        assert_1.strict.equal(res.body.message, "No file uploaded.");
    }));
});
(0, node_test_1.describe)("POST /img-download", () => {
    let server;
    (0, node_test_1.before)((done) => __awaiter(void 0, void 0, void 0, function* () {
        yield deleteFile(path_1.default.resolve(__dirname, pathToUploads + "/test.jpg"));
        server = server_1.app.listen(port, done);
    }));
    (0, node_test_1.after)((done) => {
        server.close(done);
        (0, server_1.stop)();
    });
    (0, node_test_1.it)("should return error if no file uploaded for download", () => __awaiter(void 0, void 0, void 0, function* () {
        const options = {
            hostname: "localhost",
            port: port,
            path: "/img-downlaod",
            method: "POST",
        };
        const form = new form_data_1.default();
        const res = yield makeMultipartRequest(options, form);
        assert_1.strict.equal(res.statusCode, 400);
        assert_1.strict.equal(res.body.status, "error");
        assert_1.strict.equal(res.body.message, "No file uploaded.");
    }));
});
(0, node_test_1.describe)("POST /img-filter", () => {
    let server;
    (0, node_test_1.before)((done) => __awaiter(void 0, void 0, void 0, function* () {
        yield deleteFile(path_1.default.resolve(__dirname, pathToUploads + "/test.jpg"));
        server = server_1.app.listen(port, done);
    }));
    (0, node_test_1.after)((done) => {
        server.close(done);
        (0, server_1.stop)();
    });
    (0, node_test_1.it)("should apply grayscale filter to the image", () => __awaiter(void 0, void 0, void 0, function* () {
        const form = new form_data_1.default();
        form.append("filename", fs_1.default.createReadStream(fileName));
        const options = {
            hostname: "localhost",
            port: port,
            path: "/img-filter?filter=grayscale",
            method: "POST",
            headers: form.getHeaders(),
        };
        const res = yield makeMultipartRequest(options, form);
        assert_1.strict.equal(res.statusCode, 200);
        assert_1.strict.equal(res.body.status, "success");
        assert_1.strict.ok(res.body.filename.includes("grayscale"));
    }));
    (0, node_test_1.it)("should apply blur filter to the image", () => __awaiter(void 0, void 0, void 0, function* () {
        yield deleteFile(path_1.default.resolve(__dirname, pathToUploads + "/test.jpg"));
        const form = new form_data_1.default();
        form.append("filename", fs_1.default.createReadStream(fileName));
        const options = {
            hostname: "localhost",
            port: port,
            path: "/img-filter?filter=blur",
            method: "POST",
            headers: form.getHeaders(),
        };
        const res = yield makeMultipartRequest(options, form);
        assert_1.strict.equal(res.statusCode, 200);
        assert_1.strict.equal(res.body.status, "success");
        assert_1.strict.ok(res.body.filename.includes("blur"));
    }));
    (0, node_test_1.it)("should return error if no file uploaded for filtering", () => __awaiter(void 0, void 0, void 0, function* () {
        const options = {
            hostname: "localhost",
            port: port,
            path: "/img-filter?filter=grayscale",
            method: "POST",
        };
        const form = new form_data_1.default();
        const res = yield makeMultipartRequest(options, form);
        assert_1.strict.equal(res.statusCode, 400);
        assert_1.strict.equal(res.body.status, "error");
        assert_1.strict.equal(res.body.message, "No file uploaded.");
    }));
});
