import { sql } from "@vercel/postgres";

export async function GET(request) {
  const url = new URL(request.url);
  const module_id = url.searchParams.get("module_id");

  if (!module_id) {
    return new Response("module id is required", { status: 400 });
  }

  try {
    const { rows: prerequisites } = await sql`
          SELECT prerequisite_id FROM prerequisites WHERE module_id = ${module_id}
        `;

    return new Response(JSON.stringify(prerequisites), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response("Error fetching prerequisites", {
      status: 500,
      statusText: error.message,
    });
  }
}
