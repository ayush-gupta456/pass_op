import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
    const [form, setForm] = useState({ username: '', password: '' });
    const [showForgot, setShowForgot] = useState(false);
    const [forgotEmail, setForgotEmail] = useState('');
    const [forgotLoading, setForgotLoading] = useState(false);
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
            // FOR LOCAL DEVELOPMENT - Using proxy
            const response = await fetch('https://pass-op-dkz6.onrender.com/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ identifier: username, password }),
            });
            // FOR DEPLOYMENT - Update the URL above to your production URL:
            // const response = await fetch('https://your-production-domain.com/api/auth/login', {

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

    return (
        <>
            <ToastContainer position="top-right" autoClose={5000} theme="dark" />
            <div className="flex items-center justify-center min-h-[80.7vh] bg-purple-50 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
                <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
                    <h1 className="text-4xl font-bold text-center">Login</h1>
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <input
                            value={form.username}
                            onChange={handleChange}
                            placeholder="Username or Email"
                            className="w-full p-4 py-1 border border-purple-500 rounded-full"
                            type="text"
                            name="username"
                        />
                        <input
                            value={form.password}
                            onChange={handleChange}
                            placeholder="Password"
                            className="w-full p-4 py-1 border border-purple-500 rounded-full"
                            type="password"
                            name="password"
                        />
                        <button
                            type="submit"
                            className="w-full px-8 py-2 text-white bg-blue-600 rounded-full"
                        >
                            Login
                        </button>
                    </form>
                    <div className="flex flex-col items-center">
                        <button
                            type="button"
                            className="mt-2 text-sm text-blue-600 hover:underline focus:outline-none"
                            onClick={() => setShowForgot(true)}
                        >
                            Forgot password?
                        </button>
                    </div>
                    <p className="mt-4 text-center">
                        Don't have an account?{' '}
                        <Link to="/signup" className="text-blue-600">
                            Sign up
                        </Link>
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
