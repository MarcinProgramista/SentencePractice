import db from "../db.js";

/* ==============================
    GET ALL SENTENCES 
=================================*/
export const getSentences = async (req, res) => {
  try {
    const result = await db.query(`
    SELECT
        s.*,
        sl.code AS source_language_code,
        tl.code AS target_language_code,
        sl.name AS source_language_name,
        tl.name AS target_language_name
    FROM sentences s
    JOIN languages sl
        ON s.source_language_id = sl.id
    JOIN languages tl
        ON s.target_language_id = tl.id
    ORDER BY s.id
`);
    res.json(result.rows);
  } catch (error) {
    console.log("getSentences error", error);
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
