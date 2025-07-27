import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const [form, setForm] = useState({ username: '', password: '' });
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    toast.success('Login submitted');
  };

  const handleForgotPassword = async () => {
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
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={5000} theme="dark" />

      <div className="min-h-screen flex flex-col lg:flex-row items-center justify-center px-4 py-12 bg-purple-50 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] gap-y-12 gap-x-12">
        {/* About Section */}
        <div className="w-full lg:w-1/2 text-left p-6 md:px-8 animate-fadeInUp">
          <h2 className="text-3xl sm:text-4xl font-bold text-purple-700 mb-4 flex items-center gap-2">
            <span role="img" aria-label="lock">🔐</span> About <span className="text-purple-800">passKEEPER</span>
          </h2>
          <p className="text-gray-700 text-base sm:text-lg leading-relaxed mb-6">
            <strong>passKEEPER</strong> is a secure and intuitive password manager built using the MERN stack. It allows users to safely store, manage, and retrieve their passwords from anywhere.
          </p>

          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-1">
            {/* Feature Cards */}
            {[
              { icon: '🔒', title: 'Secure Encryption', desc: 'Your passwords are encrypted before storage.', delay: '0' },
              { icon: '📱', title: 'Cross-Device Access', desc: 'Access your credentials from any device.', delay: '150' },
              { icon: '🧠', title: 'Smart Organization', desc: 'Group and manage passwords easily.', delay: '300' },
            ].map((item, idx) => (
              <div
                key={idx}
                className={`flex items-start gap-4 p-5 bg-white/60 backdrop-blur-md rounded-xl shadow-md border border-purple-100 transition hover:scale-[1.02] hover:shadow-lg animate-fadeInUp delay-${item.delay}`}
              >
                <div className="text-purple-600 text-3xl">{item.icon}</div>
                <div>
                  <h4 className="text-lg font-semibold text-purple-700">{item.title}</h4>
                  <p className="text-gray-700">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Login Form */}
        <div className="w-full lg:w-1/2 max-w-md bg-white p-6 sm:p-8 rounded-xl shadow-lg animate-fadeInUp">
          <h1 className="text-3xl sm:text-4xl font-bold text-center mb-6 text-purple-800">Login</h1>
          <form className="space-y-5" onSubmit={handleSubmit}>
            <input
              type="text"
              name="username"
              placeholder="Username or Email"
              value={form.username}
              onChange={handleChange}
              className="w-full p-3 border border-purple-400 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="w-full p-3 border border-purple-400 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              type="submit"
              className="w-full px-8 py-3 bg-purple-700 text-white font-semibold rounded-full hover:bg-purple-800 transition"
            >
              Login
            </button>
          </form>

          <div className="flex justify-center mt-4">
            <button
              type="button"
              onClick={() => setShowForgot(true)}
              className="text-sm text-purple-600 hover:underline"
            >
              Forgot password?
            </button>
          </div>

          <p className="mt-6 text-center text-gray-700 text-sm sm:text-base">
            Don’t have an account?{' '}
            <Link to="/signup" className="text-purple-700 font-medium hover:underline">Sign up</Link>
          </p>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md mx-4 p-6 sm:p-8 bg-white rounded-xl shadow-xl">
            <h2 className="mb-4 text-xl sm:text-2xl font-bold text-center text-purple-800">Forgot Password</h2>
            <input
              type="email"
              placeholder="Enter your registered email"
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              className="w-full p-3 mb-4 border border-purple-400 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <div className="flex justify-center gap-4">
              <button
                type="button"
                disabled={forgotLoading}
                onClick={handleForgotPassword}
                className="px-6 py-2 bg-purple-700 text-white rounded-full hover:bg-purple-800 transition"
              >
                {forgotLoading ? 'Sending...' : 'Send Reset Link'}
              </button>
              <button
                type="button"
                onClick={() => { setShowForgot(false); setForgotEmail(''); }}
                className="px-6 py-2 bg-gray-200 text-gray-800 rounded-full hover:bg-gray-300 transition"
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
