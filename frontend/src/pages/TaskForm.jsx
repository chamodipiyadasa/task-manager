import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";


export default function TaskForm({ mode = "add" }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [status, setStatus] = useState("Pending");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (mode === "edit" && id) {
      fetch(`http://localhost:5001/api/tasks/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setTitle(data.title);
          setDescription(data.description);
          setDeadline(data.deadline?.slice(0, 10));
          setAssignedTo(data.assignedTo);
          setStatus(data.status);
        })
        .catch((err) => {
          console.error("Failed to fetch task:", err);
          setError("Failed to load task for editing.");
        });
    }
  }, [mode, id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const payload = { title, description, deadline, assignedTo, status };
    const url =
      mode === "edit"
        ? `http://localhost:5001/api/tasks/${id}`
        : "http://localhost:5001/api/tasks";

    const method = mode === "edit" ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Something went wrong");

      navigate("/tasks");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="page-container min-h-screen flex justify-center items-start pt-10">
      <div className="max-w-4xl bg-white shadow rounded p-6">
        <h2 className="text-2xl font-semibold mb-6 text-emerald-800">
          {mode === "edit" ? "Edit Task" : "Create New Task"}
        </h2>

        {error && (
          <div className="error-message mb-6 flex items-center gap-2">
            <span className="text-red-600 text-xl">⚠️</span>
            <div>{error}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="form-group">
            <label htmlFor="title" className="block font-semibold mb-1 text-gray-700">
              Title
            </label>
            <input
              type="text"
              id="title"
              placeholder="Enter task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description" className="block font-semibold mb-1 text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              placeholder="Enter task description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="w-full border border-gray-300 rounded px-3 py-2 resize-y focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="form-group">
            <label htmlFor="deadline" className="block font-semibold mb-1 text-gray-700">
              Deadline
            </label>
            <input
              type="date"
              id="deadline"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              required
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="form-group">
            <label htmlFor="assignedTo" className="block font-semibold mb-1 text-gray-700">
              Assigned To
            </label>
            <input
              type="email"
              id="assignedTo"
              placeholder="Enter assignee email"
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              required
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="form-group">
            <label htmlFor="status" className="block font-semibold mb-1 text-gray-700">
              Status
            </label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <button
            type="submit"
            className="btn btn-primary px-6 py-2 w-full text-center"
          >
            {mode === "edit" ? "Update Task" : "Create Task"}
          </button>
        </form>
      </div>
    </div>
  );
}