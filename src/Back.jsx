import { Link } from "react-router-dom";

export default function BackButton({ to = "/" }) {
  return (
    <Link
      to={to}
      className="inline-flex items-center gap-2 px-4 py-2 m-5 bg-gray-600 text-white rounded-lg shadow hover:bg-gray-700 transition duration-200"
    >
      ← Back
    </Link>
  );
}
