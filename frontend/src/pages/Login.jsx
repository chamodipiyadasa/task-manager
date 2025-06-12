import { useState } from "react";
import { useNavigate } from "react-router-dom";


export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:5001/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Login failed");

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-emerald-100 flex items-center justify-center p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-lg max-w-md mx-auto sm:p-10"
      >
        <h2 className="text-3xl font-extrabold mb-8 text-emerald-800 text-center">
          Login
        </h2>

        {error && (
          <p className="text-red-600 bg-red-100 border border-red-300 rounded px-4 py-2 mb-6 text-sm text-center">
            {error}
          </p>
        )}

        <input
          type="email"
          placeholder="Email"
          className="w-full p- mb-5 border border-emerald-300 rounded-md
                     focus:outline-none focus:ring-2 focus:ring-emerald-500
                     focus:border-transparent transition text-emerald-900"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 mb-8 border border-emerald-300 rounded-md
                     focus:outline-none focus:ring-2 focus:ring-emerald-500
                     focus:border-transparent transition text-emerald-900"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-md font-semibold transition"
        >
          Log In
        </button>

        <p className="mt-6 text-sm text-center text-emerald-700">
          Don’t have an account?{" "}
          <a
            href="/register"
            className="text-emerald-600 hover:text-emerald-800 hover:underline transition"
          >
            Register here
          </a>
        </p>
      </form>
    </div>
  );
}
