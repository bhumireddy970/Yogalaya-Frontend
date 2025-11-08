// src/pages/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import api from "../api/client";
import { logout } from "../store/authSlice";

export default function AdminDashboard() {
  const [tab, setTab] = useState("competitions");

  // Competitions
  const [competitions, setCompetitions] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [allRegistrations, setAllRegistrations] = useState([]);
  const [newCompetition, setNewCompetition] = useState({
    title: "",
    description: "",
    date: "",
    status: "upcoming",
    circular: null,
  });
  const [editCompetition, setEditCompetition] = useState(null);

  // Registrations
  const [registrations, setRegistrations] = useState([]);

  // Users
  const [users, setUsers] = useState([]);

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
      const res = await api.get("/registration/pending");
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

  const fetchAllRegistrations = async () => {
    try {
      const res = await api.get("/registration/all");
      setAllRegistrations(res.data);
    } catch (err) {
      console.error("Error fetching all registrations:", err);
    }
  };

  useEffect(() => {
    fetchCompetitions();
    fetchRegistrations();
    fetchUsers();
    fetchAllRegistrations();
  }, []);

  // ---------------- HANDLERS ----------------
  const handleAddCompetition = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.entries(newCompetition).forEach(([key, val]) => {
        if (val) formData.append(key, val);
      });

      await api.post("/competitions", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setNewCompetition({
        title: "",
        description: "",
        date: "",
        status: "upcoming",
        circular: null,
      });
      setShowAddModal(false);
      fetchCompetitions();
    } catch (err) {
      console.error("Error adding competition:", err);
    }
  };

  const handleEditCompetition = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.entries(editCompetition).forEach(([key, val]) => {
        if (val) formData.append(key, val);
      });

      await api.put(`/competitions/${editCompetition._id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setEditCompetition(null);
      setShowEditModal(false);
      fetchCompetitions();
    } catch (err) {
      console.error("Error updating competition:", err);
    }
  };

  const handleDeleteCompetition = async (id) => {
    if (!window.confirm("Are you sure you want to delete this competition?"))
      return;
    try {
      await api.delete(`/competitions/${id}`);
      fetchCompetitions();
    } catch (err) {
      console.error("Error deleting competition:", err);
    }
  };

  const handleRegistrationAction = async (id, action) => {
    try {
      await api.put(`/registration/${action}/${id}`);
      fetchRegistrations();
    } catch (err) {
      console.error(`Error ${action} registration:`, err);
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
    dispatch(logout());
    navigate("/login");
  };

  // ---------------- UI ----------------
  return (
    <div className="min-xl bg-gray-100">
      {/* ✅ HEADER */}
      <div className="flex flex-wrap justify-between items-center mb-6 p-4 bg-white shadow-sm rounded-b-lg">
        <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>

        <div className="flex flex-wrap gap-3">
          {/* 🔹 Work Analysis Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/admin/work-analysis")}
            className="px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold rounded-xl shadow-xl transition-all duration-300"
          >
            Work Analysis
          </motion.button>

          {/* 🔹 Add Achievements Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/admin/achievements")}
            className="px-6 py-3 bg-pink-500 hover:bg-pink-600 text-white font-bold rounded-xl shadow-xl"
          >
            Add Achievements
          </motion.button>

          {/* 🔹 Logout Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl shadow-xl"
          >
            Logout
          </motion.button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 m-3 flex-wrap">
        {[
          "competitions",
          "registrations",
          "all-registrations",
          "users",
          "Face Attendance",
        ].map((t) => (
          <button
            key={t}
            onClick={() => {
              if (t === "Face Attendance") {
                navigate("/admin/attendance");
              } else {
                setTab(t);
              }
            }}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              tab === t
                ? "bg-blue-600 text-white shadow-md"
                : "bg-white text-gray-700 border hover:bg-gray-100"
            }`}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* Competitions */}
      {tab === "competitions" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Competitions</h2>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              + Add Competition
            </button>
          </div>

          <ul className="grid gap-3">
            {competitions.map((c) => (
              <li
                key={c._id}
                className="bg-white p-4 shadow rounded-lg flex justify-between items-center"
              >
                <div>
                  <p className="font-bold">{c.title}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(c.date).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2 items-center">
                  <button
                    onClick={() => {
                      setEditCompetition(c);
                      setShowEditModal(true);
                    }}
                    className="bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteCompetition(c._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
                  >
                    Delete
                  </button>
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
                </div>
              </li>
            ))}
          </ul>
        </motion.div>
      )}

      {/* Registrations */}
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

      {/* All Registrations */}
      {tab === "all-registrations" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h2 className="text-lg font-semibold mb-4">
            All Competition Registrations
          </h2>

          {allRegistrations.length === 0 ? (
            <p>No registrations found</p>
          ) : (
            <table className="min-w-full bg-white rounded-lg shadow">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="p-2">Name</th>
                  <th className="p-2">Email</th>
                  <th className="p-2">Competition</th>
                  <th className="p-2">Age</th>
                  <th className="p-2">Events</th>
                  <th className="p-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {allRegistrations.map((r) => (
                  <tr key={r._id} className="border-t">
                    <td className="p-2">{r.fullName}</td>
                    <td className="p-2">{r.user?.email}</td>
                    <td className="p-2">{r.competition?.title}</td>
                    <td className="p-2">{r.age}</td>
                    <td className="p-2">{r.events.join(", ")}</td>
                    <td
                      className={`p-2 font-semibold ${
                        r.status === "approved"
                          ? "text-green-600"
                          : r.status === "rejected"
                          ? "text-red-600"
                          : "text-yellow-600"
                      }`}
                    >
                      {r.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </motion.div>
      )}

      {/* Users */}
      {tab === "users" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h2 className="text-lg font-semibold mb-4">User Approvals</h2>
          {users.length === 0 ? (
            <p>No users found</p>
          ) : (
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
          )}
        </motion.div>
      )}

      {/* Modals */}
      {showAddModal && (
        <CompetitionModal
          title="Add Competition"
          competition={newCompetition}
          setCompetition={setNewCompetition}
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddCompetition}
        />
      )}

      {showEditModal && editCompetition && (
        <CompetitionModal
          title="Edit Competition"
          competition={editCompetition}
          setCompetition={setEditCompetition}
          onClose={() => setShowEditModal(false)}
          onSubmit={handleEditCompetition}
        />
      )}
    </div>
  );
}

// ---------------- Competition Modal Component ----------------
function CompetitionModal({
  title,
  competition,
  setCompetition,
  onClose,
  onSubmit,
}) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md"
      >
        <h3 className="text-lg font-semibold mb-4">{title}</h3>
        <form onSubmit={onSubmit} className="grid gap-3">
          <input
            type="text"
            placeholder="Title"
            value={competition.title}
            onChange={(e) =>
              setCompetition({ ...competition, title: e.target.value })
            }
            className="border rounded-lg p-2"
            required
          />
          <textarea
            placeholder="Description"
            value={competition.description}
            onChange={(e) =>
              setCompetition({ ...competition, description: e.target.value })
            }
            className="border rounded-lg p-2"
            required
          />
          <input
            type="date"
            value={competition.date?.slice(0, 10)}
            onChange={(e) =>
              setCompetition({ ...competition, date: e.target.value })
            }
            className="border rounded-lg p-2"
            required
          />
          <select
            value={competition.status}
            onChange={(e) =>
              setCompetition({ ...competition, status: e.target.value })
            }
            className="border rounded-lg p-2"
          >
            <option value="upcoming">Upcoming</option>
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
          </select>
          <input
            type="file"
            onChange={(e) =>
              setCompetition({ ...competition, circular: e.target.files[0] })
            }
            className="border rounded-lg p-2"
          />
          <div className="flex justify-end gap-2 mt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1 bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
