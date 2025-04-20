const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: false, 
    },
    url: { 
      type: String,
      required: [true, "URL is required"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("urls", urlSchema);