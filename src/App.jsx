// src/App.jsx
import React, { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { fetchCurrentUser } from "./store/authSlice"; // ✅ import thunk
import Header from "./components/Header";
import AdminRoute from "./components/AdminRoute";
import AdminPage from "./pages/AdminPage";
import AttendancePage from "./pages/AttendancePage";
import AdminAchievements from "./pages/AdminAchievements";

/* pages */
import Login from "./pages/Login";
import RegisterUser from "./pages/RegisterUser";
import Competitions from "./pages/Competitions";
import CompetitionDetails from "./pages/CompetitionDetails";
import CompetitionCreateMOdel from "./pages/CompetitionCreateModal";
import RegistrationForm from "./pages/RegistrationForm";
import MyRegistrations from "./pages/MyRegistrations";
import AdminRegistrations from "./pages/AdminRegistrations";
import Achievements from "./pages/Achievements";
import Home from "./pages/Home";

export default function App() {
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    if (localStorage.getItem("token")) {
      dispatch(fetchCurrentUser()); // 👈 restore user on refresh
    }
  }, [dispatch]);

  // Paths where we DON'T want the header
  const noHeaderPaths = [
    "/",
    "/login",
    "/register",
    "/adminpage",
    "/admin/attendance",
    "/achievements",
    "/admin/achievements",
  ];
  const hideHeader = noHeaderPaths.includes(location.pathname);

  return (
    <div className="min-h-screen body-bg">
      {!hideHeader && <Header />}

      <main
        className={
          location.pathname === "/" ? "" : "container mx-auto px-4 py-8"
        }
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/competitions" element={<Competitions />} />
          <Route path="/competitions/:id" element={<CompetitionDetails />} />
          <Route path="/register" element={<RegisterUser />} />
          <Route path="/login" element={<Login />} />
          <Route path="/adminpage" element={<AdminPage />} />
          <Route path="/admin/attendance" element={<AttendancePage />} />
          <Route path="/achievements" element={<Achievements />} />
          <Route path="/admin/achievements" element={<AdminAchievements />} />

          {/* user protected */}

          <Route
            path="/register-competition/:id"
            element={<RegistrationForm />}
          />
          <Route path="/my-registrations" element={<MyRegistrations />} />

          {/* admin protected */}
          <Route element={<AdminRoute />}>
            <Route
              path="/admin"
              element={
                <div className="card">
                  <h2 className="text-xl font-semibold">Admin Dashboard</h2>
                </div>
              }
            />
            <Route
              path="/admin/competitions/create"
              element={<CompetitionCreateMOdel />}
            />
            <Route
              path="/admin/registrations"
              element={<AdminRegistrations />}
            />
          </Route>

          {/* fallback */}
          <Route
            path="*"
            element={<div className="card">Page not found</div>}
          />
        </Routes>
      </main>
    </div>
  );
}
