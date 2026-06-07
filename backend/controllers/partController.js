import db from "../db.js";
export const getParts = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT
        p.id,
        p.name,
        l.name AS level_name
      FROM parts p
      JOIN levels l ON l.id = p.level_id
      ORDER BY l.id, p.id
    `);

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: error.message,
    });
  }
};
