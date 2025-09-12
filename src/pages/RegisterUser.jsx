// src/pages/RegisterUser.jsx
import React, { useState } from "react";
import api from "../api/client";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import BackButton from "../Back";

export default function RegisterUser() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/register-user", form);
      setMsg("Registered. Await admin approval.");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setMsg(err?.response?.data?.msg || "Error");
    }
  };

  return (
    <>
      <BackButton to="/" />
      <div className="relative min-h-[calc(100vh-64px)] flex items-center justify-center">
        {/* Gradient Background with curved edges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
          className="absolute inset-0 bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-700 rounded-tl-[80px] rounded-br-[80px]"
        />

        {/* Content wrapper */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 max-w-5xl w-full grid md:grid-cols-2 bg-white/5 backdrop-blur-lg rounded-2xl shadow-lg overflow-hidden m-6"
        >
          {/* Left Panel */}
          <motion.div
            initial={{ x: -80, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.9 }}
            className="hidden md:flex flex-col justify-center items-center text-white p-10 bg-gradient-to-br from-purple-800 to-indigo-900 rounded-l-2xl"
          >
            <motion.img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8sixfPm6AX7hpzfYBMTgDbie_EWrPPqpRGA&s"
              alt="Logo"
              className="w-40 h-40 mb-6 rounded-full object-cover"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
            />
            <h2 className="text-3xl font-bold mb-4">Yogalaya</h2>
            <p className="text-lg text-center mb-6 italic">
              The Place of Heaven — where balance meets inner peace 🌿
            </p>
            <div className="flex gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 border border-white/30 rounded-lg text-sm hover:bg-white/10"
              >
                Explore Our Programs
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 border border-white/30 rounded-lg text-sm hover:bg-white/10"
              >
                Wellness Benefits
              </motion.button>
            </div>
          </motion.div>

          {/* Right Panel */}
          <motion.div
            initial={{ x: 80, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.9 }}
            className="p-10 flex flex-col justify-center bg-white/10 backdrop-blur-md"
          >
            <h2 className="text-2xl font-bold text-white mb-6">
              Create your Account
            </h2>
            {msg && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-3 bg-green-100 text-green-800 p-2 rounded"
              >
                {msg}
              </motion.div>
            )}
            <form onSubmit={submit} className="space-y-4">
              <motion.input
                whileFocus={{ scale: 1.02 }}
                required
                placeholder="Name"
                className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-purple-400"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <motion.input
                whileFocus={{ scale: 1.02 }}
                required
                type="email"
                placeholder="Email"
                className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-purple-400"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              <motion.input
                whileFocus={{ scale: 1.02 }}
                required
                type="password"
                placeholder="Password"
                className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-purple-400"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className="w-full py-2 rounded-lg bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-semibold transition"
              >
                Register
              </motion.button>
            </form>

            <p className="mt-6 text-center text-sm text-white/70">
              Already have an account?{" "}
              <span
                onClick={() => navigate("/login")}
                className="cursor-pointer text-purple-300 hover:text-purple-200"
              >
                Log in
              </span>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
}
