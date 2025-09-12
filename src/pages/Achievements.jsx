import { useEffect, useState } from "react";
import axios from "axios";
import BackButton from "../Back";
import api from "../api/client";

export default function Achievements() {
  const [achievements, setAchievements] = useState([]);
  // const API_URL = api + "/achievements";

  useEffect(() => {
    api.get("/achievements").then((res) => setAchievements(res.data));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 ">
      <BackButton to="/" />
      <h1 className="text-4xl font-bold text-indigo-600 text-center mb-10">
        Our Achievements
      </h1>

      <div className="max-w-6xl mx-auto grid gap-8">
        {achievements.map((item) => (
          <div key={item._id} className="bg-white shadow-md rounded-xl p-6">
            <h2 className="text-2xl font-semibold text-gray-800">
              {item.title}
            </h2>
            <p className="text-gray-600 mb-4">{item.description}</p>

            {item.photos.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                {item.photos.map((photo, idx) => (
                  <img
                    key={idx}
                    src={`${import.meta.env.VITE_API_URL}/${photo}`}
                    alt="achievement"
                    className="rounded-lg shadow"
                  />
                ))}
              </div>
            )}

            {item.videos.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {item.videos.map((video, idx) => (
                  <video
                    key={idx}
                    src={`${import.meta.env.VITE_API_URL}/${video}`}
                    controls
                    className="w-full h-60 rounded-lg shadow"
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
