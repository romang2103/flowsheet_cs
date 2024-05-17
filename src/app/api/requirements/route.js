import { sql } from "@vercel/postgres";

export async function GET(request) {
  const url = new URL(request.url);
  const module_id = url.searchParams.get("module_id");

  if (!module_id) {
    return new Response("module id is required", { status: 400 });
  }

  try {
    const { rows: requirements } =
      await sql`SELECT module_id FROM prerequisites WHERE prerequisite_id = ${module_id}`;

    return new Response(JSON.stringify(requirements), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response("Error fetching requirements", {
      status: 500,
      statusText: error.message,
    });
  }
}
