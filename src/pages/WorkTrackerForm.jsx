import React, { useState, useCallback, useEffect } from "react";
import api from "../api/client";
import { Particles } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { useSelector } from "react-redux";
import BackButton from "../Back";

export default function WorkTrackerForm() {
  const { user } = useSelector((store) => store.auth); // only name is available

  const [formData, setFormData] = useState({
    name: "",
    studentId: "",
    date: new Date().toISOString().split("T")[0],
    type: "Planning",
    hour: "",
    description: "",
  });

  const [message, setMessage] = useState("");

  const hours = [
    "04:00 - 05:00 AM",
    "05:00 - 06:00 AM",
    "06:00 - 07:00 AM",
    "07:00 - 08:00 AM",
    "08:00 - 09:00 AM",
    "09:00 - 10:00 AM",
    "10:00 - 11:00 AM",
    "11:00 - 12:00 PM",
    "12:00 - 01:00 PM",
    "01:00 - 02:00 PM",
    "02:00 - 03:00 PM",
    "03:00 - 04:00 PM",
    "04:00 - 05:00 PM",
    "05:00 - 06:00 PM",
    "06:00 - 07:00 PM",
    "07:00 - 08:00 PM",
    "08:00 - 09:00 PM",
    "09:00 - 10:00 PM",
  ];

  // ✅ Automatically fill name from Redux or localStorage
  useEffect(() => {
    const storedName = localStorage.getItem("name");

    if (user && user.name) {
      setFormData((prev) => ({
        ...prev,
        name: user.name,
      }));
    } else if (storedName) {
      setFormData((prev) => ({
        ...prev,
        name: storedName,
      }));
    }
  }, [user]);

  // ✅ Initialize particles
  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/work/hourly", formData);
      setMessage("✅ Entry saved successfully!");
      setFormData((prev) => ({
        ...prev,
        hour: "",
        description: "",
      }));
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error("❌ Error saving data:", err);
      setMessage("❌ Error saving data");
    }
  };

  return (
    <>
      <BackButton to="/competitions" />
      <div className="relative min-h-screen flex justify-center items-center bg-gradient-to-br from-green-100 to-green-300 overflow-hidden">
        {/* 🌟 Particle Background */}
        <Particles
          id="tsparticles"
          init={particlesInit}
          options={{
            background: { color: "transparent" },
            fpsLimit: 60,
            interactivity: {
              events: { onHover: { enable: true, mode: "repulse" } },
              modes: { repulse: { distance: 80, duration: 0.4 } },
            },
            particles: {
              color: { value: "#22c55e" },
              links: { color: "#22c55e", distance: 150, enable: true },
              move: { enable: true, speed: 1 },
              number: { density: { enable: true }, value: 60 },
              opacity: { value: 0.4 },
              shape: { type: "circle" },
              size: { value: 3 },
            },
          }}
          className="absolute inset-0 -z-10"
        />

        {/* 🌿 Form Card */}
        <div className="relative z-10 bg-white/50 backdrop-blur-md shadow-2xl rounded-2xl p-8 max-w-lg w-full mx-4 border border-white/30">
          <h1 className="text-3xl font-extrabold mb-6 text-center text-green-900">
            Student Hourly Work Tracker
          </h1>

          {message && (
            <p className="text-center mb-4 font-semibold text-green-800 animate-pulse">
              {message}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* 🧍 Name */}
            <div>
              <label className="block text-green-900 font-semibold mb-1">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                readOnly
                className="w-full border border-green-300 rounded-lg p-2 bg-gray-100 cursor-not-allowed focus:ring focus:ring-green-400"
              />
            </div>

            {/* 🆔 Student ID */}
            <div>
              <label className="block text-green-900 font-semibold mb-1">
                Student ID
              </label>
              <input
                type="text"
                name="studentId"
                value={formData.studentId}
                onChange={handleChange}
                required
                placeholder="Enter your student ID"
                className="w-full border border-green-300 rounded-lg p-2 bg-white/70 focus:ring focus:ring-green-400"
              />
            </div>

            {/* 📅 Date */}
            <div>
              <label className="block text-green-900 font-semibold mb-1">
                Date
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="w-full border border-green-300 rounded-lg p-2 bg-white/70 focus:ring focus:ring-green-400"
              />
            </div>

            {/* 📘 Type */}
            <div>
              <label className="block text-green-900 font-semibold mb-1">
                Type
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full border border-green-300 rounded-lg p-2 bg-white/70 focus:ring focus:ring-green-400"
              >
                <option value="Planning">Planning</option>
                <option value="Actual">Actual</option>
              </select>
            </div>

            {/* ⏰ Hour */}
            <div>
              <label className="block text-green-900 font-semibold mb-1">
                Hour
              </label>
              <select
                name="hour"
                value={formData.hour}
                onChange={handleChange}
                required
                className="w-full border border-green-300 rounded-lg p-2 bg-white/70 focus:ring focus:ring-green-400"
              >
                <option value="">Select Hour</option>
                {hours.map((h, i) => (
                  <option key={i} value={h}>
                    {h}
                  </option>
                ))}
              </select>
            </div>

            {/* 📝 Description */}
            <div>
              <label className="block text-green-900 font-semibold mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                className="w-full border border-green-300 rounded-lg p-2 bg-white/70 focus:ring focus:ring-green-400"
                rows="4"
                placeholder="Describe your hourly plan or activity..."
              ></textarea>
            </div>

            {/* ✅ Submit */}
            <button
              type="submit"
              className="w-full bg-green-700 text-white font-semibold py-2 rounded-lg hover:bg-green-800 transition duration-300"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
