import { useEffect, useRef, useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { v4 as uuidv4 } from 'uuid';
import { CopyIcon, DeleteIcon, EditIcon, EyeIcon, EyeSlashIcon, GenerateIcon, SaveIcon } from './Icons';
import bcrypt from 'bcryptjs';

const Manager = () => {
  const passwordRef = useRef();
  const [form, setForm] = useState({ site: "", username: "", password: "" });
  const [passwordArray, setPasswordArray] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [visiblePasswords, setVisiblePasswords] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const useBackend = true;
  const API_URL_BASE = 'https://pass-op-dkz6.onrender.com/api/passwords';

  const fetchPasswords = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(API_URL_BASE, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to fetch from backend');
      const data = await response.json();
      setPasswordArray(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPasswords();
  }, []);

  const copyText = (text) => {
    toast('Copied to clipboard!', { position: "top-right", autoClose: 5000, theme: "dark" });
    navigator.clipboard.writeText(text);
  };

  const togglePasswordVisibility = () => {
    if (passwordRef.current) {
      const isPasswordHidden = passwordRef.current.type === "password";
      passwordRef.current.type = isPasswordHidden ? "text" : "password";
      setShowPassword(!showPassword);
    }
  };

  const savePassword = async () => {
    const { site, username, password } = form;
    if (site.length < 4 || username.length < 4 || password.length < 4) {
      toast('Fields must be at least 4 characters', { type: "error" });
      return;
    }
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const url = form.id ? `${API_URL_BASE}/${form.id}` : API_URL_BASE;
      const method = form.id ? 'PUT' : 'POST';
      const hashedPassword = await bcrypt.hash(password, 10);

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ site, username, password: hashedPassword }),
      });
      if (!response.ok) throw new Error(`Failed to ${method} password`);
      const updatedPassword = await response.json();
      setPasswordArray(prev => {
        if (form.id) {
          return prev.map(p => (p.id === form.id || p._id === form.id) ? updatedPassword : p);
        } else {
          return [...prev, updatedPassword];
        }
      });
      setForm({ site: "", username: "", password: "" });
      toast(form.id ? 'Password Updated!' : 'Password Saved!', { type: "success" });
    } catch (err) {
      console.error('Error saving password:', err);
      setError(err.message);
      toast('Saved locally only', { type: "warning" });
    } finally {
      setLoading(false);
    }
  };

  const deletePassword = async (id) => {
    if (!window.confirm("Delete this password?")) return;
    try {
      setLoading(true);
      const updatedPasswords = passwordArray.filter(item => (item.id || item._id) !== id);
      setPasswordArray(updatedPasswords);
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL_BASE}/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to delete from backend');
      toast('Password Deleted!', { type: "success" });
    } catch (err) {
      console.error('Error deleting password:', err);
      setError(err.message);
      toast('Deleted locally only', { type: "warning" });
    } finally {
      setLoading(false);
    }
  };

  const editPassword = (id) => {
    const passwordToEdit = passwordArray.find(i => (i.id || i._id) === id);
    if (passwordToEdit) {
      setForm({
        ...passwordToEdit,
        id: passwordToEdit._id || passwordToEdit.id
      });
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibilityInTable = (id) => {
    setVisiblePasswords(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const generatePassword = () => {
    const length = 14;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~|}{[]:;?><,./-=";
    let newPassword = '';
    for (let i = 0, n = charset.length; i < length; ++i) {
      newPassword += charset.charAt(Math.floor(Math.random() * n));
    }
    setForm({ ...form, password: newPassword });
    if (passwordRef.current) {
      passwordRef.current.type = "text";
      setShowPassword(true);
    }
    toast('New password generated!', { autoClose: 3000, theme: "dark" });
  };

  const filteredPasswords = passwordArray.filter(item => {
    const site = item?.site || '';
    const username = item?.username || '';
    return (
      site.toLowerCase().includes(searchTerm.toLowerCase()) ||
      username.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="container mx-auto px-4 py-6">
      <ToastContainer />
      <h1 className="text-3xl md:text-4xl font-bold text-center text-purple-600 mb-6">Password Manager</h1>

      {loading && (
        <div className="flex justify-center items-center mb-4">
          <span className="w-5 h-5 mr-2 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></span>
          <span>Loading...</span>
        </div>
      )}

      <div className="mb-6 flex flex-col md:flex-row md:items-center md:space-x-4">
        <input
          type="text"
          name="site"
          value={form.site}
          onChange={handleChange}
          placeholder="Site"
          className="w-full md:w-1/3 mb-2 md:mb-0 p-2 border border-gray-300 rounded"
        />
        <input
          type="text"
          name="username"
          value={form.username}
          onChange={handleChange}
          placeholder="Username"
          className="w-full md:w-1/3 mb-2 md:mb-0 p-2 border border-gray-300 rounded"
        />
        <div className="relative w-full md:w-1/3 flex">
          <input
            type="password"
            name="password"
            ref={passwordRef}
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full p-2 border border-gray-300 rounded"
          />
          <button type="button" className="absolute right-2 top-2" onClick={togglePasswordVisibility}>
            {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
          </button>
        </div>
        <button onClick={generatePassword} className="bg-blue-500 text-white px-4 py-2 rounded mt-2 md:mt-0">
          <GenerateIcon className="inline-block w-4 h-4 mr-1" /> Generate
        </button>
        <button onClick={savePassword} className="bg-green-600 text-white px-4 py-2 rounded mt-2 md:mt-0">
          {loading ? (
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          ) : (
            <SaveIcon className="inline-block w-4 h-4 mr-1" />
          )}
          {form.id ? 'Update' : 'Save'}
        </button>
      </div>

      <input
        type="text"
        placeholder="Search by site or username"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full mb-4 p-2 border border-gray-300 rounded"
      />

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="text-left p-3 border">Site</th>
              <th className="text-left p-3 border">Username</th>
              <th className="text-left p-3 border">Password</th>
              <th className="text-center p-3 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPasswords.map((item) => (
              <tr key={item._id || item.id} className="hover:bg-gray-50">
                <td className="p-3 border">{item.site}</td>
                <td className="p-3 border">{item.username}</td>
                <td className="p-3 border">
                  <div className="flex items-center">
                    <span className="mr-2">
                      {visiblePasswords[item._id || item.id] ? item.password : '•'.repeat(10)}
                    </span>
                    <button onClick={() => togglePasswordVisibilityInTable(item._id || item.id)}>
                      {visiblePasswords[item._id || item.id] ? <EyeSlashIcon /> : <EyeIcon />}
                    </button>
                  </div>
                </td>
                <td className="p-3 border text-center space-x-2">
                  <button onClick={() => copyText(item.password)}><CopyIcon /></button>
                  <button onClick={() => editPassword(item._id || item.id)}><EditIcon /></button>
                  <button onClick={() => deletePassword(item._id || item.id)}><DeleteIcon /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Manager;
