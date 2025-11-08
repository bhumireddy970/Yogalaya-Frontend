import React, { useEffect, useState } from "react";
import api from "../api/client";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function Competitions() {
  const [comps, setComps] = useState([]);
  const { role } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/competitions")
      .then((res) => setComps(res.data))
      .catch(console.error);
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/work-tracker")}
          className="px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold rounded-xl shadow-xl transition-all duration-300"
        >
          Time Table
        </motion.button>
        <h1 className="text-2xl font-semibold text-slate-800">Competitions</h1>
        {role === "admin" && (
          <Link
            to="/admin/competitions/create"
            className="text-sm px-4 py-2 border rounded bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition"
          >
            + Create
          </Link>
        )}
      </div>

      {/* Competition Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        {comps.map((c) => (
          <div
            key={c._id}
            className="p-5 rounded-2xl shadow-sm border bg-white hover:shadow-md transition"
          >
            <div className="flex justify-between">
              <h3 className="text-lg font-semibold text-slate-700">
                {c.title}
              </h3>
              <span className="text-sm text-slate-500">
                {new Date(c.date).toLocaleDateString()}
              </span>
            </div>
            <p className="text-slate-600 mt-2 line-clamp-3">{c.description}</p>
            <div className="mt-3 flex items-center justify-between">
              <Link
                to={`/competitions/${c._id}`}
                className="text-indigo-600 hover:underline text-sm"
              >
                Details
              </Link>
              <span
                className={`text-xs px-2 py-1 rounded ${
                  c.status === "upcoming"
                    ? "bg-yellow-50 text-yellow-700"
                    : c.status === "ongoing"
                    ? "bg-green-50 text-green-700"
                    : "bg-gray-50 text-gray-500"
                }`}
              >
                {c.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
