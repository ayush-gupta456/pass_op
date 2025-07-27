import { useEffect, useRef, useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { v4 as uuidv4 } from 'uuid';
import { CopyIcon, DeleteIcon, EditIcon, EyeIcon, EyeSlashIcon, GenerateIcon, SaveIcon } from './Icons';

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
        headers: {
          'Authorization': `Bearer ${token}`
        }
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
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ site, username, password }),
      });
      if (!response.ok) throw new Error(`Failed to ${method} password`);

      // Update passwordArray after successful save
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
        headers: {
          'Authorization': `Bearer ${token}`
        }
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
    setVisiblePasswords(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
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

  return (
    <>
      <ToastContainer position="top-right" autoClose={5000} theme="dark" />
      <div className="p-3 md:mycontainer min-h-[80.7vh]">
        <h1 className="text-4xl font-bold text-center text">
          <span className="text-purple-500">&lt; </span>
          pass<span className="text-purple-500">KEEPER/ &gt;</span>
        </h1>
        <p className="text-lg text-center text-purple-900">
          Your own Password Manager
        </p>

        <form className="flex flex-col items-center gap-6 p-4 text-black md:gap-8 md:p-6" onSubmit={(e) => e.preventDefault()}>
          <input
            value={form.site}
            onChange={handleChange}
            placeholder="Enter website URL*"
            className="w-full p-4 py-1 border border-purple-500 rounded-full"
            type="text"
            name="site"
            id="site"
          />
          <div className="flex flex-col w-full gap-4 md:flex-row">
            <input
              value={form.username}
              onChange={handleChange}
              placeholder="Enter Username*"
              className="w-full p-4 py-1 border border-purple-500 rounded-full"
              type="text"
              name="username"
              id="username"
            />
            <div className="relative">
              <input
                ref={passwordRef}
                value={form.password}
                onChange={handleChange}
                placeholder="Enter Password*"
                className="w-full p-4 py-1 pr-10 border border-purple-500 rounded-full"
                type="password"
                name="password"
                id="password"
              />
              <span className="absolute transform -translate-y-1/2 right-3 top-1/2">
                {showPassword ? (
                  <EyeSlashIcon className="w-5 h-5" onClick={togglePasswordVisibility} />
                ) : (
                  <EyeIcon className="w-5 h-5" onClick={togglePasswordVisibility} />
                )}
              </span>
            </div>
          </div>
          <div className="flex flex-col items-center gap-4 md:flex-row md:gap-6">
            <button
              onClick={savePassword}
              className="flex items-center justify-center gap-2 px-8 py-2 text-white transition-colors bg-blue-600 border border-purple-700 rounded-full w-fit hover:bg-purple-300"
            >
              <SaveIcon className="w-5 h-5" />
              Save Password
            </button>
            <button
              onClick={generatePassword}
              className="flex items-center justify-center gap-2 px-4 py-2 text-white transition-colors bg-green-600 border border-green-700 rounded-full w-fit hover:bg-green-400"
            >
              <GenerateIcon className="w-5 h-5" />
              Generate Password
            </button>
          </div>
        </form>

        <div className="passwords">
          <div className="flex items-center justify-between">
            <h2 className="py-4 text-xl font-bold">Your Passwords</h2>
            <input
              type="text"
              placeholder="Search passwords..."
              className="px-4 py-1 mb-2 border border-purple-500 rounded-full md:mb-0"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {error && (
            <div className="p-3 mb-4 text-orange-800 bg-orange-100 border border-orange-300 rounded">
              ⚠️ Backend sync failed: {error}
            </div>
          )}

          {loading && (
            <div className="flex items-center justify-center py-8">
              <div className="w-8 h-8 border-b-2 border-purple-500 rounded-full animate-spin"></div>
              <span className="ml-2">Loading...</span>
            </div>
          )}

          {passwordArray.filter(item =>
            item.site.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.username.toLowerCase().includes(searchTerm.toLowerCase())
          ).length === 0 && (
            <div>No matching passwords found.
              {passwordArray.length > 0 && searchTerm.length > 0 ? '(Try a different search term)' : ''}
              {searchTerm.length === 0 && passwordArray.length === 0 ? '(No passwords saved yet)' : ''}
            </div>
          )}

          {passwordArray.filter(item =>
            item.site.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.username.toLowerCase().includes(searchTerm.toLowerCase())
          ).length !== 0 && (
            <div className="overflow-x-auto">
              <table className="w-full mb-10 overflow-hidden rounded-md table-auto">
                <thead className="text-white bg-blue-600">
                  <tr>
                    <th className="py-2 border border-white">Site</th>
                    <th className="py-2 border border-white">Username</th>
                    <th className="py-2 border border-white">Password</th>
                    <th className="py-2 border border-white">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-purple-200">
                  {passwordArray.filter(item =>
                    item.site.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    item.username.toLowerCase().includes(searchTerm.toLowerCase())
                  ).map((item, index) => {
                    const itemId = item._id || item.id;
                    return (
                      <tr key={itemId || index}>
                        <td className="py-2 text-center border border-white">
                          <div className="flex items-center justify-center gap-2">
                            <a href={item.site} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{item.site}</a>
                            <CopyIcon className="w-4 h-4 cursor-pointer" onClick={() => copyText(item.site)} />
                          </div>
                        </td>
                        <td className="py-2 text-center border border-white">
                          <div className="flex items-center justify-center gap-2">
                            <span>{item.username}</span>
                            <CopyIcon className="w-4 h-4 cursor-pointer" onClick={() => copyText(item.username)} />
                          </div>
                        </td>
                        <td className="py-2 text-center border border-white">
                          <div className="flex items-center justify-center gap-2">
                            <span className="font-mono">
                              {visiblePasswords[itemId] ? item.password : '•'.repeat(item.password.length)}
                            </span>
                            <div className="flex gap-1">
                              {visiblePasswords[itemId] ? (
                                <EyeSlashIcon className="w-4 h-4 cursor-pointer" onClick={() => togglePasswordVisibilityInTable(itemId)} />
                              ) : (
                                <EyeIcon className="w-4 h-4 cursor-pointer" onClick={() => togglePasswordVisibilityInTable(itemId)} />
                              )}
                              <CopyIcon className="w-4 h-4 cursor-pointer" onClick={() => copyText(item.password)} />
                            </div>
                          </div>
                        </td>
                        <td className="justify-center py-2 text-center border border-white">
                          <div className="flex items-center justify-center gap-2">
                            <EditIcon className="w-4 h-4 cursor-pointer" onClick={() => editPassword(itemId)} />
                            <DeleteIcon className="w-4 h-4 cursor-pointer" onClick={() => deletePassword(itemId)} />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Manager;
