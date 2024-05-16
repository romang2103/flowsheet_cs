"use client";

import { useState, useEffect } from "react";
import React, { useMemo } from "react";

export default function Home() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [distinctYears, setDistinctYears] = useState([]);

  useEffect(() => {
    fetch("/api/modules")
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setIsLoading(false);
        // calculateYears(data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      });
  }, []);

  const processData = (data) => {
    const groupedData = {};

    // For each module
    data.forEach((module) => {
      // Year = year
      // Semester = Sem A or Sem B
      const year = module.year;
      const semester = module.semester ? "Semester A" : "Semester B";

      // If the year doesn't exist in groupedData, include a key-value pair of { year: semesters: {} }
      if (!groupedData[year]) {
        groupedData[year] = { semesters: {} };
      }

      // If the semester doesn't exist within the year, add an array into the value of the semester key - { year: semesters: { A: [], B: [] } }
      if (!groupedData[year].semesters[semester]) {
        groupedData[year].semesters[semester] = [];
      }

      // Add the module into the semester array - { year: semesters: { A: [module], B: [] } }
      groupedData[year].semesters[semester].push(module);

      // Final result - groupedData =
      // { 1: { semesters: { A: [module1, module2, etc...], B: [module1, module2, etc...] } },
      //   2: { semesters: { A: [module1, module2, etc...], B: [module1, module2, etc...] } },
      //   3: { semesters: { A: [module1, module2, etc...], B: [module1, module2, etc...] } }, }
    });

    // { 1: { semesters: { A: [module1, module2, etc...], B: [module1, module2, etc...] } }
    // For each year
    return Object.keys(groupedData).map((year) => {
      // Year = 1
      // semesters = { A: [module1, etc...], b: [module2, etc...] }
      const semesters = groupedData[year].semesters;
      let totalRows = 0;

      // For each semester in the year
      const processedSemesters = Object.keys(semesters).map((semester) => {
        // semester = A
        // modules = [module1, etc...]
        const modules = semesters[semester];
        // Calculate number of rows - number of modules / 4 rounded up
        const rowsForSemester = Math.ceil(modules.length / 4);
        // Update totalRows
        totalRows += rowsForSemester;

        // Return
        // name: A
        // modules: [module1, etc...]
        // rowSpan: 5 (example)
        return {
          name: semester,
          modules,
          rowSpan: rowsForSemester,
        };
      });

      // Return
      // year = 1
      // semesters: A, B
      // rowSpan = 3 (example)
      return {
        year,
        semesters: processedSemesters,
        rowSpan: totalRows,
      };
    });
  };

  console.log("data: ", data);
  // console.log("Distinct Years: ", distinctYears);

  // if (isLoading) return <p className="px-4 mt-12">Loading modules...</p>;
  // if (!data || data.length === 0) return <p>No module data</p>;

  // Use memoization to cache data - only recomputes when data dependency changes
  // dataWithRowSpans = [ { year: 1, semesters: [ { name: A, modules: [module1,etc...] ] , rowSpan: 2 }, { name: B, modules: [module1,etc...], rowSpan: 1 } ], rowSpan: 3 }
  const dataWithRowSpans = useMemo(() => processData(data), [data]);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Year
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Semester
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Module 1
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Module 2
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Module 3
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Module 4
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {/* dataWithRowSpans = [ { year: 1, semesters: [ { name: A, modules: [module1,etc...] ] , rowSpan: 2 }, { name: B, modules: [module1,etc...], rowSpan: 1 } ], rowSpan: 3 } */}
          {/* For each year */}
          {dataWithRowSpans.map((yearData, yearIndex) =>
            // For each semester in the year
            yearData.semesters.map((semester, semesterIndex) =>
              // For each row needed for the semester
              // Creates an array with length = semester.rowSpan
              Array.from({ length: semester.rowSpan }).map((_, rowIndex) => (
                <tr
                  key={`year-${yearIndex}-semester-${semesterIndex}-row-${rowIndex}`}
                >
                  {/* Render the year cell only once at the start of the first semester */}
                  {semesterIndex === 0 && rowIndex === 0 && (
                    <td
                      rowSpan={yearData.rowSpan}
                      className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
                    >
                      {yearData.year}
                    </td>
                  )}
                  {/* Render the semester cell only once at the start of the semester */}
                  {rowIndex === 0 && (
                    <td
                      rowSpan={semester.rowSpan}
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                    >
                      {semester.name}
                    </td>
                  )}
                  {/* Render module cells */}
                  {Array.from({ length: 4 }).map((_, colIndex) => {
                    const moduleIndex = rowIndex * 4 + colIndex;
                    const module = semester.modules[moduleIndex];
                    return (
                      <td
                        key={`module-${colIndex}`}
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                      >
                        {module
                          ? `${module.module_code} - ${module.module_title}`
                          : ""}
                      </td>
                    );
                  })}
                </tr>
              ))
            )
          )}
        </tbody>
      </table>
    </div>
  );
}
