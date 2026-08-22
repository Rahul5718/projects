const mongoose = require("mongoose");

const collectionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    recipes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Recipe" }]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Collection", collectionSchema);