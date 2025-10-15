import MockTest from "../models/MockTest.js";

export const getTests = async (req, res) => {
  const tests = await MockTest.find({ userId: req.params.userId }).sort({ timestamp: -1 });
  res.json(tests);
};

export const addTest = async (req, res) => {
  const newTest = new MockTest({ userId: req.params.userId, ...req.body });
  await newTest.save();
  res.json(newTest);
};

export const deleteTest = async (req, res) => {
  await MockTest.findOneAndDelete({ _id: req.params.testId, userId: req.params.userId });
  res.json({ message: "Deleted successfully" });
};
