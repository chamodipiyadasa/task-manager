import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/login");
    } else {
      setUser(JSON.parse(storedUser));
      fetchStats();
    }
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5001/api/tasks/stats", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to load stats");
      setStats(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  // Prepare data for Pie chart
  const pieData = {
    labels: ["Pending", "Completed", "Other"],
    datasets: [
      {
        label: "Tasks",
        data: stats
          ? [stats.pending, stats.completed, stats.total - stats.pending - stats.completed]
          : [],
        backgroundColor: ["#fbbf24", "#22c55e", "#64748b"], // yellow, green, gray
        hoverOffset: 10,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white shadow rounded p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">
            Welcome to Your Dashboard
          </h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>

        <div className="text-gray-700 mb-6">
          <p>
            <strong>Name:</strong> {user?.name}
          </p>
          <p>
            <strong>Email:</strong> {user?.email}
          </p>
        </div>

        <button
          onClick={() => navigate("/tasks")}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mb-6"
        >
          View Task List
        </button>

        <h2 className="text-xl font-semibold mb-4">Task Stats</h2>

        {error && <p className="text-red-600 mb-4">{error}</p>}

        {!stats ? (
          <p>Loading stats...</p>
        ) : (
          <div className="max-w-sm mx-auto">
            <Pie data={pieData} />
            <div className="mt-4 text-center text-gray-700">
              <p>Total Tasks: {stats.total}</p>
              <p>Pending: {stats.pending}</p>
              <p>Completed: {stats.completed}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
