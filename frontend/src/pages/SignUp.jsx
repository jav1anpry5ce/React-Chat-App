import { useContext, useState } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import axios from "axios";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { ChatContext } from "../utils/ChatContext";

export default function SignUp() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user } = useContext(ChatContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { name, username, password, confirm_password } = e.target;
    if (password.value !== confirm_password.value) {
      setError({ confirm_password: "passwords do not match" });
      setLoading(false);
      return;
    }
    if (password.value.length < 8) {
      setError({ password: "password must be at least 8 characters" });
      setLoading(false);
      return;
    }

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const data = {
      username: username.value,
      name: name.value,
      password: password.value,
    };

    axios
      .post(`${process.env.REACT_APP_API_URI}/api/signup`, data, config)
      .then(() => {
        setLoading(false);
        setError(null);
        e.target.reset();
        navigate("/login");
      })
      .catch((err) => {
        setLoading(false);
        setError(err.response.data);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  if (user) return <Navigate to="/" />;
  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-gradient-to-tr from-gray-900 to-cyan-950 px-4 text-white">
      <div className="flex w-full max-w-lg flex-col items-center justify-center gap-4 rounded bg-gray-700/50 p-4 shadow-lg shadow-black/30">
        <h1 className="text-2xl font-bold text-white">Sign Up</h1>
        <form className="w-full space-y-3 py-2" onSubmit={handleSubmit}>
          <div className="form-control w-full">
            <input
              required
              type="text"
              name="name"
              className="input-bordered input w-full"
              placeholder="name"
            />
            {error?.name && (
              <label className="label">
                <span className="label-text-alt text-red-400">
                  {error.name}
                </span>
              </label>
            )}
          </div>
          <div className="form-control w-full">
            <input
              required
              type="text"
              name="username"
              className="input-bordered input w-full"
              placeholder="username"
            />
            {error?.username && (
              <label className="label">
                <span className="label-text-alt text-red-400">
                  {error.username}
                </span>
              </label>
            )}
          </div>
          <div className="form-control w-full">
            <input
              required
              type="password"
              name="password"
              className="input-bordered input w-full"
              placeholder="password"
            />
            {error?.password && (
              <label className="label">
                <span className="label-text-alt text-red-400">
                  {error.password}
                </span>
              </label>
            )}
          </div>
          <div className="form-control w-full">
            <input
              required
              type="password"
              name="confirm_password"
              className="input-bordered input w-full"
              placeholder="confirm password"
            />
            {error?.confirm_password && (
              <label className="label">
                <span className="label-text-alt text-red-400">
                  {error.confirm_password}
                </span>
              </label>
            )}
          </div>
          <button
            type="submit"
            className="btn w-full rounded border-none bg-gradient-to-r from-violet-500 to-fuchsia-500 p-2 font-serif font-bold text-white shadow-none shadow-fuchsia-500/50 hover:from-fuchsia-500 hover:to-violet-500 hover:shadow-lg"
          >
            <div className="inline-flex items-center gap-2">
              <p>Sign Up</p>
              {loading && (
                <AiOutlineLoading3Quarters className="inline-block animate-spin" />
              )}
            </div>
          </button>
          <div className="mx-auto w-fit">
            <Link to="/login">
              <p className="text-center text-sm text-white hover:text-blue-400">
                Already have an account? Login here
              </p>
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}
