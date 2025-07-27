import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { FaCopy, FaEye, FaEyeSlash, FaTrash, FaEdit } from "react-icons/fa";

const Manager = () => {
  const [form, setForm] = useState({ site: "", username: "", password: "" });
  const [passwordArray, setPasswordArray] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showPasswordMap, setShowPasswordMap] = useState({});
  const [editingId, setEditingId] = useState(null);
  const navigate = useNavigate();

  const fetchPasswords = async () => {
    try {
      const res = await axios.get("/api/passwords", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setPasswordArray(res.data);
    } catch (err) {
      toast.error("Error fetching passwords");
      navigate("/login");
    }
  };

  useEffect(() => {
    fetchPasswords();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`/api/passwords/${editingId}`, form, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        toast.success("Password updated");
        setEditingId(null);
      } else {
        await axios.post("/api/passwords", form, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        toast.success("Password saved");
      }
      setForm({ site: "", username: "", password: "" });
      fetchPasswords();
    } catch (err) {
      toast.error("Error saving password");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/passwords/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      toast.success("Password deleted");
      fetchPasswords();
    } catch (err) {
      toast.error("Error deleting password");
    }
  };

  const handleEdit = (item) => {
    setForm({ site: item.site, username: item.username, password: item.password });
    setEditingId(item._id || item.id);
  };

  const toggleShowPassword = (id) => {
    setShowPasswordMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Password copied to clipboard");
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="mb-6 text-3xl font-bold text-center">Password Manager</h1>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-8">
        <input
          type="text"
          name="site"
          value={form.site}
          onChange={handleChange}
          placeholder="Site"
          className="p-2 border rounded"
        />
        <input
          type="text"
          name="username"
          value={form.username}
          onChange={handleChange}
          placeholder="Username"
          className="p-2 border rounded"
        />
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Password"
          className="p-2 border rounded"
        />
        <button type="submit" className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700">
          {editingId ? "Update Password" : "Save Password"}
        </button>
      </form>

      {/* Search */}
      <input
        type="text"
        placeholder="Search by site or username"
        className="w-full p-2 mb-4 border rounded"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* Filtered Table or Empty Message */}
      {passwordArray.filter(item =>
        (item?.site || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item?.username || "").toLowerCase().includes(searchTerm.toLowerCase())
      ).length === 0 && (
        <div>No matching passwords found.</div>
      )}

      {passwordArray.filter(item =>
        (item?.site || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item?.username || "").toLowerCase().includes(searchTerm.toLowerCase())
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
                (item?.site || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                (item?.username || "").toLowerCase().includes(searchTerm.toLowerCase())
              ).map((item) => {
                const itemId = item._id || item.id;
                return (
                  <tr key={itemId}>
                    <td className="px-4 py-2 border">{item.site}</td>
                    <td className="px-4 py-2 border">{item.username}</td>
                    <td className="px-4 py-2 border">
                      {showPasswordMap[itemId] ? item.password : "●●●●●●●"}
                      <button
                        className="ml-2"
                        onClick={() => toggleShowPassword(itemId)}
                      >
                        {showPasswordMap[itemId] ? <FaEyeSlash /> : <FaEye />}
                      </button>
                      <button
                        className="ml-2"
                        onClick={() => copyToClipboard(item.password)}
                      >
                        <FaCopy />
                      </button>
                    </td>
                    <td className="px-4 py-2 border">
                      <button className="mr-2 text-blue-600" onClick={() => handleEdit(item)}>
                        <FaEdit />
                      </button>
                      <button className="text-red-600" onClick={() => handleDelete(itemId)}>
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Manager;
