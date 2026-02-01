import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import PageHeader from "../components/PageHeader";

export default function AdminUsers() {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ id: null, name: "", email: "", phone: "", role: "user", status: "Active", password: "" });

  const [deleteId, setDeleteId] = useState(null);

  // Password Reveal State
  const [revealModalOpen, setRevealModalOpen] = useState(false);
  const [revealTargetId, setRevealTargetId] = useState(null);
  const [adminPassword, setAdminPassword] = useState("");
  const [revealedPassword, setRevealedPassword] = useState(null);
  const [revealLoading, setRevealLoading] = useState(false);

  const handleRevealPassword = async (e) => {
    e.preventDefault();
    if (!adminPassword) return toast.error("Please enter admin password");

    setRevealLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch("/api/users/reveal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ adminPassword, targetUserId: revealTargetId })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to reveal");

      setRevealedPassword(data.password);
      toast.success("Identity verified");
    } catch (err) {
      toast.error(err.message);
      setRevealedPassword(null);
    } finally {
      setRevealLoading(false);
    }
  };

  const closeRevealModal = () => {
    setRevealModalOpen(false);
    setRevealTargetId(null);
    setAdminPassword("");
    setRevealedPassword(null);
  };

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await fetch("/api/users");
      if (!res.ok) throw new Error("Failed to fetch users");
      return res.json();
    },
  });

  const mutation = useMutation({
    mutationFn: async (data) => {
      const url = data.id ? `/api/users/${data.id}` : "/api/users";
      const method = data.id ? "PUT" : "POST";
      const { id, ...body } = data;
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("Failed to save user");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success(form.id ? "User updated" : "User created");
      setModalOpen(false);
      setForm({ id: null, name: "", email: "", phone: "", role: "user", status: "Active", password: "" });
    },
    onError: (err) => toast.error(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete user");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User deleted");
      setDeleteId(null);
    },
  });

  return (
    <div className="mt-4 container mx-auto p-4 animate-in fade-in duration-500">
      <PageHeader
        title="User Management"
        description="Manage system users and access control"
        action={
          <button
            onClick={() => { setForm({ id: null, name: "", email: "", phone: "", role: "user", status: "Active", password: "" }); setModalOpen(true); }}
            className="flex items-center gap-2 bg-gray-900 text-white px-6 py-2.5 rounded-lg hover:bg-gray-800 transition-all shadow-lg"
          >
            <Plus size={18} /> Add User
          </button>
        }
      />

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Mobile Card View */}
        <div className="block md:hidden">
          {isLoading ? (
            <div className="p-8 text-center text-gray-500">Loading users...</div>
          ) : users.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No users found</div>
          ) : (
            <div className="divide-y divide-gray-100">
              {users.map((user) => (
                <div key={user._id} className="p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-900">{user.name}</h3>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${user.status === "Active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                      {user.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="text-gray-500">
                      <span className="font-medium text-gray-700">Role:</span> {user.role}
                    </div>
                    <div className="text-gray-500">
                      {user.phone || "No phone"}
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      onClick={() => { setForm({ id: user._id, name: user.name, email: user.email, phone: user.phone || "", role: user.role, status: user.status || "Active", password: "" }); setModalOpen(true); }}
                      className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => setDeleteId(user._id)}
                      className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead className="bg-gray-50 text-gray-600 text-xs font-bold uppercase tracking-wider">
              <tr>
                <th className="p-4 border-b">Name</th>
                <th className="p-4 border-b">Email</th>
                <th className="p-4 border-b">Phone</th>
                <th className="p-4 border-b">Password</th>
                <th className="p-4 border-b">Role</th>
                <th className="p-4 border-b">Status</th>
                <th className="p-4 border-b text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr><td colSpan={6} className="p-8 text-center text-gray-500">Loading users...</td></tr>
              ) : users.length === 0 ? (
                <tr><td colSpan={6} className="p-8 text-center text-gray-500">No users found</td></tr>
              ) : (
                users.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-semibold text-gray-900">{user.name}</td>
                    <td className="p-4 text-gray-600">{user.email}</td>
                    <td className="p-4 text-gray-600">{user.phone || "-"}</td>
                    <td className="p-4">
                      <button
                        onClick={() => { setRevealTargetId(user._id); setRevealModalOpen(true); }}
                        className="flex items-center gap-2 text-gray-500 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg transition-colors text-xs font-medium"
                      >
                        <span className="tracking-widest">••••••</span>
                        <Eye size={14} />
                      </button>
                    </td>
                    <td className="p-4 uppercase text-xs font-bold text-gray-500">{user.role}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${user.status === "Active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="inline-flex gap-2">
                        <button
                          onClick={() => { setForm({ id: user._id, name: user.name, email: user.email, phone: user.phone || "", role: user.role, status: user.status || "Active", password: "" }); setModalOpen(true); }}
                          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          onClick={() => setDeleteId(user._id)}
                          className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setModalOpen(false)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto custom-scrollbar" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">{form.id ? "Edit User" : "New User"}</h2>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-gray-600 p-1">✕</button>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-shadow"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-shadow"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Phone</label>
                <input
                  type="text"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-shadow"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Role</label>
                  <select
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-shadow bg-white"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                    <option value="editor">Editor</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-shadow bg-white"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password {form.id && "(Leave blank to keep current)"}</label>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-shadow"
                />
              </div>
            </div>

            <div className="mt-8 flex justify-end gap-3 pt-4 border-t border-gray-100">
              <button onClick={() => setModalOpen(false)} className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">Cancel</button>
              <button
                onClick={() => {
                  if (!form.id && !form.password) {
                    toast.error("Password is required for new users");
                    return;
                  }
                  mutation.mutate(form);
                }}
                className="px-5 py-2.5 text-sm font-medium bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors shadow-md"
              >
                {form.id ? "Update User" : "Create User"}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setDeleteId(null)}>
          <div className="bg-white rounded-xl p-6 w-full max-w-sm text-center shadow-2xl animate-in fade-in zoom-in duration-200" onClick={(e) => e.stopPropagation()}>
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 size={24} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Delete User?</h3>
            <p className="text-gray-500 mb-6 text-sm">Are you sure you want to delete this user?</p>
            <div className="flex justify-center gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors">Cancel</button>
              <button onClick={() => deleteMutation.mutate(deleteId)} className="flex-1 px-4 py-2.5 text-sm font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-md">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Reveal Password Modal */}
      {revealModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={closeRevealModal}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-200" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Eye size={20} className="text-gold-500" /> View User Password
              </h2>
              <button onClick={closeRevealModal} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>

            {!revealedPassword ? (
              <form onSubmit={handleRevealPassword}>
                <div className="mb-4">
                  <p className="text-sm text-gray-500 mb-4">
                    Security Verification: Please enter your <strong>Admin Password</strong> to view this user's password.
                  </p>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Admin Password</label>
                  <input
                    type="password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-black outline-none"
                    placeholder="Enter your password"
                    autoFocus
                  />
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <button type="button" onClick={closeRevealModal} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">Cancel</button>
                  <button
                    type="submit"
                    disabled={revealLoading}
                    className="px-4 py-2 text-sm font-medium bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors shadow-md disabled:opacity-70 flex items-center gap-2"
                  >
                    {revealLoading ? "Verifying..." : "View Password"}
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center py-4">
                <div className="text-sm text-gray-500 mb-2">User's Password</div>
                <div className="text-2xl font-mono font-bold text-gray-900 bg-gray-100 p-4 rounded-xl border border-gray-200 select-all mb-6 break-all">
                  {revealedPassword}
                </div>
                <button
                  onClick={closeRevealModal}
                  className="w-full px-4 py-2.5 text-sm font-medium bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors shadow-md"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
