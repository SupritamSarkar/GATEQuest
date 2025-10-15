import SyllabusProgress from "../models/SyllabusProgress.js";

export const getProgress = async (req, res) => {
  try {
    const data = await SyllabusProgress.findOne({ userId: req.params.userId });
    res.json(data || {});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateProgress = async (req, res) => {
  try {
    const { syllabus, pyq } = req.body;
    const userId = req.params.userId;

    const updated = await SyllabusProgress.findOneAndUpdate(
      { userId },
      { syllabus, pyq },
      { new: true, upsert: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
