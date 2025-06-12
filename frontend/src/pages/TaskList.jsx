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
      console.log("Fetched tasks:", data);
      setTasks(data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [filterStatus, filterUser]);

  const handleEdit = (taskId) => navigate(`/tasks/edit/${taskId}`);

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
      await fetchTasks();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const statusOrder = { pending: 1, "in-progress": 2, completed: 3 };

  const statusClassMap = {
    pending: "status-pending",
    "in-progress": "status-in-progress",
    completed: "status-completed",
  };

const filteredTasks = tasks
  .filter((task) => {
    const status = (task.status || "").toLowerCase();
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesUser = filterUser
      ? task.assignedTo.toLowerCase().includes(filterUser.toLowerCase())
      : true;

    let matchesStatus = true;
    if (filterStatus) {
      matchesStatus = status === filterStatus;
    }

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
          ? statusOrder[(a.status || "").toLowerCase()] - statusOrder[(b.status || "").toLowerCase()]
          : statusOrder[(b.status || "").toLowerCase()] - statusOrder[(a.status || "").toLowerCase()];
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
    const data = filteredTasks.map((task) => [
      task.title,
      task.description,
      new Date(task.deadline).toLocaleDateString(),
      task.assignedTo,
      task.status,
    ]);

    autoTable(doc, {
      head: headers,
      body: data,
      startY: 30,
      styles: { fontSize: 10, cellPadding: 3 },
      headStyles: { fillColor: [16, 185, 129], textColor: 255, fontStyle: "bold" },
      alternateRowStyles: { fillColor: [240, 255, 244] },
    });

    doc.save("task-list-report.pdf");
  };

  return (
    <div className="page-container">
      <div className="container max-width">
        {/* Header */}
        <div className="header">
          <h1 className="header-title">Task Management</h1>
          <Link to="/tasks/add" className="btn btn-primary">
            <svg xmlns="http://www.w3.org/2000/svg" className="btn-icon" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            Add New Task
          </Link>
        </div>

        {/* Error */}
        {error && <div className="error-message">{error}</div>}

        {/* Filters & Controls */}
        <div className="filters-container">
          <div className="filters-grid">
            <div className="filter-item">
              <label>Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div className="filter-item">
              <label>Assigned To</label>
              <input
                type="text"
                placeholder="Filter by email"
                value={filterUser}
                onChange={(e) => setFilterUser(e.target.value)}
              />
            </div>

            <div className="filter-item">
              <label>Search</label>
              <input
                type="text"
                placeholder="Search tasks"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="filter-item filter-actions">
              <button onClick={fetchTasks} className="btn btn-filter">
                Apply Filters
              </button>
              <button onClick={generatePDF} className="btn btn-danger">
                Export PDF
              </button>
            </div>
          </div>

          <div className="sorting-controls">
            <div className="sort-item">
              <label>Sort By:</label>
              <select
                value={sortField}
                onChange={(e) => setSortField(e.target.value)}
              >
                <option value="">None</option>
                <option value="title">Title</option>
                <option value="deadline">Deadline</option>
                <option value="status">Status</option>
              </select>
            </div>

            <div className="sort-item">
              <label>Order:</label>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
              >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tasks Table */}
        {filteredTasks.length === 0 ? (
          <div className="no-tasks">No tasks found.</div>
        ) : (
          <div className="table-wrapper">
            <table className="tasks-table">
              <thead>
                <tr>
                  {["Title", "Description", "Deadline", "Assigned To", "Status", "Actions"].map(
                    (header) => (
                      <th key={header} className="table-header">
                        {header}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {filteredTasks.map((task) => (
                  <tr key={task._id} className="table-row">
                    <td className="table-cell task-title">{task.title}</td>
                    <td className="table-cell task-description" title={task.description}>
                      {task.description}
                    </td>
                    <td className="table-cell">{new Date(task.deadline).toLocaleDateString()}</td>
                    <td className="table-cell">{task.assignedTo}</td>
                    <td className="table-cell">
                      <span
                        className={`status-badge ${
                          statusClassMap[(task.status || "").toLowerCase()] || ""
                        }`}
                      >
                        {task.status}
                      </span>
                    </td>
                    <td className="table-cell actions-cell">
                      <button
                        onClick={() => handleEdit(task._id)}
                        className="btn btn-edit"
                        title="Edit Task"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDelete(task._id)}
                        disabled={isDeleting}
                        className="btn btn-delete"
                        title="Delete Task"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
