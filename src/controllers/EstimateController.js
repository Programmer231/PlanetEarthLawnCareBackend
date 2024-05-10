import mongoose from "mongoose";
import HttpError from "../models/http-error";
import Estimates from "../models/Estimates";
import fs from "fs";
import { loadImage } from "canvas";
import PDFDocument from "pdfkit";

const ObjectId = mongoose.Types.ObjectId;

export const estimateUpload = async (req, res, next) => {
  const id = req.body.estimateId;

  try {
    const estimate = await Estimates.findOne({
      _id: new ObjectId(id.toString()),
    });

    for (let image of estimate.images) {
      fs.unlink(image);
    }
    await Estimates.updateOne(
      { _id: new ObjectId(id.toString()) },
      {
        images: req.files.map((file) => "/images/estimates/" + file.filename),
      }
    );
  } catch (err) {
    let error = new HttpError("Unknown Error Occurred", 500);
    return next(error);
  }

  return res.json({ success: true });
};

export const getEstimateFile = async (req, res, next) => {
  const id = req.query.estimateId;

  const invoiceName = "invoice-" + id + ".pdf";
  const invoicePath = path.join(__dirname, "../images/invoices", invoiceName);

  try {
    const estimate = await Estimates.findOne({ _id: id });

    if (req.session.userId !== estimate.userId.toString()) {
      let error = new HttpError("Unauthorized", 401);
      return next(error);
    }

    const pdfDoc = new PDFDocument();

    pdfDoc.pipe(fs.createWriteStream(invoicePath));
    pdfDoc.pipe(res);

    const file = fs.createReadStream(invoicePath);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="' + invoiceName + '"'
    );

    pdfDoc.text("Hello World!");

    for (let image of estimate.images) {
      pdfDoc.image(image, 320, 280, { scale: 0.25 });
    }

    pdfDoc.end();

    file.pipe(res);
  } catch {
    let error = new HttpError("Unknown Error Occurred", 500);
    return next(error);
  }
};
