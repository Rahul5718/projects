const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  level: { type: String, required: true },
  tech: [{ type: String }],
  location: { type: String, required: true },
  postedDay: { type: String, required: true },
});

module.exports = mongoose.model("job", jobSchema);