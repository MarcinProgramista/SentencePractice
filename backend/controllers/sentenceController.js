import db from "../db.js";
import { generateAudio } from "../services/ttsService.js";
import fs from "fs/promises";
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
      part_id,
    } = req.body;

    const audio_file = await generateAudio(target_text);

    const result = await db.query(
      `
      INSERT INTO sentences (
        source_language_id,
        target_language_id,
        source_text,
        target_text,
        audio_file,
        part_id
)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
      `,
      [
        source_language_id,
        target_language_id,
        source_text,
        target_text,
        audio_file,
        part_id,
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

    const sentenceResult = await db.query(
      `
      SELECT *
      FROM sentences
      WHERE id = $1
      `,
      [id],
    );

    if (sentenceResult.rowCount === 0) {
      return res.status(404).json({
        error: "Sentence not found",
      });
    }

    const sentence = sentenceResult.rows[0];

    if (sentence.audio_file) {
      try {
        await fs.unlink(`audio/${sentence.audio_file}`);
      } catch (error) {
        console.log("Audio file not found:", error.message);
      }
    }

    await db.query(
      `
      DELETE FROM sentences
      WHERE id = $1
      `,
      [id],
    );

    res.json({
      message: "Sentence deleted",
      sentence,
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
      part_id,
    } = req.body;

    const existingSentence = await db.query(
      `
      SELECT *
      FROM sentences
      WHERE id = $1
      `,
      [id],
    );

    if (existingSentence.rowCount === 0) {
      return res.status(404).json({
        error: "Sentence not found",
      });
    }

    const oldSentence = existingSentence.rows[0];

    if (oldSentence.audio_file) {
      try {
        await fs.unlink(`audio/${oldSentence.audio_file}`);
      } catch (error) {
        console.log("Audio file not found:", error.message);
      }
    }

    const audio_file = await generateAudio(target_text);

    const result = await db.query(
      `
     UPDATE sentences
      SET
        source_language_id = $1,
        target_language_id = $2,
        source_text = $3,
        target_text = $4,
        audio_file = $5,
        part_id = $6
      WHERE id = $7
      RETURNING *
      `,
      [
        source_language_id,
        target_language_id,
        source_text,
        target_text,
        audio_file,
        part_id,
        id,
      ],
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.log("updateSentence error", error);
    res.status(500).json({ error: error.message });
  }
};

export const incrementReviewCount = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      `
      UPDATE sentences
      SET review_count = review_count + 1
      WHERE id = $1
      RETURNING *
      `,
      [id],
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

export const updateRating = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, learningMode } = req.body;

    const column = learningMode === "DE_EN" ? "rating_de_en" : "rating_en_de";

    const result = await db.query(
      `
      UPDATE sentences
      SET ${column} = $1
      WHERE id = $2
      RETURNING *
      `,
      [rating, id],
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};
