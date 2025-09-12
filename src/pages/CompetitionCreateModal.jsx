import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearAuth } from "../store/authSlice";
import api from "../api/client";
import CompetitionCreateModal from "./CompetitionCreateModal";

export default function AdminDashboard() {
  const [tab, setTab] = useState("competitions");
  const [competitions, setCompetitions] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [users, setUsers] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ---------------- FETCH FUNCTIONS ----------------
  const fetchCompetitions = async () => {
    try {
      const res = await api.get("/competitions");
      setCompetitions(res.data);
    } catch (err) {
      console.error("Error fetching competitions:", err);
    }
  };

  const fetchRegistrations = async () => {
    try {
      const res = await api.get("/competitionRegister/pending");
      setRegistrations(res.data);
    } catch (err) {
      console.error("Error fetching registrations:", err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await api.get("/auth/users");
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  useEffect(() => {
    fetchCompetitions();
    fetchRegistrations();
    fetchUsers();
  }, []);

  // ---------------- HANDLERS ----------------
  const handleRegistrationAction = async (id, action) => {
    try {
      await api.put(`/competitionRegister/${action}/${id}`);
      fetchRegistrations();
    } catch (err) {
      console.error("Error updating registration:", err);
    }
  };

  const handleUserApprove = async (id) => {
    try {
      await api.put(`/auth/approve/${id}`);
      fetchUsers();
    } catch (err) {
      console.error("Error approving user:", err);
    }
  };

  const handleLogout = () => {
    dispatch(clearAuth());
    localStorage.removeItem("token");
    navigate("/login");
  };

  // ---------------- UI ----------------
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 mb-6">
        {["competitions", "registrations", "users"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg ${
              tab === t
                ? "bg-blue-600 text-white"
                : "bg-white shadow hover:bg-gray-100"
            }`}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* Competitions Tab */}
      {tab === "competitions" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Competitions</h2>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              + Add Competition
            </button>
          </div>
          <ul className="grid gap-3">
            {competitions.map((c) => (
              <li
                key={c._id}
                className="bg-white p-4 shadow rounded-lg flex justify-between"
              >
                <div>
                  <p className="font-bold">{c.title}</p>
                  <p className="text-sm text-gray-500">{c.date}</p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    c.status === "upcoming"
                      ? "bg-yellow-100 text-yellow-600"
                      : c.status === "ongoing"
                      ? "bg-green-100 text-green-600"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {c.status}
                </span>
              </li>
            ))}
          </ul>
        </motion.div>
      )}

      {/* Registrations Tab */}
      {tab === "registrations" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h2 className="text-lg font-semibold mb-4">Pending Registrations</h2>
          {registrations.length === 0 ? (
            <p>No pending requests</p>
          ) : (
            <ul className="space-y-4">
              {registrations.map((r) => (
                <li
                  key={r._id}
                  className="bg-white p-4 shadow rounded-lg flex justify-between items-center"
                >
                  <div>
                    <p className="font-bold">{r.fullName}</p>
                    <p className="text-sm text-gray-500">
                      {r.user?.name} ({r.user?.email})
                    </p>
                    <p className="text-sm">
                      Competition: {r.competition?.title} | Age: {r.age}
                    </p>
                    <p className="text-sm">Events: {r.events.join(", ")}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleRegistrationAction(r._id, "approve")}
                      className="bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleRegistrationAction(r._id, "reject")}
                      className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700"
                    >
                      Reject
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </motion.div>
      )}

      {/* Users Tab */}
      {tab === "users" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h2 className="text-lg font-semibold mb-4">User Approvals</h2>
          <ul className="space-y-3">
            {users.map((u) => (
              <li
                key={u._id}
                className="bg-white p-4 shadow rounded-lg flex justify-between items-center"
              >
                <div>
                  <p className="font-bold">{u.name}</p>
                  <p className="text-sm text-gray-500">{u.email}</p>
                  <p
                    className={`text-xs ${
                      u.isApproved ? "text-green-600" : "text-yellow-600"
                    }`}
                  >
                    {u.isApproved ? "Approved" : "Pending"}
                  </p>
                </div>
                {!u.isApproved && (
                  <button
                    onClick={() => handleUserApprove(u._id)}
                    className="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700"
                  >
                    Approve
                  </button>
                )}
              </li>
            ))}
          </ul>
        </motion.div>
      )}

      {/* Competition Create Modal */}
      {showCreateModal && (
        <CompetitionCreateModal onClose={() => setShowCreateModal(false)} />
      )}
    </div>
  );
}
