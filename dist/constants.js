"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SENDGRID_API_KEY = exports.COOKIE_NAME = exports._prod_ = void 0;
exports._prod_ = process.env.NODE_ENV === "production";
exports.COOKIE_NAME = process.env.COOKIENAME;
exports.SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
