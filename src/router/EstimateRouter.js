import express from "express";

import {
  estimateUpload,
  getEstimateFile,
} from "../controllers/EstimateController";
import isAdmin from "../middleware/AdminMiddleware";
import estimateFileUploadMiddleware from "../middleware/estimateFileUpload.js";

const router = express.Router();

router.post(
  "/post",
  estimateFileUploadMiddleware.array("file"),
  isAdmin,
  estimateUpload
);

router.get("/view/:estimateId", getEstimateFile);

export default router;
