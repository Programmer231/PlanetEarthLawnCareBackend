"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_error_1 = __importDefault(require("../models/http-error"));
const middleware = (req, res, next) => {
    if (req.method === "OPTIONS") {
        console.log("Skipping");
        return next();
    }
    if (req.session && req.session.userId && req.session.admin) {
        next();
    }
    else {
        const error = new http_error_1.default("Authentication failed! Please login!", 401);
        return next(error);
    }
};
exports.default = middleware;
