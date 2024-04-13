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
      .post(`${process.env.REACT_APP_API_URI}/api/login`, data, config)
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
        console.log(err);
        setError(err.response.data);
        setLoading(false);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  if (user && Object.keys(user).length > 0) return <Navigate to="/" />;
  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-gradient-to-tr from-gray-900 to-cyan-950 px-4 text-white">
      <div className="flex w-full max-w-lg flex-col items-center justify-center gap-4 rounded bg-gray-700/50 p-4 shadow-lg shadow-black/30">
        <h1 className="text-2xl font-bold text-white">Login</h1>
        <form className="w-full space-y-4 py-2" onSubmit={handleSubmit}>
          <input
            required
            type="text"
            name="username"
            className="input-bordered input w-full"
            placeholder="username"
          />
          <input
            required
            type="password"
            name="password"
            className="input-bordered input w-full"
            placeholder="password"
          />
          {error && (
            <p className="ml-1 text-sm text-red-400">{error.message}</p>
          )}
          <button
            disabled={loading}
            type="submit"
            className="btn-outline btn w-full"
          >
            <p>Login</p>
            {loading && (
              <AiOutlineLoading3Quarters className="inline-block animate-spin" />
            )}
          </button>
          <div className="mx-auto -mt-4 w-fit">
            <Link to="/signup">
              <p className="text-center text-sm text-white hover:text-blue-400">
                Don't have an account? Register here
              </p>
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}
