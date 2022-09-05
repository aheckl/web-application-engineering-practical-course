const mongoose = require("mongoose");

const Part = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: ["gpu", "cpu", "ram", "drive", "case", "fan", "mainboard"],
  },
  price: Number,
  manufacturer: String,
  image: String,
  series: String,
  vram: Number,
  gpuSpeed: Number,
  coreCount: Number,
  cpuSocket: String,
  coreSpeed: Number,
  memorySpeed: Number,
  ram: Number,
  ramType: String,
  driveCapacity: Number,
  driveType: String,
  writeSpeed: Number,
  readSpeed: Number,
  mainboardChipset: String,
  caseType: String,
  caseColor: String,
  watts: Number,
  reviews: [
    {
      text: { type: String, require: true },
      rating: { type: Number, require: true },
      date: { type: Date, require: true },
      author: { type: String, require: true },
      author_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    },
  ],
  featured: Boolean,
});

const model = mongoose.model("Parts", Part);

module.exports = model;
