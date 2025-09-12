import { useEffect, useState } from "react";
import axios from "axios";
import BackButton from "../Back";

export default function AdminAchievements() {
  const [achievements, setAchievements] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    photos: [],
    videos: [],
  });
  const [editingId, setEditingId] = useState(null);

  const API_URL = "http://localhost:5000/api/achievements";

  // Fetch achievements
  const fetchAchievements = async () => {
    const res = await axios.get(API_URL);
    setAchievements(res.data);
  };

  useEffect(() => {
    fetchAchievements();
  }, []);

  // Handle text input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle file input
  const handleFileChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: Array.from(e.target.files), // convert FileList → Array
    });
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append("title", form.title);
    fd.append("description", form.description);

    form.photos.forEach((p) => fd.append("photos", p));
    form.videos.forEach((v) => fd.append("videos", v));

    if (editingId) {
      await axios.put(`${API_URL}/${editingId}`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    } else {
      await axios.post(API_URL, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    }

    setForm({ title: "", description: "", photos: [], videos: [] });
    setEditingId(null);
    fetchAchievements();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      <BackButton to="/adminpage" />
      <h1 className="text-3xl font-extrabold text-indigo-700 mb-8 text-center drop-shadow">
        Admin - Manage Achievements
      </h1>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="max-w-3xl mx-auto bg-white shadow-xl rounded-2xl p-8 mb-12 border border-gray-200"
      >
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Title"
          className="w-full border border-gray-300 rounded-lg p-3 mb-4 focus:ring-2 focus:ring-indigo-500"
          required
        />

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          className="w-full border border-gray-300 rounded-lg p-3 mb-4 focus:ring-2 focus:ring-indigo-500"
          required
        />

        <label className="font-medium text-gray-700">Images</label>
        <input
          type="file"
          name="photos"
          multiple
          accept="image/*"
          onChange={handleFileChange}
          className="block w-full mt-1 mb-4 text-gray-600"
        />

        {/* Image Previews */}
        {form.photos.length > 0 && (
          <div className="flex flex-wrap gap-4 mb-6">
            {form.photos.map((p, i) => (
              <img
                key={i}
                src={URL.createObjectURL(p)}
                alt={`preview-${i}`}
                className="w-28 h-28 object-cover rounded-lg shadow-md border border-gray-200"
              />
            ))}
          </div>
        )}

        <label className="font-medium text-gray-700">Videos</label>
        <input
          type="file"
          name="videos"
          multiple
          accept="video/*"
          onChange={handleFileChange}
          className="block w-full mt-1 mb-4 text-gray-600"
        />

        {/* Video Previews */}
        {form.videos.length > 0 && (
          <div className="flex flex-wrap gap-4 mb-6">
            {form.videos.map((v, i) => (
              <video
                key={i}
                src={URL.createObjectURL(v)}
                controls
                className="w-40 h-28 rounded-lg shadow-md border border-gray-200"
              />
            ))}
          </div>
        )}

        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold shadow-lg transition-transform transform hover:scale-105"
        >
          {editingId ? "Update Achievement" : "Add Achievement"}
        </button>
      </form>

      {/* Achievements List */}
      <div className="max-w-5xl mx-auto grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {achievements.map((item) => (
          <div
            key={item._id}
            className="bg-white shadow-lg rounded-xl p-6 border border-gray-200 hover:shadow-2xl transition"
          >
            <h3 className="text-xl font-bold text-gray-800">{item.title}</h3>
            <p className="mb-4 text-gray-600">{item.description}</p>

            {/* Preview uploaded media */}
            <div className="flex flex-wrap gap-3 mb-4">
              {item.photos?.map((photo, i) => (
                <img
                  key={i}
                  src={`http://localhost:5000/${photo}`}
                  alt={`photo-${i}`}
                  className="w-20 h-20 object-cover rounded-md border border-gray-200"
                />
              ))}
              {item.videos?.map((video, i) => (
                <video
                  key={i}
                  src={`http://localhost:5000/${video}`}
                  controls
                  className="w-28 h-20 rounded-md border border-gray-200"
                />
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setForm({
                    title: item.title,
                    description: item.description,
                    photos: [],
                    videos: [],
                  });
                  setEditingId(item._id);
                }}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-1 rounded-lg shadow"
              >
                Edit
              </button>
              <button
                onClick={async () => {
                  await axios.delete(`${API_URL}/${item._id}`);
                  fetchAchievements();
                }}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded-lg shadow"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
