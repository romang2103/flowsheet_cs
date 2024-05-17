"use client";
import { useState, useEffect, useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle } from "@fortawesome/free-solid-svg-icons";
import "../styles/highlight.css"; // Import the CSS file

export default function Page() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [clickedModule, setClickedModule] = useState(null);
  const [cache, setCache] = useState({});

  useEffect(() => {
    fetch("api/modules")
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
        setIsLoading(false);
      });
  }, []);

  const processData = (data) => {
    const groupedData = {};

    data.forEach((module) => {
      const year = module.year;
      const semester = module.semester ? "Semester A" : "Semester B";

      if (!groupedData[year]) {
        groupedData[year] = { semesters: {} };
      }

      if (!groupedData[year].semesters[semester]) {
        groupedData[year].semesters[semester] = [];
      }

      groupedData[year].semesters[semester].push(module);
    });

    return Object.keys(groupedData).map((year) => {
      const semesters = groupedData[year].semesters;
      let totalRows = 0;

      const processedSemesters = Object.keys(semesters).map((semester) => {
        const modules = semesters[semester];
        const rowsForSemester = Math.ceil(modules.length / 4);
        totalRows += rowsForSemester;

        return {
          name: semester,
          modules,
          rowsForSemester,
        };
      });

      return {
        year,
        semesters: processedSemesters,
        totalRows,
      };
    });
  };

  const dataWithRowSpans = useMemo(() => processData(data), [data]);

  const fetchPrerequisiteData = async (module_id) => {
    if (cache[module_id]) {
      return cache[module_id];
    }

    const prerequisiteResponse = await fetch(
      `/api/prerequisites?module_id=${module_id}`
    );
    const prerequisiteData = await prerequisiteResponse.json();

    const requirementResponse = await fetch(
      `/api/requirements?module_id=${module_id}`
    );
    const requirementData = await requirementResponse.json();

    const data = { prerequisiteData, requirementData };
    setCache((prevCache) => ({ ...prevCache, [module_id]: data }));

    return data;
  };

  const highlightPrerequisites = async (module, highlight) => {
    const module_id = module.id;
    const { prerequisiteData, requirementData } = await fetchPrerequisiteData(
      module_id
    );

    const element = document.getElementById(module_id);
    if (element) {
      element.classList.toggle("highlight-selected", highlight);
    }
    prerequisiteData.forEach((prerequisite) => {
      const element = document.getElementById(prerequisite.prerequisite_id);
      if (element) {
        element.classList.toggle("highlight-prerequisite", highlight);
      }
    });

    requirementData.forEach((requirement) => {
      const element = document.getElementById(requirement.module_id);
      if (element) {
        element.classList.toggle("highlight-requirement", highlight);
      }
    });
  };

  const handleModuleClick = async (module) => {
    if (clickedModule === module.id) {
      setClickedModule(null);
      await highlightPrerequisites(module, false);
    } else {
      if (clickedModule) {
        await highlightPrerequisites({ id: clickedModule }, false);
      }
      setClickedModule(module.id);
      await highlightPrerequisites(module, true);
    }
  };

  const handleMouseOver = async (module) => {
    if (!clickedModule) {
      await highlightPrerequisites(module, true);
    }
  };

  const handleMouseOut = async (module) => {
    if (!clickedModule) {
      await highlightPrerequisites(module, false);
    }
  };

  if (isLoading) {
    return <div className="text-center text-xl">Loading...</div>;
  }

  return (
    <div className="p-4 max-w-full overflow-x-auto">
      <table className="w-full divide-y divide-gray-200 border-collapse border border-gray-200 table-auto">
        <thead className="bg-gray-300">
          <tr>
            <th className="w-1/12 px-4 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border border-gray-200">
              Year
            </th>
            <th className="w-1/12 px-4 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border border-gray-200">
              Semester
            </th>
            <th
              className=" w-10/12 px-4 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border border-gray-200"
              colSpan={4}
            >
              <span className="ml-2">
                <FontAwesomeIcon
                  icon={faCircle}
                  className="mr-2"
                  style={{ color: "#90EE90" }}
                />
                Selected Module
              </span>
              <span className="ml-2">
                <FontAwesomeIcon
                  icon={faCircle}
                  className="mr-2"
                  style={{ color: "#ADD8E6" }}
                />
                Prerequisites
              </span>
              <span className="ml-2">
                <FontAwesomeIcon
                  icon={faCircle}
                  className="mr-2"
                  style={{ color: "#5A7D9A" }}
                />
                Required For
              </span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {dataWithRowSpans.map((yearData, yearIndex) =>
            yearData.semesters.map((semester, semesterIndex) =>
              Array.from({ length: semester.rowsForSemester }).map(
                (_, rowIndex) => (
                  <tr
                    key={`year-${yearIndex}-semester-${semesterIndex}-row-${rowIndex}`}
                  >
                    {semesterIndex === 0 && rowIndex === 0 && (
                      <td
                        rowSpan={yearData.totalRows}
                        className="px-4 py-1 whitespace-nowrap text-sm font-medium text-gray-900 border border-gray-200"
                      >
                        Year {yearData.year}
                      </td>
                    )}

                    {rowIndex === 0 && (
                      <td
                        rowSpan={semester.rowsForSemester}
                        className="px-4 py-1 whitespace-nowrap text-sm font-medium text-gray-900 border border-gray-200"
                      >
                        {semester.name}
                      </td>
                    )}

                    {Array.from({ length: 4 }).map((_, colIndex) => {
                      const moduleIndex = rowIndex * 4 + colIndex;
                      const module = semester.modules[moduleIndex];
                      return (
                        <td
                          key={`year-${yearIndex}-semester-${semesterIndex}-module-${moduleIndex}`}
                          id={module ? module.id : `null`}
                          className={`px-4 py-1 whitespace-nowrap text-sm text-gray-500 truncate ${
                            module ? "border border-gray-200" : ""
                          }`}
                          onClick={() => {
                            if (module) {
                              handleModuleClick(module);
                            }
                          }}
                          onMouseOver={() => {
                            if (module && !clickedModule) {
                              handleMouseOver(module);
                            }
                          }}
                          onMouseOut={() => {
                            if (module && !clickedModule) {
                              handleMouseOut(module);
                            }
                          }}
                        >
                          {module ? (
                            <>
                              {module.module_code}
                              <br />
                              {module.module_title}
                            </>
                          ) : (
                            ""
                          )}
                        </td>
                      );
                    })}
                  </tr>
                )
              )
            )
          )}
        </tbody>
      </table>
    </div>
  );
}
