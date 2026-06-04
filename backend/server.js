import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import db from "./db.js";
import path from "path";
import { fileURLToPath } from "url";
import sentenceRoutes from "./routes/sentenceRoutes.js";
import languageRoutes from "./routes/languageRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

app.use(cors());
app.use(express.json());
app.get("/test-db", async (req, res) => {
  try {
    const result = await db.query("SELECT current_database()");

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});
app.get("/", (req, res) => {
  res.json({ message: "Language Learning API" });
});
app.use("/audio", express.static(path.join(__dirname, "audio")));
app.use("/api/languages", languageRoutes);
app.use("/api/sentences", sentenceRoutes);
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
