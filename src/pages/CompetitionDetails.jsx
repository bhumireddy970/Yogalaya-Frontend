import React, { useEffect, useState } from "react";
import api from "../api/client";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import BackButton from "../Back";

export default function CompetitionDetails() {
  const { id } = useParams();
  const [comp, setComp] = useState(null);
  const { user } = useSelector((state) => state.auth);
  const role = user?.role;

  const navigate = useNavigate();

  useEffect(() => {
    api
      .get(`/competitions/${id}`)
      .then((r) => setComp(r.data))
      .catch(() => {});
  }, [id]);

  if (!comp) return <div className="text-center py-10">Loading...</div>;

  return (
    <>
      <BackButton to="/competitions" />
      <div className="max-w-3xl mx-auto p-6 rounded-2xl shadow-sm border bg-white">
        {/* Title + Date */}
        <div className="flex justify-between items-start">
          <h1 className="text-2xl font-semibold text-slate-800">
            {comp.title}
          </h1>
          <span className="text-sm text-slate-500">
            {new Date(comp.date).toLocaleDateString()}
          </span>
        </div>

        {/* Description */}
        <p className="mt-3 text-slate-600">{comp.description}</p>

        {/* Circular */}
        {comp.circular && (
          <div className="mt-4">
            <a
              href={`${
                import.meta.env.VITE_API_URL || "http://localhost:5000"
              }${comp.circular}`}
              target="_blank"
              rel="noreferrer"
              className="text-indigo-600 hover:underline text-sm"
            >
              📄 View circular
            </a>
          </div>
        )}

        {/* Actions */}
        <div className="mt-6 flex gap-3">
          {role === "user" ? (
            <button
              onClick={() => navigate(`/register-competition/${id}`)}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
            >
              Register as Athlete
            </button>
          ) : role === "admin" ? null : (
            <Link
              to="/login"
              className="px-4 py-2 bg-yellow-100 border rounded text-slate-700 hover:bg-yellow-200 transition"
            >
              Login to Register
            </Link>
          )}
        </div>
      </div>
    </>
  );
}
