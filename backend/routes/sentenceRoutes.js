import express from "express";
import {
  getSentences,
  createSentence,
  deleteSentence,
  searchSentences,
  getSentenceById,
} from "../controllers/sentenceController.js";

const router = express.Router();

router.get("/search", searchSentences);
router.get("/:id", getSentenceById);
router.get("/", getSentences);
router.post("/", createSentence);
router.delete("/:id", deleteSentence);

export default router;
