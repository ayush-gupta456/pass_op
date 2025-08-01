import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { EyeIcon, EyeSlashIcon } from './Icons';

const Login = () => {
  const [form, setForm] = useState({ username: '', password: '' });
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const passwordRef = useRef(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, password } = form;

    if (username.length < 4 || password.length < 4) {
      toast('Fields must be at least 4 characters', { type: 'error' });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('https://pass-op-dkz6.onrender.com/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: username, password }),
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token);
        toast('Logged in successfully!', { type: 'success' });
        navigate('/');
      } else {
        toast(data.error || 'Invalid credentials', { type: 'error' });
      }
    } catch {
      toast('Failed to login', { type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    if (passwordRef.current) {
      const isPasswordHidden = passwordRef.current.type === 'password';
      passwordRef.current.type = isPasswordHidden ? 'text' : 'password';
      setShowPassword(!showPassword);
    }
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={5000} theme="dark" />

      <div className="min-h-screen flex flex-col lg:flex-row items-center justify-center bg-purple-50 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] px-4 py-12">
        {/* About Section */}
        <div className="w-full p-6 text-left lg:w-1/2 lg:pr-12 animate-fadeInUp">
          <h2 className="flex items-center gap-2 mb-4 text-3xl font-bold text-purple-700 sm:text-4xl">
            <span role="img" aria-label="lock">🔐</span> About <span className="text-purple-800">passKEEPER</span>
          </h2>
          <p className="mb-4 text-base leading-relaxed text-gray-700 sm:text-lg">
            <strong>passKEEPER</strong> is a secure and intuitive password manager built using the MERN stack. It allows users to safely store, manage, and retrieve their passwords from anywhere. With encrypted backend storage and real-time accessibility, your credentials stay safe yet accessible.
          </p>

          <div className="grid gap-6 mt-6 sm:grid-cols-2 lg:grid-cols-1">
            <div className="flex items-start gap-4 p-5 bg-white/60 backdrop-blur-md rounded-xl shadow-md border border-purple-100 transition hover:scale-[1.02] hover:shadow-lg">
              <div className="text-2xl text-purple-600 sm:text-3xl">🔒</div>
              <div>
                <h4 className="text-lg font-semibold text-purple-700">Secure Encryption</h4>
                <p className="text-sm text-gray-700 sm:text-base">Your passwords are encrypted before storage.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-5 bg-white/60 backdrop-blur-md rounded-xl shadow-md border border-purple-100 transition hover:scale-[1.02] hover:shadow-lg">
              <div className="text-2xl text-purple-600 sm:text-3xl">📱</div>
              <div>
                <h4 className="text-lg font-semibold text-purple-700">Cross-Device Access</h4>
                <p className="text-sm text-gray-700 sm:text-base">Access your credentials from any device.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-5 bg-white/60 backdrop-blur-md rounded-xl shadow-md border border-purple-100 transition hover:scale-[1.02] hover:shadow-lg">
              <div className="text-2xl text-purple-600 sm:text-3xl">🧠</div>
              <div>
                <h4 className="text-lg font-semibold text-purple-700">Smart Organization</h4>
                <p className="text-sm text-gray-700 sm:text-base">Group and manage passwords easily.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Login Form */}
        <div className="w-full max-w-md p-6 mt-10 bg-white shadow-lg lg:w-1/2 lg:mt-0 sm:p-8 rounded-xl animate-fadeInUp">
          <h1 className="mb-6 text-3xl font-bold text-center text-purple-800 sm:text-4xl">Login</h1>
          <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
            <input
              type="text"
              name="username"
              placeholder="Username or Email"
              value={form.username}
              onChange={handleChange}
              className="w-full p-3 border border-purple-400 rounded-full focus:outline-none focus:ring-2 focus:ring-slate-500"
            />
            <div className="relative">
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                ref={passwordRef}
                className="w-full p-3 border border-purple-400 rounded-full focus:outline-none focus:ring-2 focus:ring-slate-500"
              />
              <span
                className="absolute transform -translate-y-1/2 cursor-pointer right-3 top-1/2"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? (
                  <EyeSlashIcon className="w-5 h-5" />
                ) : (
                  <EyeIcon className="w-5 h-5" />
                )}
              </span>
            </div>
            <button
              type="submit"
              className="flex items-center justify-center w-full gap-2 px-6 py-3 font-semibold text-white transition bg-purple-700 rounded-full hover:bg-purple-800"
              disabled={loading}
            >
              {loading && <span className="w-5 h-5 border-2 border-white rounded-full border-t-transparent animate-spin" />}
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="flex flex-col items-center mt-4">
            <button
              type="button"
              onClick={() => setShowForgot(true)}
              className="text-sm text-purple-600 hover:underline"
            >
              Forgot password?
            </button>
          </div>

          <p className="mt-6 text-center text-gray-700">
            Don’t have an account?{' '}
            <Link to="/signup" className="font-medium text-green-600 hover:underline">Sign up</Link>
          </p>
        </div>
      </div>

      {/* Forgot Password Modal */}
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
            />
            <div className="flex justify-center gap-4">
              <button
                type="button"
                className="flex items-center gap-2 px-6 py-2 text-white bg-blue-600 rounded-full"
                disabled={forgotLoading}
                onClick={async () => {
                  if (!forgotEmail || forgotEmail.length < 4) {
                    toast('Please enter a valid email', { type: 'error' });
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
                      toast(data.message || 'Password reset email sent!', { type: 'success' });
                      setShowForgot(false);
                      setForgotEmail('');
                    } else {
                      toast(data.error || 'Failed to send reset email', { type: 'error' });
                    }
                  } catch {
                    toast('Failed to send reset email', { type: 'error' });
                  } finally {
                    setForgotLoading(false);
                  }
                }}
              >
                {forgotLoading && <span className="w-4 h-4 border-2 border-white rounded-full border-t-transparent animate-spin" />}
                {forgotLoading ? 'Sending...' : 'Send Reset Link'}
              </button>
              <button
                type="button"
                className="px-6 py-2 text-gray-700 bg-gray-200 rounded-full"
                onClick={() => { setShowForgot(false); setForgotEmail(''); }}
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
