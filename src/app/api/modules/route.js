import { sql } from "@vercel/postgres";

export async function GET(request) {
  const { rows } = await sql`SELECT * FROM modules`;
  return Response.json(rows);

  // const data = {
  //   id: 1,
  //   name: "test",
  //   description: "description",
  // };

  // return Response.json(data);
}
