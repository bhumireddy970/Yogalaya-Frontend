// src/pages/WorkAnalysis.jsx
import React, { useEffect, useRef, useState } from "react";
import api from "../api/client";
import BackButton from "../Back";

export default function WorkAnalysis() {
  const [records, setRecords] = useState([]);
  const [students, setStudents] = useState([]);
  const [mergedAll, setMergedAll] = useState([]);
  const [mergedFiltered, setMergedFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [studentFilter, setStudentFilter] = useState("");
  const [showOnlyNotFilled, setShowOnlyNotFilled] = useState(false); // ✅ New toggle

  const searchRef = useRef(null);
  const debounceRef = useRef(null);

  // 🔹 Fetch merged hourly records (from backend)
  const fetchRecords = async () => {
    try {
      const res = await api.get("/work/hourly/all", {
        params: {
          date: dateFilter || undefined,
          studentId: studentFilter || undefined,
        },
      });
      return Array.isArray(res.data) ? res.data : [];
    } catch (err) {
      console.error("❌ Error fetching records:", err);
      setError("Failed to load records.");
      return [];
    }
  };

  // 🔹 Fetch All Approved Students
  const fetchStudents = async () => {
    try {
      const res = await api.get("/auth/users");
      return Array.isArray(res.data) ? res.data : [];
    } catch (err) {
      console.error("❌ Error fetching students:", err);
      return [];
    }
  };

  // 🔹 Merge backend data + missing students
  const combineWithMissingStudents = (studentsList, recordsList) => {
    const today = dateFilter || new Date().toISOString().split("T")[0];
    const map = {};

    // Add all work records
    for (const rec of recordsList) {
      const key = `${rec.studentId}_${rec.date}_${rec.hour}`;
      map[key] = {
        name: rec.name,
        studentId: rec.studentId,
        date: rec.date,
        hour: rec.hour,
        planned: rec.planned || "",
        actual: rec.actual || "",
      };
    }

    // Add missing students
    for (const stu of studentsList) {
      const hasRecordForDate = Object.values(map).some(
        (r) => r.studentId === stu.studentId && r.date === today
      );

      if (!hasRecordForDate) {
        const key = `${stu.studentId}_${today}_—`;
        map[key] = {
          name: stu.name,
          studentId: stu.studentId,
          date: today,
          hour: "—",
          planned: "",
          actual: "",
        };
      }
    }

    return Object.values(map);
  };

  // 🔹 Load all data
  const loadData = async () => {
    try {
      setLoading(true);
      const [studentsList, recordsList] = await Promise.all([
        fetchStudents(),
        fetchRecords(),
      ]);

      setStudents(studentsList);
      setRecords(recordsList);

      const merged = combineWithMissingStudents(studentsList, recordsList);
      setMergedAll(merged);

      const filtered = applyFilters(merged, studentFilter, showOnlyNotFilled);
      setMergedFiltered(filtered);
    } catch (err) {
      console.error("Error loading data:", err);
      setError("Failed to load data.");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Combined filter: search + toggle
  const applyFilters = (dataArray, filterStr, onlyNotFilled) => {
    let filtered = dataArray;

    // Search filter
    if (filterStr && filterStr.trim() !== "") {
      const q = filterStr.trim().toLowerCase();
      filtered = filtered.filter(
        (row) =>
          (row.studentId && row.studentId.toLowerCase().includes(q)) ||
          (row.name && row.name.toLowerCase().includes(q))
      );
    }

    // Not filled filter
    if (onlyNotFilled) {
      filtered = filtered.filter((r) => !r.planned && !r.actual);
    }

    return filtered;
  };

  // ✅ Debounced loader
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      await loadData();
    }, 500);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [dateFilter, studentFilter, showOnlyNotFilled]);

  // ✅ Autofocus search box
  useEffect(() => {
    if (searchRef.current) {
      searchRef.current.focus();
      const len = searchRef.current.value.length;
      searchRef.current.setSelectionRange(len, len);
    }
  }, []);

  // ✅ Initial load
  useEffect(() => {
    loadData();
  }, []);

  const handleReset = () => {
    setDateFilter("");
    setStudentFilter("");
    setShowOnlyNotFilled(false);
    loadData();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-green-700 font-semibold text-xl">
        Loading hourly work records...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen text-red-600 font-semibold text-xl">
        {error}
      </div>
    );
  }

  // 🔹 Stats
  const totalStudents = students.length;
  const filledStudents = new Set(records.map((r) => r.studentId)).size;
  const notFilledStudents = totalStudents - filledStudents;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-200 p-6">
      <BackButton to="/adminpage" />

      <h1 className="text-4xl font-extrabold mb-2 text-green-800 text-center drop-shadow-lg">
        Planned vs Actual Work Analysis
      </h1>

      {/* 📊 Summary Stats */}
      <div className="flex flex-wrap justify-center gap-6 mb-6 text-center">
        <div className="bg-white p-4 rounded-lg shadow-lg w-64 border-t-4 border-green-600">
          <h2 className="text-lg font-semibold text-gray-700">
            Total Students
          </h2>
          <p className="text-3xl font-bold text-green-700">{totalStudents}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-lg w-64 border-t-4 border-blue-500">
          <h2 className="text-lg font-semibold text-gray-700">Filled</h2>
          <p className="text-3xl font-bold text-blue-600">{filledStudents}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-lg w-64 border-t-4 border-red-500">
          <h2 className="text-lg font-semibold text-gray-700">Not Filled</h2>
          <p className="text-3xl font-bold text-red-600">{notFilledStudents}</p>
        </div>
      </div>

      {/* 🔍 Filters */}
      <div className="flex flex-col md:flex-row gap-4 justify-center items-center mb-6">
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="border border-green-400 rounded-lg px-4 py-2 focus:ring focus:ring-green-300"
        />

        <input
          ref={searchRef}
          type="text"
          placeholder="Search by Student ID or Name"
          value={studentFilter}
          onChange={(e) => setStudentFilter(e.target.value)}
          autoFocus
          className="border border-green-400 rounded-lg px-4 py-2 focus:ring focus:ring-green-300"
        />

        <div className="flex items-center gap-2">
          <input
            id="notfilled"
            type="checkbox"
            checked={showOnlyNotFilled}
            onChange={(e) => setShowOnlyNotFilled(e.target.checked)}
            className="w-5 h-5 accent-red-500 cursor-pointer"
          />
          <label
            htmlFor="notfilled"
            className="text-sm font-medium text-gray-700 select-none cursor-pointer"
          >
            Show Only Not Filled
          </label>
        </div>

        <button
          onClick={handleReset}
          className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition"
        >
          Reset
        </button>
      </div>

      {/* 📋 Table */}
      <div className="bg-white shadow-xl rounded-xl p-4 overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-green-100 text-green-900">
            <tr>
              <th className="p-3 border">Name</th>
              <th className="p-3 border">ID No</th>
              <th className="p-3 border">Date</th>
              <th className="p-3 border">Hour</th>
              <th className="p-3 border text-blue-600">Planned Work</th>
              <th className="p-3 border text-green-700">Actual Work</th>
            </tr>
          </thead>

          <tbody>
            {mergedFiltered.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  className="text-center p-6 text-gray-500 italic"
                >
                  No records found.
                </td>
              </tr>
            ) : (
              mergedFiltered.map((r, i) => (
                <tr
                  key={`${r.studentId}_${r.date}_${r.hour}_${i}`}
                  className={`border-b hover:bg-green-50 transition text-sm ${
                    !r.planned && !r.actual ? "bg-red-50/50" : ""
                  }`}
                >
                  <td className="p-3 border">{r.name}</td>
                  <td className="p-3 border">{r.studentId}</td>
                  <td className="p-3 border">{r.date}</td>
                  <td className="p-3 border font-semibold">{r.hour}</td>
                  <td className="p-3 border text-blue-700">
                    {r.planned || <span className="text-gray-400">—</span>}
                  </td>
                  <td className="p-3 border text-green-700">
                    {r.actual || <span className="text-gray-400">—</span>}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
