import { useState } from "react";
import { useNavigate } from "react-router";
import { supabase } from "../utils/supabase";
import { saveToken, saveUser } from "../utils/auth";
import { logout, setCurrentUser } from "../utils/storage";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setMessage(error.message);
        setLoading(false);
        return;
      }

      const token = data.session?.access_token;
      if (!token) {
        setMessage("Login failed: missing access token");
        setLoading(false);
        return;
      }

      saveToken(token);

      const res = await fetch("http://127.0.0.1:8000/auth/me/", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const userData = await res.json();

      if (!res.ok || !userData.success) {
        logout();
        setMessage(userData.message || "Failed to load user profile");
        setLoading(false);
        return;
      }

      saveUser(userData);
      setCurrentUser(userData);

      setMessage("Login successful");
      setLoading(false);

      // 5. Redirect
      navigate("/todo");
    } catch (err) {
      setMessage("Something went wrong during login");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <h2 className="mb-6 text-center text-2xl font-bold">
          Sign in to DailyBits
        </h2>

        <form onSubmit={handleLogin} className="space-y-4">
          {/* Email */}
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              className="w-full rounded border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="mb-1 block text-sm font-medium"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              className="w-full rounded border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded bg-blue-600 py-2 text-white transition hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          {/* Signup */}
          <p className="mt-4 text-center text-sm">
            Don't have an account?
            <span
              onClick={() => navigate("/signup")}
              className="ml-1 cursor-pointer text-blue-600 hover:underline"
            >
              Sign up
            </span>
          </p>
        </form>

        {/* Message */}
        {message && (
          <p className="mt-4 text-center text-sm text-red-500">{message}</p>
        )}
      </div>
    </div>
  );
}
