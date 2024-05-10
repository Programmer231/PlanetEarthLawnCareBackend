"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const multer = require("multer");
const { v4 } = require("uuid");
const path = require("path");
const MIME_TYPE_MAP = {
    "image/png": "png",
    "image/jpeg": "jpeg",
    "image/jpg": "jpg",
};
const jobFileUpload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, path.join(__dirname, "../images/jobs"));
        },
        filename: (req, file, cb) => {
            const ext = MIME_TYPE_MAP[file.mimetype];
            cb(null, v4() + "." + ext);
        },
    }),
    fileFilter: (req, file, cb) => {
        const isValid = !!MIME_TYPE_MAP[file.mimetype];
        let error = isValid ? null : new Error("Invalid mime type!");
        cb(error, isValid);
    },
    error: (err) => {
        console.log(err);
    },
});
module.exports = jobFileUpload;
