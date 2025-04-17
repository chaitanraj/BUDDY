const mongoose = require("mongoose");
const urlSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    email: {
      type: String,
      require: [true, "URL is required"],
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("urls", urlSchema);