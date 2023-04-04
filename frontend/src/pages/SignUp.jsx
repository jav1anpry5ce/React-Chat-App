import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

export default function SignUp() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { name, username, image_url, password, confirm_password } = e.target;
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
      image_url: image_url.value,
      password: password.value,
    };

    const res = await axios.post(
      "http://localhost:5000/api/signup",
      data,
      config
    );
    if (res.status === 200) {
      setLoading(false);
      setError(null);
      e.target.reset();
      navigate("/login");
    } else {
      setLoading(false);
      setError(res.data);
    }
  };

  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-gray-900 text-white">
      <div className="flex w-full max-w-lg flex-col items-center justify-center gap-4 rounded bg-gray-700/50 p-4 shadow-lg shadow-black/30">
        <h1 className="text-2xl font-bold text-white">Sign Up</h1>
        <form className="w-full space-y-3 py-2" onSubmit={handleSubmit}>
          <div>
            <input
              required
              type="text"
              name="name"
              className="sm:text-md block w-full rounded-lg border border-gray-300 bg-gray-50 p-2 text-gray-900 outline-none focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
              placeholder="name"
            />
            {error?.name && (
              <p className="ml-1 text-xs text-red-400">{error.name}</p>
            )}
          </div>
          <div>
            <input
              required
              type="text"
              name="username"
              className="sm:text-md block w-full rounded-lg border border-gray-300 bg-gray-50 p-2 text-gray-900 outline-none focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
              placeholder="username"
            />
            {error?.username && (
              <p className="ml-1 text-xs text-red-400">{error.username}</p>
            )}
          </div>
          <div>
            <input
              required
              type="url"
              name="image_url"
              className="sm:text-md block w-full rounded-lg border border-gray-300 bg-gray-50 p-2 text-gray-900 outline-none focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
              placeholder="Image url"
            />
            {error?.image_url && (
              <p className="ml-1 text-xs text-red-400">{error.image_url}</p>
            )}
          </div>
          <div>
            <input
              required
              type="password"
              name="password"
              className="sm:text-md block w-full rounded-lg border border-gray-300 bg-gray-50 p-2 text-gray-900 outline-none focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
              placeholder="password"
            />
            {error?.password && (
              <p className="ml-1 text-xs text-red-400">{error.password}</p>
            )}
          </div>
          <div>
            <input
              required
              type="password"
              name="confirm_password"
              className="sm:text-md block w-full rounded-lg border border-gray-300 bg-gray-50 p-2 text-gray-900 outline-none focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
              placeholder="confirm password"
            />
            {error?.confirm_password && (
              <p className="ml-1 text-xs text-red-400">
                {error.confirm_password}
              </p>
            )}
          </div>
          <button
            type="submit"
            className="w-full rounded bg-gradient-to-r from-violet-500 to-fuchsia-500 p-2 font-serif font-bold shadow-none shadow-fuchsia-500/50 hover:from-fuchsia-500 hover:to-violet-500 hover:shadow-lg"
          >
            <div className="inline-flex items-center gap-2">
              <p>Sign Up</p>
              {loading && (
                <AiOutlineLoading3Quarters className="inline-block animate-spin" />
              )}
            </div>
          </button>
          <Link to="/login">
            <p className="pt-2 text-center text-sm text-white hover:text-blue-400">
              Already have an account? Login here
            </p>
          </Link>
        </form>
      </div>
    </main>
  );
}
