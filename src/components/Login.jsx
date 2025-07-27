import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CopyIcon, DeleteIcon, EditIcon, EyeIcon, EyeSlashIcon, GenerateIcon, SaveIcon } from './Icons';

const Login = () => {
  const [form, setForm] = useState({ username: '', password: '' });
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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

    try {
      const response = await fetch('https://pass-op-dkz6.onrender.com/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        toast('Logged in successfully!', { type: 'success' });
        navigate('/');
      } else {
        const data = await response.json();
        toast(data.error || 'Invalid credentials', { type: 'error' });
      }
    } catch (error) {
      toast('Failed to login', { type: 'error' });
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
        <div className="w-full lg:w-1/2 text-left p-6 lg:pr-12 animate-fadeInUp">
          <h2 className="text-3xl sm:text-4xl font-bold text-purple-700 mb-4 flex items-center gap-2">
            <span role="img" aria-label="lock">🔐</span> About <span className="text-purple-800">passKEEPER</span>
          </h2>
          <p className="text-gray-700 text-base sm:text-lg leading-relaxed mb-4">
            <strong>passKEEPER</strong> is a secure and intuitive password manager built using the MERN stack. It allows users to safely store, manage, and retrieve their passwords from anywhere. With encrypted backend storage and real-time accessibility, your credentials stay safe yet accessible.
          </p>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1 mt-6">
            <div className="flex items-start gap-4 p-5 bg-white/60 backdrop-blur-md rounded-xl shadow-md border border-purple-100 transition hover:scale-[1.02] hover:shadow-lg">
              <div className="text-purple-600 text-2xl sm:text-3xl">🔒</div>
              <div>
                <h4 className="text-lg font-semibold text-purple-700">Secure Encryption</h4>
                <p className="text-gray-700 text-sm sm:text-base">Your passwords are encrypted before storage.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-5 bg-white/60 backdrop-blur-md rounded-xl shadow-md border border-purple-100 transition hover:scale-[1.02] hover:shadow-lg">
              <div className="text-purple-600 text-2xl sm:text-3xl">📱</div>
              <div>
                <h4 className="text-lg font-semibold text-purple-700">Cross-Device Access</h4>
                <p className="text-gray-700 text-sm sm:text-base">Access your credentials from any device.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-5 bg-white/60 backdrop-blur-md rounded-xl shadow-md border border-purple-100 transition hover:scale-[1.02] hover:shadow-lg">
              <div className="text-purple-600 text-2xl sm:text-3xl">🧠</div>
              <div>
                <h4 className="text-lg font-semibold text-purple-700">Smart Organization</h4>
                <p className="text-gray-700 text-sm sm:text-base">Group and manage passwords easily.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Login Form */}
        <div className="w-full lg:w-1/2 max-w-md mt-10 lg:mt-0 bg-white p-6 sm:p-8 rounded-xl shadow-lg animate-fadeInUp">
          <h1 className="text-3xl sm:text-4xl font-bold text-center mb-6 text-purple-800">Login</h1>
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
                className="w-full p-3 border border-purple-400 rounded-full focus:outline-none focus:ring-2 focus:ring-slate-500"
                ref={passwordRef}
              />
              <span
                className="absolute transform -translate-y-1/2 right-3 top-1/2 cursor-pointer"
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
              className="w-full px-6 py-3 bg-purple-700 text-white font-semibold rounded-full hover:bg-purple-800 transition"
            >
              Login
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
            <Link to="/signup" className="text-purple-700 font-medium hover:underline">Sign up</Link>
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
                className="px-6 py-2 text-white bg-blue-600 rounded-full"
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
                  } catch (err) {
                    toast('Failed to send reset email', { type: 'error' });
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
