import express from "express";
import {
  getSentences,
  createSentence,
  deleteSentence,
} from "../controllers/sentenceController.js";

const router = express.Router();

router.get("/", getSentences);
router.post("/", createSentence);
router.delete("/:id", deleteSentence);

export default router;
