// src/components/Header.jsx
import React from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/authSlice";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-xl font-semibold text-slate-700">
          Yogalaya
        </Link>

        <nav className="space-x-4">
          <Link
            className="text-sm text-slate-600 hover:text-slate-900"
            to="/competitions"
          >
            Competitions
          </Link>
          {user ? (
            <>
              {user.role === "admin" ? (
                <Link
                  className="text-sm text-indigo-600 font-medium"
                  to="/admin"
                >
                  Admin
                </Link>
              ) : (
                <Link
                  className="text-sm text-indigo-600 font-medium"
                  to="/my-registrations"
                >
                  My Registrations
                </Link>
              )}
              <button
                onClick={() => {
                  dispatch(logout());
                  navigate("/login");
                }}
                className="ml-3 px-3 py-1 bg-red-50 text-red-600 rounded"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm px-3 py-1 border rounded">
                Login
              </Link>
              <Link
                to="/register"
                className="text-sm px-3 py-1 ml-2 border rounded"
              >
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
