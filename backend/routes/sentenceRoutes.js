import express from "express";
import {
  getSentences,
  createSentence,
  deleteSentence,
  searchSentences,
  getSentenceById,
  updateSentence,
  incrementReviewCount,
  updateRating,
} from "../controllers/sentenceController.js";

const router = express.Router();

router.get("/search", searchSentences);
router.get("/:id", getSentenceById);
router.get("/", getSentences);
router.post("/", createSentence);
router.put("/:id", updateSentence);
router.delete("/:id", deleteSentence);
router.post("/:id/review", incrementReviewCount);
router.post("/:id/rating", updateRating);
export default router;
