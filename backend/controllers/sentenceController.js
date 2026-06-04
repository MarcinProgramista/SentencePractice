import db from "../db.js";

/* ==============================
    GET ALL SENTENCES 
=================================*/
export const getSentenses = async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM sentences ORDER BY id", []);
    res.json(result.rows);
  } catch (error) {
    console.log("getSentenses error", error);
    res.status(500).json({ error: error.message });
  }
};

/* ==============================
    CREATE SENTENCE
=================================*/
export const createSentence = async (req, res) => {
  try {
    const {
      source_language_id,
      target_language_id,
      source_text,
      target_text,
      audio_file,
    } = req.body;

    const result = await db.query(
      `
      INSERT INTO sentences (
        source_language_id,
        target_language_id,
        source_text,
        target_text,
        audio_file
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
      `,
      [
        source_language_id,
        target_language_id,
        source_text,
        target_text,
        audio_file,
      ],
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.log("createSentence error", error);
    res.status(500).json({ error: error.message });
  }
};
