"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const EstimateController_1 = require("../controllers/EstimateController");
const AdminMiddleware_1 = __importDefault(require("../middleware/AdminMiddleware"));
const estimateFileUpload_js_1 = __importDefault(require("../middleware/estimateFileUpload.js"));
const router = express_1.default.Router();
router.post("/post", estimateFileUpload_js_1.default.array("file"), AdminMiddleware_1.default, EstimateController_1.estimateUpload);
router.get("/view/:estimateId", EstimateController_1.getEstimateFile);
exports.default = router;
