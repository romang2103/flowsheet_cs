"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [modules, setModules] = useState([]);
  const [yearRowSpan, setYearRowSpan] = useState(2);
  const [semesterRowSpan, setSemesterRowSpan] = useState(1);

  // Fetch data from the API
  useEffect(() => {
    async function fetchData() {
      console.log("fetching data...");
      const response = await fetchData("api/modules.js");
      const data = await response.json();
      setModules(data);
      console.log(modules);
    }
    fetchData();
  }, []);

  return (
    <div>
      <p>Modules: {modules}</p>
    </div>
  );
}
