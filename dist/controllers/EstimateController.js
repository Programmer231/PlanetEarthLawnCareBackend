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
exports.getEstimateFile = exports.estimateUpload = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const http_error_1 = __importDefault(require("../models/http-error"));
const Estimates_1 = __importDefault(require("../models/Estimates"));
const fs_1 = __importDefault(require("fs"));
const canvas_1 = require("canvas");
const pdfkit_1 = __importDefault(require("pdfkit"));
const ObjectId = mongoose_1.default.Types.ObjectId;
const estimateUpload = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.body.estimateId;
    try {
        const estimate = yield Estimates_1.default.findOne({
            _id: new ObjectId(id.toString()),
        });
        for (let image of estimate.images) {
            fs_1.default.unlink(image);
        }
        yield Estimates_1.default.updateOne({ _id: new ObjectId(id.toString()) }, {
            images: req.files.map((file) => "/images/estimates/" + file.filename),
        });
    }
    catch (err) {
        let error = new http_error_1.default("Unknown Error Occurred", 500);
        return next(error);
    }
    return res.json({ success: true });
});
exports.estimateUpload = estimateUpload;
const getEstimateFile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.query.estimateId;
    const invoiceName = "invoice-" + id + ".pdf";
    const invoicePath = path.join(__dirname, "../images/invoices", invoiceName);
    try {
        const estimate = yield Estimates_1.default.findOne({ _id: id });
        if (req.session.userId !== estimate.userId.toString()) {
            let error = new http_error_1.default("Unauthorized", 401);
            return next(error);
        }
        const pdfDoc = new pdfkit_1.default();
        pdfDoc.pipe(fs_1.default.createWriteStream(invoicePath));
        pdfDoc.pipe(res);
        const file = fs_1.default.createReadStream(invoicePath);
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", 'attachment; filename="' + invoiceName + '"');
        pdfDoc.text("Hello World!");
        for (let image of estimate.images) {
            pdfDoc.image(image, 320, 280, { scale: 0.25 });
        }
        pdfDoc.end();
        file.pipe(res);
    }
    catch (_a) {
        let error = new http_error_1.default("Unknown Error Occurred", 500);
        return next(error);
    }
});
exports.getEstimateFile = getEstimateFile;
