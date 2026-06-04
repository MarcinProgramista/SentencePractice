import express from "express";
import {
  getSentenses,
  createSentence,
} from "../controllers/sentenceController.js";

const router = express.Router();

router.get("/", getSentenses);
router.post("/", createSentence);

export default router;
