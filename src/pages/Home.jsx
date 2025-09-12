import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  // Surya Namaskar pose images (your links here)
  const poses = [
    "https://vikasa.com/wp-content/uploads/2024/08/RAW09580-1024x631.jpg",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRErPJkva-QN7ZHC-Jma9SHAvrvLD6Fm2P-LQDh71hZmq-cIWr8w3TWtS4kcwoA2l9VN8c&usqp=CAU",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcROLT9Yejosh-PYNjMEXDsHwywX6t0qS-3kng&s",
    "https://shwetyoga.in/wp-content/uploads/2024/04/Shwet-Yoga-Classes-Courses-in-Thane-4-1.jpg",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR1zER677LuHg3ynaLn21tIy2xLbqyC_CLgsg&s",
  ];

  return (
    <div className="relative h-screen w-screen flex flex-col items-center justify-center bg-gradient-to-b from-indigo-900 via-purple-900 to-black text-white overflow-hidden">
      {/* Achievements Button (top right) */}
      <div className="absolute top-4 right-4 z-50">
        <button
          onClick={() => navigate("/achievements")}
          className="px-6 py-3 bg-pink-500 hover:bg-pink-600 text-white font-bold rounded-xl shadow-xl"
        >
          Achievements
        </button>
      </div>
      <div className="relative h-screen w-screen flex flex-col items-center justify-center bg-gradient-to-b from-indigo-900 via-purple-900 to-black text-white overflow-hidden">
        {/* Background Surya Namaskar Rotating Circle */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-[500px] h-[500px] animate-spin-slow">
            {poses.map((pose, index) => {
              const angle = (index / poses.length) * 2 * Math.PI;
              const x = 200 * Math.cos(angle);
              const y = 200 * Math.sin(angle);

              return (
                <img
                  key={index}
                  src={pose}
                  alt={`pose-${index + 1}`}
                  className="absolute w-28 h-28 object-cover rounded-full shadow-xl border-2 border-white/20"
                  style={{
                    top: `calc(50% + ${y}px - 56px)`,
                    left: `calc(50% + ${x}px - 56px)`,
                  }}
                />
              );
            })}
          </div>

          {/* Center Image */}
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQO9G1OvzXMU-3pR_XFGM0vJ--g1RdYJzBsYQ&s"
            alt="center-pose"
            className="absolute w-40 h-40 object-cover rounded-full shadow-2xl border-4 border-white/30"
          />
        </div>

        {/* Hero Section */}
        <div className="relative text-center z-10 px-6">
          <h2 className="text-4xl md:text-6xl font-bold drop-shadow-lg">
            Be peaceful in mind and healthy in body!
          </h2>
          <p className="mt-4 text-gray-200 text-lg">
            Reconnect with your breath, body, and soul through Yoga.
          </p>

          <button
            onClick={() => setShowModal(true)}
            className="mt-8 px-6 py-3 bg-pink-500 hover:bg-pink-600 text-white font-bold rounded-xl shadow-xl"
          >
            GET STARTED
          </button>
        </div>

        {/* Modal */}
        <AnimatePresence>
          {showModal && (
            <motion.div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="relative bg-white/90 backdrop-blur-xl text-black p-8 rounded-2xl shadow-2xl w-96 text-center border border-white/20"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {/* Close Button */}
                <button
                  onClick={() => setShowModal(false)}
                  className="absolute top-3 right-3 text-gray-500 hover:text-black text-lg"
                >
                  ✕
                </button>

                <h3 className="text-2xl font-bold mb-6 text-gray-800">
                  Welcome
                </h3>
                <div className="flex flex-col gap-4">
                  <button
                    onClick={() => (window.location.href = "/login")}
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold rounded-lg shadow-md transition-transform transform hover:scale-105"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => (window.location.href = "/register")}
                    className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold rounded-lg shadow-md transition-transform transform hover:scale-105"
                  >
                    Register
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
