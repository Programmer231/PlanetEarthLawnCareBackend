const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const EstimateSchema = new Schema({
  createdAt: { type: Date, required: true },
  updatedAt: { type: Date, required: true },
  jobs: [
    {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "available_jobs",
      },
      cost: { type: Number, required: true },
      quantity: { type: Number, required: true },
      name: { type: String, required: true },
    },
  ],
  accepted: { type: String, required: true },
  name: { type: String, required: true },
  address: { type: String, required: true },
  totalCost: { type: Number, required: true },
  images: [{ type: String, required: false }],
  checked: { type: String, required: true },
});

module.exports = mongoose.model("estimates", EstimateSchema);
