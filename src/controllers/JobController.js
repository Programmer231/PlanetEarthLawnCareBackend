import mongoose from "mongoose";
import AvailableJobs from "../models/AvailableJobs";
import HttpError from "../models/http-error";

export const jobUpload = async (req, res, next) => {
  const job = new AvailableJobs({
    name: req.body.name,
    description: req.body.description,
    images: req.files.map((file) => "/images/jobs/" + file.filename),
  });
  try {
    await job.save();
  } catch (error) {
    if (error.code == 11000) {
      let fileUploadError = new HttpError(
        "This job already exists in the database, please enter a different one",
        400
      );

      return next(fileUploadError);
    }
    let fileUploadError = new HttpError("Unknown Error Occurred", 500);
    return next(fileUploadError);
  }

  return res.json({ success: true });
};
