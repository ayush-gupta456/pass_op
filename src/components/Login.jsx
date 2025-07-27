import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username || !form.password) {
      toast.error("Please fill all fields");
      return;
    }
    try {
      const response = await fetch("https://pass-op-dkz6.onrender.com/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.username,
          password: form.password,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success("Login successful");
        localStorage.setItem("token", data.token);
        navigate("/dashboard");
      } else {
        toast.error(data.message || data.error || "Login failed");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={4000} theme="dark" />

      <div className="min-h-screen flex flex-col md:flex-row items-center justify-center bg-purple-50 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] px-4 py-12">

        <div className="w-full md:w-1/2 text-left p-6 md:pr-12 animate-fadeInUp">
          <h2 className="text-4xl font-bold text-purple-700 mb-4 flex items-center gap-2">
            <span role="img" aria-label="lock">🔐</span> About <span className="text-purple-800">passKEEPER</span>
          </h2>
          <p className="text-gray-700 text-lg leading-relaxed mb-6">
            <strong>passKEEPER</strong> is a secure and intuitive password manager built using the MERN stack. It allows users to safely store, manage, and retrieve their passwords from anywhere.
          </p>
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <span className="text-purple-600 text-xl">🔒</span>
              <div>
                <h4 className="font-semibold text-purple-700">Secure Encryption</h4>
                <p className="text-gray-600">Your passwords are safely encrypted before storage.</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-purple-600 text-xl">📱</span>
              <div>
                <h4 className="font-semibold text-purple-700">Cross-Device Access</h4>
                <p className="text-gray-600">Easily access your credentials from any device.</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-purple-600 text-xl">🧠</span>
              <div>
                <h4 className="font-semibold text-purple-700">Smart Organization</h4>
                <p className="text-gray-600">Group, search, and manage your passwords with ease.</p>
              </div>
            </li>
          </ul>
        </div>

        <div className="w-full md:w-1/2 max-w-md mt-10 md:mt-0 bg-white p-8 rounded-lg shadow-lg animate-fadeInUp">
          <h1 className="text-4xl font-bold text-center mb-6">Login</h1>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <input
              value={form.username}
              onChange={handleChange}
              placeholder="Email"
              className="w-full p-4 py-1 border border-purple-500 rounded-full"
              type="text"
              name="username"
              required
            />
            <div className="relative">
              <input
                value={form.password}
                onChange={handleChange}
                placeholder="Password"
                className="w-full p-4 py-1 border border-purple-500 rounded-full pr-10"
                type={showPassword ? "text" : "password"}
                name="password"
                required
              />
              <img
                src={showPassword ? "/icons/eyecross.png" : "/icons/eye.png"}
                alt="toggle visibility"
                className="w-6 h-6 absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              />
            </div>
            <button
              type="submit"
              className="w-full px-8 py-2 text-white bg-blue-600 rounded-full"
            >
              Login
            </button>
          </form>

          <div className="flex flex-col items-center mt-2">
            <button
              type="button"
              className="text-sm text-blue-600 hover:underline focus:outline-none"
              onClick={() => setShowForgot(true)}
            >
              Forgot password?
            </button>
          </div>
          <p className="mt-4 text-center">
            Don't have an account?{' '}
            <Link to="/signup" className="text-blue-600">Sign up</Link>
          </p>
        </div>
      </div>

      {showForgot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
            <h2 className="mb-4 text-2xl font-bold text-center">Forgot Password</h2>
            <input
              type="email"
              className="w-full p-4 py-1 mb-4 border border-purple-500 rounded-full"
              placeholder="Enter your registered email"
              value={forgotEmail}
              onChange={e => setForgotEmail(e.target.value)}
              required
            />
            <div className="flex justify-center gap-4">
              <button
                type="button"
                className="px-6 py-2 text-white bg-blue-600 rounded-full"
                disabled={forgotLoading}
                onClick={async () => {
                  if (!forgotEmail || forgotEmail.length < 4) {
                    toast.error('Please enter a valid email');
                    return;
                  }
                  setForgotLoading(true);
                  try {
                    const response = await fetch('https://pass-op-dkz6.onrender.com/api/auth/forgot-password', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ email: forgotEmail }),
                    });
                    const data = await response.json();
                    if (response.ok) {
                      toast.success(data.message || 'Password reset email sent!');
                      setShowForgot(false);
                      setForgotEmail('');
                    } else {
                      toast.error(data.error || 'Failed to send reset email');
                    }
                  } catch (err) {
                    toast.error('Failed to send reset email');
                  } finally {
                    setForgotLoading(false);
                  }
                }}
              >
                {forgotLoading ? 'Sending...' : 'Send Reset Link'}
              </button>
              <button
                type="button"
                className="px-6 py-2 text-gray-700 bg-gray-200 rounded-full"
                onClick={() => {
                  setShowForgot(false);
                  setForgotEmail('');
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Login;
