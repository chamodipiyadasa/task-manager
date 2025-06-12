import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Register.js (updated styles to match Dashboard theme)

export default function Register() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:5001/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Registration failed");

      navigate("/login");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-emerald-100 flex items-center justify-center p-6">
      <form
        onSubmit={handleRegister}
        className="bg-white p-8 rounded-lg shadow-lg max-w-md mx-auto sm:p-10"
      >
        <h2 className="text-3xl font-extrabold mb-8 text-emerald-800 text-center">
          Register
        </h2>

        {error && (
          <p className="text-red-600 bg-red-100 border border-red-300 rounded px-4 py-2 mb-6 text-sm text-center">
            {error}
          </p>
        )}

        <input
          type="text"
          placeholder="Name"
          className="w-full p-3 mb-5 border border-emerald-300 rounded-md
                     focus:outline-none focus:ring-2 focus:ring-emerald-500
                     focus:border-transparent transition text-emerald-900"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 mb-5 border border-emerald-300 rounded-md
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
          Register
        </button>

        <p className="mt-6 text-sm text-center text-emerald-700">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-emerald-600 hover:text-emerald-800 hover:underline transition"
          >
            Log in here
          </a>
        </p>
      </form>
    </div>
  );
}
