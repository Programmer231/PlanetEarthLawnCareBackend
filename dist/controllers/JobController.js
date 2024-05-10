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
exports.jobUpload = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const AvailableJobs_1 = __importDefault(require("../models/AvailableJobs"));
const http_error_1 = __importDefault(require("../models/http-error"));
const jobUpload = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const job = new AvailableJobs_1.default({
        name: req.body.name,
        description: req.body.description,
        images: req.files.map((file) => "/images/jobs/" + file.filename),
    });
    try {
        yield job.save();
    }
    catch (error) {
        if (error.code == 11000) {
            let fileUploadError = new http_error_1.default("This job already exists in the database, please enter a different one", 400);
            return next(fileUploadError);
        }
        let fileUploadError = new http_error_1.default("Unknown Error Occurred", 500);
        return next(fileUploadError);
    }
    return res.json({ success: true });
});
exports.jobUpload = jobUpload;
