const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const jobSchema = new Schema({
  name: { type: String, required: true },
  images: [{ type: String, required: false }],
  description: { type: String, required: true },
});

module.exports = mongoose.model("available_jobs", jobSchema);
