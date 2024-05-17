// app/page.js (or any other page file in the app directory)
import { sql } from "@vercel/postgres";

async function getData() {
  try {
    const { rows } = await sql`SELECT * FROM modules`;
    return rows;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw new Error("Failed to fetch data");
  }
}

export default async function Page() {
  const data = await getData();

  return (
    <main>
      <h1>Test Data from Database</h1>
      <ul>
        {data.map((item, index) => (
          <li key={index}>
            {item.module_code}: {item.module_title} (Year: {item.year},
            Semester: {item.semester ? "A" : "B"})
          </li>
        ))}
      </ul>
    </main>
  );
}
