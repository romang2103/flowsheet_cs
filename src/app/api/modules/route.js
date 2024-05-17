import { sql } from "@vercel/postgres";

export async function GET(request) {
  try {
    const { rows } = await sql`SELECT * FROM modules`;
    console.log("Fetched rows:", rows); // Add for debugging
    return new Response(JSON.stringify(rows), {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch data" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
