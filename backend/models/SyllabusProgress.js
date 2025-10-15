import mongoose from "mongoose";

const syllabusSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  syllabus: { type: Object, default: {} },
  pyq: { type: Object, default: {} },
});

export default mongoose.model("SyllabusProgress", syllabusSchema);
