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
