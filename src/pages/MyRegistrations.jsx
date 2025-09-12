// src/pages/MyRegistrations.jsx
import React, { useState, useEffect } from "react";
import api from "../api/client";
import BackButton from "../Back";

export default function MyRegistrations() {
  const [regs, setRegs] = useState([]);
  useEffect(() => {
    api
      .get("/registration/my-registrations")
      .then((r) => setRegs(r.data))
      .catch(console.error);
  }, []);
  return (
    <div>
      <BackButton to="/competitions" />
      <h2 className="text-xl font-semibold mb-4">My Registrations</h2>
      <div className="space-y-4">
        {regs.map((r) => (
          <div key={r._id} className="card">
            <div className="flex justify-between">
              <strong>{r.competition?.title}</strong>
              <span className="text-sm">{r.status}</span>
            </div>
            <div className="text-sm text-slate-600">
              Events: {r.events.join(", ")}
            </div>
            {r.aadharFile && (
              <a
                className="text-indigo-600 mt-2"
                href={`${
                  import.meta.env.VITE_API_URL || "http://localhost:5000"
                }${r.aadharFile}`}
                target="_blank"
              >
                View Aadhaar
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
