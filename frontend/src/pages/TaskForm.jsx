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
        });
    }
  }, [mode, id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const payload = { title, description, deadline, assignedTo, status };

    const url = mode === "edit"
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
    <div className="max-w-xl mx-auto mt-10 bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">{mode === "edit" ? "Edit Task" : "Add Task"}</h2>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          className="w-full p-2 border rounded mb-4"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Description"
          className="w-full p-2 border rounded mb-4"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <input
          type="date"
          className="w-full p-2 border rounded mb-4"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Assigned To"
          className="w-full p-2 border rounded mb-4"
          value={assignedTo}
          onChange={(e) => setAssignedTo(e.target.value)}
          required
        />
        <select
          className="w-full p-2 border rounded mb-4"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option>Pending</option>
          <option>In Progress</option>
          <option>Completed</option>
        </select>
        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          {mode === "edit" ? "Update Task" : "Add Task"}
        </button>
      </form>
    </div>
  );
}
