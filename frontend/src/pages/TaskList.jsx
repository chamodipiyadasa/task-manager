import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export default function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterUser, setFilterUser] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem("token");
      const queryParams = new URLSearchParams({
        status: filterStatus,
        assignedTo: filterUser,
      });
      const res = await fetch(`http://localhost:5001/api/tasks?${queryParams.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
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
  }, [filterStatus, filterUser]);

  const handleEdit = (taskId) => {
    navigate(`/tasks/edit/${taskId}`);
  };

  const handleDelete = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    
    setIsDeleting(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5001/api/tasks/${taskId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to delete task");
      }
      
      // Refresh the task list after successful deletion
      await fetchTasks();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const statusOrder = { pending: 1, "in-progress": 2, completed: 3 };

  const filteredTasks = tasks
    .filter((task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesUser = filterUser
        ? task.assignedTo.toLowerCase().includes(filterUser.toLowerCase())
        : true;
      const matchesStatus = filterStatus ? task.status === filterStatus : true;
      return matchesSearch && matchesUser && matchesStatus;
    })
    .sort((a, b) => {
      if (!sortField) return 0;
      if (sortField === "deadline") {
        return sortOrder === "asc"
          ? new Date(a.deadline) - new Date(b.deadline)
          : new Date(b.deadline) - new Date(a.deadline);
      } else if (sortField === "status") {
        return sortOrder === "asc"
          ? statusOrder[a.status] - statusOrder[b.status]
          : statusOrder[b.status] - statusOrder[a.status];
      } else {
        return sortOrder === "asc"
          ? a[sortField].localeCompare(b[sortField])
          : b[sortField].localeCompare(a[sortField]);
      }
    });

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Task List Report", 14, 22);
    doc.setFontSize(11);
    doc.setTextColor(100);

    const headers = [["Title", "Description", "Deadline", "Assigned To", "Status"]];
    const data = filteredTasks.map(task => [
      task.title,
      task.description,
      new Date(task.deadline).toLocaleDateString(),
      task.assignedTo,
      task.status
    ]);

    autoTable(doc, {
      head: headers,
      body: data,
      startY: 30,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [22, 160, 133] },
    });

    doc.save("task-list-report.pdf");
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Task List</h2>
        <Link
          to="/tasks/add"
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          + Add Task
        </Link>
      </div>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <div className="flex flex-wrap gap-4 mb-4">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border px-2 py-1 rounded"
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>

        <input
          type="text"
          placeholder="Filter by user email"
          value={filterUser}
          onChange={(e) => setFilterUser(e.target.value)}
          className="border px-2 py-1 rounded"
        />

        <input
          type="text"
          placeholder="Search title/description"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border px-2 py-1 rounded flex-grow"
        />

        <select
          value={sortField}
          onChange={(e) => setSortField(e.target.value)}
          className="border px-2 py-1 rounded"
        >
          <option value="">Sort By</option>
          <option value="title">Title</option>
          <option value="deadline">Deadline</option>
          <option value="status">Status</option>
        </select>

        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="border px-2 py-1 rounded"
        >
          <option value="asc">Asc</option>
          <option value="desc">Desc</option>
        </select>

        <button
          onClick={fetchTasks}
          className="bg-blue-500 text-white px-3 py-1 rounded"
        >
          Apply Filters
        </button>

        <button
          onClick={generatePDF}
          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
        >
          Download PDF
        </button>
      </div>

      {filteredTasks.length === 0 ? (
        <p className="text-gray-600">No tasks found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 rounded">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">Title</th>
                <th className="p-2 border">Description</th>
                <th className="p-2 border">Deadline</th>
                <th className="p-2 border">Assigned To</th>
                <th className="p-2 border">Status</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map((task) => (
                <tr key={task._id} className="text-center hover:bg-gray-50">
                  <td className="p-2 border">{task.title}</td>
                  <td className="p-2 border">{task.description}</td>
                  <td className="p-2 border">
                    {new Date(task.deadline).toLocaleDateString()}
                  </td>
                  <td className="p-2 border">{task.assignedTo}</td>
                  <td className="p-2 border">{task.status}</td>
                  <td className="p-2 border">
                    <div className="flex justify-center space-x-2">
                      <button
                        onClick={() => handleEdit(task._id)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(task._id)}
                        disabled={isDeleting}
                        className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-sm disabled:opacity-50"
                      >
                        {isDeleting ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}