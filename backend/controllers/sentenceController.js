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

/* ==============================
    DELETE SENTENCE
=================================*/
export const deleteSentence = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      `
      DELETE FROM sentences
      WHERE id = $1
      RETURNING *
      `,
      [id],
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        error: "Sentence not found",
      });
    }

    res.json({
      message: "Sentence deleted",
      sentence: result.rows[0],
    });
  } catch (error) {
    console.log("deleteSentence error", error);
    res.status(500).json({ error: error.message });
  }
};

export const searchSentences = async (req, res) => {
  try {
    const { q } = req.query;

    const result = await db.query(
      `
      SELECT *
      FROM sentences
      WHERE source_text ILIKE $1
         OR target_text ILIKE $1
      ORDER BY id
      `,
      [`%${q}%`],
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getSentenceById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      `
      SELECT *
      FROM sentences
      WHERE id = $1
      `,
      [id],
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        error: "Sentence not found",
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.log("getSentenceById error", error);
    res.status(500).json({ error: error.message });
  }
};

/* ==============================
    UPDATE SENTENCE
=================================*/
export const updateSentence = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      source_language_id,
      target_language_id,
      source_text,
      target_text,
      audio_file,
    } = req.body;

    const result = await db.query(
      `
      UPDATE sentences
      SET
        source_language_id = $1,
        target_language_id = $2,
        source_text = $3,
        target_text = $4,
        audio_file = $5
      WHERE id = $6
      RETURNING *
      `,
      [
        source_language_id,
        target_language_id,
        source_text,
        target_text,
        audio_file,
        id,
      ],
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        error: "Sentence not found",
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.log("updateSentence error", error);
    res.status(500).json({ error: error.message });
  }
};
