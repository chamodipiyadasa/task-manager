import { useEffect, useState } from "react";

export default function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState("");

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5001/api/tasks", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to load tasks");

      setTasks(data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Task List</h2>
      {error && <p className="text-red-600">{error}</p>}

      {tasks.length === 0 ? (
        <p>No tasks found.</p>
      ) : (
        <table className="min-w-full border border-gray-300 rounded">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Title</th>
              <th className="p-2 border">Description</th>
              <th className="p-2 border">Deadline</th>
              <th className="p-2 border">Assigned To</th>
              <th className="p-2 border">Status</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task._id} className="text-center">
                <td className="p-2 border">{task.title}</td>
                <td className="p-2 border">{task.description}</td>
                <td className="p-2 border">{new Date(task.deadline).toLocaleDateString()}</td>
                <td className="p-2 border">{task.assignedTo}</td>
                <td className="p-2 border">{task.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
