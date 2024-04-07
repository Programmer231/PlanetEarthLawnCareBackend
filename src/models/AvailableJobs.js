const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const jobSchema = new Schema({
  name: { type: String, required: true },
  images: [{ type: String, required: false }],
});

module.exports = mongoose.model("available_jobs", jobSchema);
