import express from "express";

import { jobUpload } from "../controllers/JobController";
import isAdmin from "../middleware/AdminMiddleware";
import fileUploadMiddleware from "../middleware/fileupload.js";

const router = express.Router();

router.post("/post", fileUploadMiddleware.array("file"), isAdmin, jobUpload);

export default router;
