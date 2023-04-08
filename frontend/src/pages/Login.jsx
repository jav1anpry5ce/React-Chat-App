import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import axios from "axios";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { ChatContext } from "../utils/ChatContext";

export default function Login() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { socket, setUser, user } = useContext(ChatContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { username, password } = e.target;
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const data = {
      username: username.value,
      password: password.value,
    };

    axios
      .post("http://localhost:5000/api/login", data, config)
      .then((res) => {
        socket.emit("getChats", res.data.username);
        const user = {
          username: res.data.username,
          name: res.data.name,
          image: res.data.image,
          token: res.data.token,
        };
        localStorage.setItem("user", JSON.stringify(user));
        setUser(user);
        navigate("/");
        setLoading(false);
      })
      .catch((err) => {
        setError(err.response.data);
        setLoading(false);
      });
  };
  if (user && Object.keys(user).length > 0) return <Navigate to="/" />;
  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-gray-900 text-white">
      <div className="flex w-full max-w-lg flex-col items-center justify-center gap-4 rounded bg-gray-700/50 p-4 shadow-lg shadow-black/30">
        <h1 className="text-2xl font-bold text-white">Login</h1>
        <form className="w-full space-y-4 py-2" onSubmit={handleSubmit}>
          <input
            required
            type="text"
            name="username"
            className="sm:text-md block w-full rounded-lg border border-gray-300 bg-gray-50 p-2 text-gray-900 outline-none focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            placeholder="username"
          />
          <input
            required
            type="password"
            name="password"
            className="sm:text-md block w-full rounded-lg border border-gray-300 bg-gray-50 p-2 text-gray-900 outline-none focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            placeholder="password"
          />
          {error && (
            <p className="ml-1 text-sm text-red-400">{error.message}</p>
          )}
          <button
            disabled={loading}
            type="submit"
            className="inline-flex w-full items-center justify-center gap-2 rounded bg-gradient-to-r from-violet-500 to-fuchsia-500 p-2 font-serif font-bold shadow-none shadow-fuchsia-500/50 hover:from-fuchsia-500 hover:to-violet-500 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70"
          >
            <p>Login</p>
            {loading && (
              <AiOutlineLoading3Quarters className="inline-block animate-spin" />
            )}
          </button>
          <Link to="/signup">
            <p className="pt-2 text-center text-sm text-white hover:text-blue-400">
              Don't have an account? Register here
            </p>
          </Link>
        </form>
      </div>
    </main>
  );
}
