const mongoose = require("mongoose")

const postSchema = new mongoose.Schema({
     title: { type: String, required: true },
     description: { type: String },
     mediaUrl: { type: String, required: true }, // image or video link
     mediaType: { type: String, enum: ["image", "video"], required: true },
     category: { type: String, required: true }, // e.g. "Python", "React", "DSA"
     author: { type: String, default: "Anonymous" },
     createdAt: { type: Date, default: Date.now },
})

module.exports = mongoose.model("Post", postSchema);