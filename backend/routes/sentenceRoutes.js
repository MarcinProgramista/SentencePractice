import express from "express";
import { getSentenses } from "../controllers/sentenceController.js";

const router = express.Router();

router.get("/", getSentenses);

export default router;
