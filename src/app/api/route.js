import { sql } from "@vercel/postgres";

export default async function handler(req, res) {
  try {
    const { rows } = await sql`
      SELECT * FROM modules 
      ORDER BY year, semester;
    `;
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
