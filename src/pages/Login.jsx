// src/pages/Login.jsx
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { loginUser } from "../store/authSlice"; // ✅ our thunk
import BackButton from "../Back";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await dispatch(loginUser(form)).unwrap();

      // ✅ Redirect based on role
      if (result?.user?.role === "admin") {
        navigate("/adminpage");
      } else {
        navigate("/competitions");
      }
    } catch (err) {
      setError(err?.msg || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - illustration */}
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="hidden md:flex w-1/2 bg-yellow-400 items-center justify-center"
      >
        <div className="text-center">
          <h1 className="text-5xl font-bold text-white">
            <img
              src="https://res.cloudinary.com/dsdcaxwpg/image/upload/v1757343542/WhatsApp_Image_2025-09-07_at_10.20.17_AM_lydi2z.jpg"
              alt="Yogalaya Logo"
              className="mx-auto mb-4 w-40 h-40 rounded-full object-cover"
            />
          </h1>
          <p className="mt-4 text-lg text-white">Stay calm, stay mindful</p>
        </div>
      </motion.div>

      <motion.div
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="flex w-full md:w-1/2 items-center justify-center p-8"
      >
        <div className="w-full max-w-md">
          <BackButton to="/" />
          <motion.h2
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-3xl font-extrabold text-gray-800 mb-6 text-center"
          >
            Hey Beautiful! <br />
            <span className="text-lg font-medium">Login please</span>
          </motion.h2>

          {error && (
            <div className="mb-4 text-sm text-red-600 bg-red-100 px-3 py-2 rounded">
              {error}
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-5">
            <div>
              <label className="block text-sm mb-1">Email</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full border rounded-full px-4 py-2 focus:ring-2 focus:ring-yellow-400 outline-none"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Password</label>
              <input
                type="password"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full border rounded-full px-4 py-2 focus:ring-2 focus:ring-yellow-400 outline-none"
                placeholder="Enter your password"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="w-full bg-black text-white py-2 rounded-full font-semibold shadow-md hover:bg-gray-900 transition"
            >
              Login
            </motion.button>
          </form>
          <p className="mt-6 text-center text-sm ">
            New User?{" "}
            <span
              onClick={() => navigate("/register")}
              className="cursor-pointer hover:text-purple-200"
            >
              Register
            </span>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
