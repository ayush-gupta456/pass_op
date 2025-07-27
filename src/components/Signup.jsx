import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { EyeIcon, EyeSlashIcon } from './Icons'; // ✅ Custom icons

const Signup = () => {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, email, password } = form;
    if (username.length < 4 || password.length < 4 || email.length < 4) {
      toast('Fields must be at least 4 characters', { type: 'error' });
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('https://pass-op-dkz6.onrender.com/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });

      if (response.ok) {
        toast('Signed up successfully!', { type: 'success' });
        navigate('/login');
      } else {
        const data = await response.json();
        toast(data.error || 'User already exists', { type: 'error' });
      }
    } catch (error) {
      toast('Failed to sign up', { type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={5000} theme="dark" />
      <div className="flex items-center justify-center min-h-[80.7vh] bg-purple-50 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
        <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
          <h1 className="text-4xl font-bold text-center text-purlple-500">Sign up</h1>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <input
              value={form.username}
              onChange={handleChange}
              placeholder="Username"
              className="w-full p-4 py-1 border border-purple-500 rounded-full"
              type="text"
              name="username"
            />
            <input
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full p-4 py-1 border border-purple-500 rounded-full"
              type="email"
              name="email"
            />
            <div className="relative">
              <input
                value={form.password}
                onChange={handleChange}
                placeholder="Password"
                className="w-full p-4 py-1 border border-purple-500 rounded-full pr-12"
                type={showPassword ? 'text' : 'password'}
                name="password"
              />
              {/* ✅ Password visibility toggle icon */}
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
              className="flex items-center justify-center w-full px-8 py-2 text-white bg-blue-600 rounded-full"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Signing up...
                </>
              ) : (
                'Sign up'
              )}
            </button>
          </form>
          <p className="text-center">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600">
              Login
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Signup;
