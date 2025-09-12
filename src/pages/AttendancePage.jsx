import React, { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import axios from "../api/client";
import BackButton from "../Back";

export default function AttendancePage() {
  const videoRef = useRef();
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [date, setDate] = useState("");
  const [faceMatcher, setFaceMatcher] = useState(null);
  const [mode, setMode] = useState("menu");

  const [form, setForm] = useState({
    name: "",
    idNumber: "",
    gender: "",
  });

  const [descriptor, setDescriptor] = useState(null);

  // Start / Stop Camera
  const startVideo = () => {
    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
      videoRef.current.srcObject = stream;
    });
  };

  const stopVideo = () => {
    const stream = videoRef.current?.srcObject;
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  // Load models + student data
  const loadAll = async () => {
    setLoading(true);
    await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
    await faceapi.nets.faceRecognitionNet.loadFromUri("/models");
    await faceapi.nets.faceLandmark68Net.loadFromUri("/models");

    const res = await axios.get("/attendance/students");
    setStudents(res.data);

    const labeledDescriptors = res.data.map((s) => {
      const descriptors = s.faceDescriptors.map((d) => new Float32Array(d));
      return new faceapi.LabeledFaceDescriptors(s.idNumber, descriptors);
    });

    // ⚡ Stricter threshold (0.5 instead of 0.6)
    setFaceMatcher(new faceapi.FaceMatcher(labeledDescriptors, 0.5));
    setLoading(false);
  };

  useEffect(() => {
    (async () => {
      await loadAll();
    })();
  }, []);

  // Capture student face
  const captureDescriptor = async () => {
    const detections = await faceapi
      .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (!detections) {
      alert("No face detected! Try again.");
      return;
    }

    setDescriptor(Array.from(detections.descriptor));
    alert("Face captured successfully!");
  };

  // Save new student
  const saveStudent = async () => {
    if (!form.name || !form.idNumber || !form.gender || !descriptor) {
      alert("Please fill all details & capture face");
      return;
    }

    await axios.post("/attendance/add-student", {
      ...form,
      faceDescriptor: descriptor,
    });

    alert("Student saved successfully!");

    // ✅ Reload students & matcher so new student works immediately
    await loadAll();
  };

  // ✅ Mark Attendance
  const markAttendance = async () => {
    const detections = await faceapi
      .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (!detections) {
      alert("⚠️ No face detected!");
      return;
    }

    const bestMatch = faceMatcher.findBestMatch(detections.descriptor);

    if (bestMatch.label === "unknown") {
      alert("❌ User not found!");
      return;
    }

    const matchedStudent = students.find((s) => s.idNumber === bestMatch.label);
    if (!matchedStudent) {
      alert("❌ Student not found in local list!");
      return;
    }

    try {
      const res = await axios.post("/attendance/mark-attendance", {
        idNumber: matchedStudent.idNumber,
      });

      if (res.data.error) {
        // ✅ Backend returned error
        alert(`❌ ${res.data.error}`);
        return;
      }

      alert(`✅ Attendance marked for ${matchedStudent.name}`);
    } catch (err) {
      console.error("Error marking attendance:", err);
      alert("❌ Failed to mark attendance. Please try again.");
    }
  };

  // Fetch attendance by date
  const fetchAttendance = async () => {
    if (!date) return;
    const res = await axios.get(`/attendance/${date}`);
    setAttendance(res.data);
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Facial Attendance</h1>

      {/* Menu */}
      {mode === "menu" && (
        <div className="space-y-4">
          <BackButton to="/adminpage" />
          <button
            onClick={() => setMode("add")}
            className="block w-full bg-green-500 text-white p-3 rounded"
          >
            ➕ Add New Face
          </button>
          <button
            onClick={() => setMode("take")}
            className="block w-full bg-blue-500 text-white p-3 rounded"
          >
            ✅ Take Attendance
          </button>
          <button
            onClick={() => setMode("list")}
            className="block w-full bg-gray-700 text-white p-3 rounded"
          >
            📅 View Attendance
          </button>
        </div>
      )}

      {/* Add New Student */}
      {mode === "add" && (
        <div>
          <h2 className="text-lg font-semibold mb-2">Add New Student</h2>
          <video
            ref={videoRef}
            autoPlay
            muted
            width="400"
            className="border rounded"
          />
          <div className="flex gap-2 mt-2">
            <button
              onClick={startVideo}
              className="bg-blue-500 text-white px-3 py-2 rounded"
            >
              Start Camera
            </button>
            <button
              onClick={stopVideo}
              className="bg-red-500 text-white px-3 py-2 rounded"
            >
              Stop Camera
            </button>
          </div>
          <input
            type="text"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="border p-2 w-full mt-2"
          />
          <input
            type="text"
            placeholder="ID Number"
            value={form.idNumber}
            onChange={(e) => setForm({ ...form, idNumber: e.target.value })}
            className="border p-2 w-full mt-2"
          />
          <select
            value={form.gender}
            onChange={(e) => setForm({ ...form, gender: e.target.value })}
            className="border p-2 w-full mt-2"
          >
            <option value="">Select Gender</option>
            <option>Male</option>
            <option>Female</option>
          </select>
          <div className="flex gap-2 mt-4">
            <button
              onClick={captureDescriptor}
              className="bg-purple-500 text-white px-3 py-2 rounded"
            >
              Capture Face
            </button>
            <button
              onClick={saveStudent}
              className="bg-green-600 text-white px-3 py-2 rounded"
            >
              Save Student
            </button>
          </div>
          <button
            onClick={() => {
              stopVideo();
              setMode("menu");
            }}
            className="mt-4 bg-gray-500 text-white px-4 py-2 rounded"
          >
            Back
          </button>
        </div>
      )}

      {/* Take Attendance */}
      {mode === "take" && (
        <div>
          {loading ? (
            <p>Loading models...</p>
          ) : (
            <>
              <video
                ref={videoRef}
                autoPlay
                muted
                width="500"
                className="border rounded"
              />
              <div className="flex gap-2 mt-4">
                <button
                  onClick={startVideo}
                  className="bg-blue-500 text-white px-3 py-2 rounded"
                >
                  Start Camera
                </button>
                <button
                  onClick={stopVideo}
                  className="bg-red-500 text-white px-3 py-2 rounded"
                >
                  Stop Camera
                </button>
                <button
                  onClick={markAttendance}
                  className="bg-purple-500 text-white px-3 py-2 rounded"
                >
                  Mark Attendance
                </button>
              </div>
            </>
          )}
          <button
            onClick={() => {
              stopVideo();
              setMode("menu");
            }}
            className="mt-4 bg-gray-500 text-white px-4 py-2 rounded"
          >
            Back
          </button>
        </div>
      )}

      {/* Attendance List */}
      {mode === "list" && (
        <div>
          <h2 className="text-lg font-semibold mb-2">Attendance Records</h2>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border p-2 rounded"
          />
          <button
            onClick={fetchAttendance}
            className="ml-2 bg-gray-600 text-white px-3 py-2 rounded"
          >
            Fetch
          </button>
          <table className="w-full mt-4 border">
            <thead>
              <tr className="bg-gray-200">
                <th className="border">Name</th>
                <th className="border">ID</th>
                <th className="border">Gender</th>
                <th className="border">Status</th>
              </tr>
            </thead>
            <tbody>
              {attendance.map((s) => (
                <tr key={s._id}>
                  <td className="border px-2">
                    {s.student?.name || "Unknown"}
                  </td>
                  <td className="border px-2">{s.student?.idNumber || "-"}</td>
                  <td className="border px-2">{s.student?.gender || "-"}</td>
                  <td className="border px-2">{s.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            onClick={() => setMode("menu")}
            className="mt-4 bg-gray-500 text-white px-4 py-2 rounded"
          >
            Back
          </button>
        </div>
      )}
    </div>
  );
}
