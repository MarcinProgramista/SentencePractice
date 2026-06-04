import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import db from "./db.js";
import sentenceRoutes from "./routes/sentenceRoutes.js";

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
app.use("/api/sentences", sentenceRoutes);
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
