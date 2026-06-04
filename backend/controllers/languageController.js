import db from "../db.js";

/* ==============================
    GET ALL LANGUAGES
=================================*/
export const getLanguages = async (req, res) => {
  try {
    const result = await db.query(
      `
      SELECT *
      FROM languages
      ORDER BY name
      `,
    );

    res.json(result.rows);
  } catch (error) {
    console.log("getLanguages error", error);
    res.status(500).json({ error: error.message });
  }
};
