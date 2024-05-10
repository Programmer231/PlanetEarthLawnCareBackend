import express from "express";

import { jobUpload } from "../controllers/JobController";
import isAdmin from "../middleware/AdminMiddleware";
import jobFileUploadMiddleware from "../middleware/jobFileUpload.js";

const router = express.Router();

router.post("/post", jobFileUploadMiddleware.array("file"), isAdmin, jobUpload);
router.post(
  "/update",
  jobFileUploadMiddleware.array("file"),
  isAdmin,
  jobUpload
);

export default router;
