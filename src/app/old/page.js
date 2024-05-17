"use client";

import { useState, useEffect } from "react";
import React, { useMemo } from "react";

export default function Home() {
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
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hover:bg-current_module"
                        onMouseOver={show_prerequisites(module)}
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
