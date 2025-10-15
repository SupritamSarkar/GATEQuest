import express from "express";
import { getTests, addTest, deleteTest } from "../controllers/mockTestController.js";

const router = express.Router();
router.get("/:userId", getTests);
router.post("/:userId", addTest);
router.delete("/:userId/:testId", deleteTest);
export default router;
