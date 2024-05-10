"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const JobController_1 = require("../controllers/JobController");
const AdminMiddleware_1 = __importDefault(require("../middleware/AdminMiddleware"));
const jobFileUpload_js_1 = __importDefault(require("../middleware/jobFileUpload.js"));
const router = express_1.default.Router();
router.post("/post", jobFileUpload_js_1.default.array("file"), AdminMiddleware_1.default, JobController_1.jobUpload);
router.post("/update", jobFileUpload_js_1.default.array("file"), AdminMiddleware_1.default, JobController_1.jobUpload);
exports.default = router;
