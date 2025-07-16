import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

/**
 * The Signup component handles user registration.
 * @returns {React.ReactElement} - The signup form.
 */
const Signup = () => {
    const [form, setForm] = useState({ username: '', email: '', password: '' });
    const navigate = useNavigate();

    /**
     * Handles changes to the form fields.
     * @param {React.ChangeEvent<HTMLInputElement>} e - The change event.
     */
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    /**
     * Handles the form submission.
     * @param {React.FormEvent<HTMLFormElement>} e - The form event.
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        const { username, email, password } = form;
        if (username.length < 4 || password.length < 4 || email.length < 4) {
            toast('Fields must be at least 4 characters', { type: 'error' });
            return;
        }

        try {
            // FOR LOCAL DEVELOPMENT - Using proxy
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password }),
            });
            // FOR DEPLOYMENT - Update the URL above to your production URL:
            // const response = await fetch('https://your-production-domain.com/api/auth/register', {

            if (response.ok) {
                toast('Signed up successfully!', { type: 'success' });
                navigate('/login');
            } else {
                const data = await response.json();
                toast(data.error || 'User already exists', { type: 'error' });
            }
        } catch (error) {
            toast('Failed to sign up', { type: 'error' });
        }
    };

    return (
        <>
            <ToastContainer position="top-right" autoClose={5000} theme="dark" />
            <div className="flex items-center justify-center min-h-[80.7vh] bg-purple-50 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
                <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
                    <h1 className="text-4xl font-bold text-center">Sign up</h1>
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
                            Sign up
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
