import React, { useState, useEffect } from "react";
import api from "../api/client";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import BackButton from "../Back"; // Assuming this is styled appropriately

const ALL_EVENTS = [
  "Traditional",
  "Forward Bend",
  "Back Bend",
  "Twisting Body",
  "Leg Balance",
  "Hand Balance",
  "Supine",
  "Artistic Solo",
  "Artistic Pair",
  "Rhythmic Pair",
];

export default function RegistrationForm() {
  const { id } = useParams(); // competition id
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.auth);

  const [form, setForm] = useState({
    fullName: "",
    dateOfBirth: "",
    age: "",
    gender: "",
    events: [],
  });

  const [aadhar, setAadhar] = useState(null);
  const [msg, setMsg] = useState("");

  // ✅ Function to calculate age
  const calculateAge = (dob) => {
    if (!dob) return "";
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  // ✅ Pre-fill data from user
  useEffect(() => {
    if (user) {
      setForm((f) => ({
        ...f,
        fullName: user.name || f.fullName,
        dateOfBirth: user.dateOfBirth || f.dateOfBirth,
        age: user.dateOfBirth ? calculateAge(user.dateOfBirth) : f.age,
        gender: user.gender || f.gender,
      }));
    } else {
      const name = localStorage.getItem("name");
      if (name) setForm((f) => ({ ...f, fullName: name }));
    }
  }, [user]);

  const toggleEvent = (ev) => {
    setForm((f) => {
      const set = new Set(f.events);
      if (set.has(ev)) set.delete(ev);
      else set.add(ev);
      return { ...f, events: [...set] };
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "dateofbirth") {
      setForm({
        ...form,
        dateOfBirth: value,
        age: calculateAge(value),
      });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();

      data.append("competitionId", id);
      data.append("fullName", form.fullName);
      data.append("dateOfBirth", form.dateOfBirth);
      data.append("age", form.age);
      data.append("gender", form.gender);
      data.append("events", JSON.stringify(form.events));
      if (aadhar) data.append("aadharFile", aadhar);

      await api.post("/registration/register", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMsg("Registration submitted. Await admin approval.");
      navigate("/my-registrations");
    } catch (err) {
      setMsg(err?.response?.data?.msg || "Error submitting registration");
    }
  };

  const InputField = ({
    label,
    type = "text",
    value,
    onChange,
    required = false,
    placeholder = "",
    readOnly = false,
  }) => (
    <div className="relative z-0 w-full mb-6 group">
      <input
        type={type}
        name={label.toLowerCase().replace(/\s/g, "")}
        id={label.toLowerCase().replace(/\s/g, "")}
        className={`block py-2.5 px-3 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 peer transition-all duration-300 rounded-lg ${
          readOnly ? "bg-gray-100 cursor-not-allowed" : ""
        }`}
        placeholder=" "
        value={value}
        onChange={onChange}
        required={required}
        readOnly={readOnly}
      />
      <label
        htmlFor={label.toLowerCase().replace(/\s/g, "")}
        className="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 left-3 -z-10 origin-[0] peer-focus:left-3 peer-focus:text-green-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
      >
        {label}
      </label>
    </div>
  );

  return (
    <>
      <BackButton to="/competitions" className="absolute top-4 left-4 z-20" />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 p-6">
        <div className="max-w-5xl w-full grid md:grid-cols-2 bg-white shadow-2xl rounded-3xl overflow-hidden animate-fade-in">
          {/* Left Side - Form */}
          <div className="p-10 flex flex-col justify-center text-center relative">
            <img
              src="https://thumbs.dreamstime.com/b/tree-yoga-logo-illustration-art-isolated-background-102408046.jpg"
              alt="Yoga Logo"
              className="w-20 h-20 mx-auto mb-4 animate-bounce-in"
            />
            <h2 className="text-3xl font-extrabold text-green-800 mb-3 animate-slide-down">
              Welcome to our Yoga Competitions Registration!
            </h2>
            <p className="text-gray-600 mb-8 text-lg animate-slide-up">
              We’re delighted that you’ve chosen to join our yoga community.
              Please fill out the form below to secure your spot.
              <br />
              <span className="font-semibold text-green-700">Namaste! 🙏</span>
            </p>

            {msg && (
              <div className="bg-green-50 text-green-700 py-3 px-4 rounded-xl mb-6 shadow-sm animate-fade-in">
                {msg}
              </div>
            )}

            {/* Form */}
            <form onSubmit={submit} className="space-y-6">
              <InputField
                label="Full Name"
                value={form.fullName}
                onChange={handleChange}
                required
                readOnly
              />

              <div className="grid grid-cols-2 gap-4">
                <InputField
                  label="Date of Birth"
                  type="date"
                  value={form.dateOfBirth}
                  onChange={handleChange}
                  required
                />
                <InputField
                  label="Age"
                  type="number"
                  value={form.age}
                  readOnly
                  required
                />
              </div>

              {/* Gender */}
              <div>
                <label className="block text-sm font-medium text-gray-700 text-left">
                  Gender
                </label>
                <select
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-green-600 focus:ring-green-600"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Events */}
              <div>
                <label className="block mb-4 text-xl font-semibold text-gray-700">
                  Select Events
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {ALL_EVENTS.map((ev) => (
                    <label
                      key={ev}
                      className={`relative flex items-center justify-center p-2 rounded-full cursor-pointer select-none transition-all duration-300
                        ${
                          form.events.includes(ev)
                            ? "bg-gradient-to-br from-green-400 to-green-600 text-white shadow-md transform scale-105"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                    >
                      <input
                        type="checkbox"
                        className="absolute w-full h-full opacity-0 cursor-pointer"
                        checked={form.events.includes(ev)}
                        onChange={() => toggleEvent(ev)}
                      />
                      <span className="text-sm font-medium">{ev}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* File Upload */}
              <div className="mt-8">
                <label
                  htmlFor="aadhar-upload"
                  className="block mb-2 text-xl font-semibold text-gray-700"
                >
                  Upload Aadhaar (PDF)
                </label>
                <label
                  htmlFor="aadhar-upload"
                  className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-full cursor-pointer bg-white text-green-600 hover:bg-green-50 hover:border-green-400 transition-all duration-300 shadow-sm"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {aadhar ? aadhar.name : "Select PDF File"}
                  <input
                    id="aadhar-upload"
                    type="file"
                    accept=".pdf"
                    onChange={(e) => setAadhar(e.target.files[0])}
                    className="hidden"
                    required
                  />
                </label>
                {aadhar && (
                  <p className="text-xs text-gray-500 mt-2">
                    File selected: {aadhar.name}
                  </p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white font-bold py-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                Submit Registration
              </button>
            </form>
          </div>

          {/* Right Side - Yoga Image */}
          <div className="relative hidden md:block">
            <img
              src="https://thumbs.dreamstime.com/b/person-practicing-yoga-tree-pose-vrikshasana-calm-water-surface-creating-person-practicing-yoga-tree-pose-vrikshasana-382540169.jpg"
              alt="Yoga Pose"
              className="w-full h-full object-cover rounded-r-3xl"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-green-900/40 via-green-800/20 to-transparent mix-blend-multiply" />
          </div>
        </div>
      </div>
    </>
  );
}
