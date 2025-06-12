import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import TaskList from "./pages/TaskList";
import TaskForm from "./pages/TaskForm";
import './index.css';  // or wherever your Tailwind CSS file is


function App() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
        <Route path="/login" element={<Login onLogin={() => window.location.replace("/dashboard")} />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={user ? <Dashboard /> : <Navigate to="/login" />}
        />
        <Route path="/tasks" element={user ? <TaskList /> : <Navigate to="/login" />} />
         <Route path="/tasks/add" element={user ? <TaskForm mode="add" /> : <Navigate to="/login" />} />
<Route path="/tasks/edit/:id" element={user ? <TaskForm mode="edit" /> : <Navigate to="/login" />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
