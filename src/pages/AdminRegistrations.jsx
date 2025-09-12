// src/pages/AdminRegistrations.jsx
import React, { useEffect, useState } from "react";
import api from "../api/client";

export default function AdminRegistrations() {
  const [regs, setRegs] = useState([]);
  useEffect(() => fetchPending(), []);
  const fetchPending = () =>
    api
      .get("/registrations/pending")
      .then((r) => setRegs(r.data))
      .catch(console.error);

  const act = async (id, action) => {
    const url = `/registrations/${action}/${id}`;
    try {
      await api.put(url);
      fetchPending();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Pending Registrations</h2>
      <div className="space-y-3">
        {regs.map((r) => (
          <div className="card flex justify-between items-start" key={r._id}>
            <div>
              <div className="font-semibold">{r.competition?.title}</div>
              <div className="text-sm text-slate-600">
                Participant: {r.user?.name} ({r.user?.email})
              </div>
              <div className="text-sm mt-1">Events: {r.events.join(", ")}</div>
              {r.aadharFile && (
                <a
                  href={`${
                    import.meta.env.VITE_API_URL || "http://localhost:5000"
                  }${r.aadharFile}`}
                  className="text-indigo-600"
                  target="_blank"
                >
                  Aadhaar
                </a>
              )}
            </div>
            <div className="space-y-2">
              <button
                onClick={() => act(r._id, "approve")}
                className="px-3 py-1 bg-green-600 text-white rounded"
              >
                Approve
              </button>
              <button
                onClick={() => act(r._1d, "reject")}
                className="px-3 py-1 bg-red-50 text-red-600 rounded"
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
