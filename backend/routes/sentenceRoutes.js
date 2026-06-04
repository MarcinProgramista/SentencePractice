import express from "express";
import {
  getSentences,
  createSentence,
} from "../controllers/sentenceController.js";

const router = express.Router();

router.get("/", getSentences);
router.post("/", createSentence);

export default router;
