import React, { useEffect, useState } from "react";
import { Edit, Trash2, Plus } from "lucide-react";
import Skeleton from "../components/Skeleton";
import PageHeader from "../components/PageHeader";

export default function AdminLoveStories() {
    const [loading, setLoading] = useState(true);
    const [stories, setStories] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({
        title: "",
        location: "",
        description: "",
        thumbnail: "",
        gallery: [],
        status: "Active",
    });
    const [editingId, setEditingId] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        fetchStories();
    }, []);

    const fetchStories = async () => {
        try {
            const res = await fetch("/api/love-stories");
            const data = await res.json();
            setStories(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error fetching stories:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleThumbnailChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const base64 = await convertToBase64(file);
            setForm({ ...form, thumbnail: base64 });
        }
    };

    const handleGalleryChange = async (e) => {
        const files = Array.from(e.target.files);
        const base64Files = await Promise.all(files.map((file) => convertToBase64(file)));
        setForm({ ...form, gallery: [...form.gallery, ...base64Files] });
    };

    const removeGalleryImage = (index) => {
        setForm({
            ...form,
            gallery: form.gallery.filter((_, i) => i !== index),
        });
    };

    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSaving) return;

        if (!form.thumbnail) {
            alert("Main Thumbnail is required");
            return;
        }

        setIsSaving(true);
        const url = editingId ? `/api/love-stories/${editingId}` : "/api/love-stories";
        const method = editingId ? "PUT" : "POST";

        try {
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            if (res.ok) {
                setShowForm(false);
                setForm({ title: "", location: "", description: "", thumbnail: "", gallery: [], status: "Active" });
                setEditingId(null);
                fetchStories();
                setShowSuccess(true);
                setTimeout(() => setShowSuccess(false), 3000);
            } else {
                alert("Failed to save story");
            }
        } catch (error) {
            console.error("Error saving story:", error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleEdit = (story) => {
        setForm(story);
        setEditingId(story._id);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (confirm("Are you sure you want to delete this story?")) {
            await fetch(`/api/love-stories/${id}`, { method: "DELETE" });
            fetchStories();
        }
    };

    return (
        <div className="mt-4 container mx-auto p-4 animate-in fade-in duration-500">
            <PageHeader
                title="Love Stories"
                description="Manage and showcase beautiful love stories"
                action={
                    <button
                        onClick={() => {
                            setShowForm(true);
                            setForm({ title: "", location: "", description: "", thumbnail: "", gallery: [], status: "Active" });
                            setEditingId(null);
                        }}
                        className="flex items-center gap-2 bg-gray-900 text-white px-6 py-2.5 rounded-lg hover:bg-gray-800 transition-all shadow-lg"
                    >
                        <Plus size={18} /> Add New Story
                    </button>
                }
            />

            {showForm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowForm(false)}>
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto custom-scrollbar" onClick={(e) => e.stopPropagation()}>
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <h2 className="text-xl font-bold">{editingId ? "Edit Story" : "Add New Story"}</h2>
                            <button
                                onClick={() => setShowForm(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                ✕
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Story Title</label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={form.title}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold-500 outline-none"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                                    <input
                                        type="text"
                                        name="location"
                                        value={form.location}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold-500 outline-none"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Full Description</label>
                                <textarea
                                    name="description"
                                    value={form.description}
                                    onChange={handleChange}
                                    rows="5"
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold-500 outline-none"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Main Thumbnail (Required)</label>
                                    <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center hover:bg-gray-50 transition-colors cursor-pointer relative h-32 flex items-center justify-center">
                                        {form.thumbnail ? (
                                            <div className="relative w-full h-full">
                                                <img
                                                    src={form.thumbnail}
                                                    alt="Thumbnail"
                                                    className="w-full h-full object-contain rounded-lg"
                                                />
                                                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity rounded-lg">
                                                    <span className="text-white font-medium text-sm">Change</span>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="text-gray-400 flex flex-col items-center">
                                                <span className="text-2xl">+</span>
                                                <span className="text-xs">Upload Image</span>
                                            </div>
                                        )}
                                        <input
                                            type="file"
                                            onChange={handleThumbnailChange}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            accept="image/*"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                                    <select
                                        name="status"
                                        value={form.status}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold-500 outline-none"
                                    >
                                        <option value="Active">Active</option>
                                        <option value="Inactive">Inactive</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Gallery Images</label>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                    {form.gallery.map((img, index) => (
                                        <div key={index} className="relative group aspect-square">
                                            <img
                                                src={img}
                                                alt={`Gallery ${index}`}
                                                className="w-full h-full object-cover rounded-lg border border-gray-200"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeGalleryImage(index)}
                                                className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    ))}
                                    <label className="cursor-pointer border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center p-4 hover:border-gold-500 hover:bg-gold-50 transition aspect-square">
                                        <span className="text-2xl text-gray-400 mb-1">+</span>
                                        <span className="text-xs text-gray-500">Add Images</span>
                                        <input
                                            type="file"
                                            multiple
                                            onChange={handleGalleryChange}
                                            className="hidden"
                                            accept="image/*"
                                        />
                                    </label>
                                </div>
                            </div>

                            <div className="flex justify-end pt-4 border-t border-gray-100">
                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    className="mr-3 px-6 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="px-6 py-2 rounded-lg bg-gold-500 text-white hover:bg-gold-600 font-medium shadow-sm flex items-center gap-2"
                                >
                                    {isSaving ? (
                                        <>
                                            <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        editingId ? "Update Story" : "Create Story"
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Mobile Card View */}
                <div className="block md:hidden">
                    {loading ? (
                        <div className="divide-y divide-gray-100">
                            {[1, 2, 3].map((_, index) => (
                                <div key={index} className="p-4 space-y-3">
                                    <div className="rounded-lg overflow-hidden bg-gray-100 border border-gray-200 shadow-sm">
                                        <Skeleton width="100%" height="160px" />
                                    </div>
                                    <div>
                                        <Skeleton width="70%" height="20px" style={{ marginBottom: "5px" }} />
                                        <Skeleton width="50%" height="16px" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : stories.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">No love stories found. Add your first one!</div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {stories.map((story) => (
                                <div key={story._id} className="p-4 space-y-3">
                                    <div className="relative h-40 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 shadow-sm group">
                                        {story.thumbnail ? (
                                            <img
                                                src={story.thumbnail}
                                                alt={story.title}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gray-50">
                                                <span className="text-gray-400">No Image</span>
                                            </div>
                                        )}
                                        <span className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-xs font-medium shadow-sm ${story.status === "Active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                                            {story.status}
                                        </span>
                                    </div>

                                    <div>
                                        <h3 className="font-semibold text-gray-900 text-lg leading-tight">{story.title}</h3>
                                        <p className="text-sm text-gray-500 mt-0.5">{story.location}</p>
                                    </div>

                                    <div className="flex justify-end gap-2 pt-1">
                                        <button
                                            onClick={() => handleEdit(story)}
                                            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-gray-200"
                                        >
                                            <Edit size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(story._id)}
                                            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-gray-200"
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
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase font-medium">
                            <tr>
                                <th className="px-6 py-4">Thumbnail</th>
                                <th className="px-6 py-4">Title</th>
                                <th className="px-6 py-4">Location</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                [1, 2, 3, 4, 5].map((_, index) => (
                                    <tr key={index}>
                                        <td className="px-6 py-4">
                                            <Skeleton width="64px" height="64px" borderRadius="8px" />
                                        </td>
                                        <td className="px-6 py-4"><Skeleton width="180px" height="20px" /></td>
                                        <td className="px-6 py-4"><Skeleton width="120px" height="20px" /></td>
                                        <td className="px-6 py-4"><Skeleton width="60px" height="24px" borderRadius="16px" /></td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <Skeleton width="34px" height="34px" borderRadius="8px" />
                                                <Skeleton width="34px" height="34px" borderRadius="8px" />
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : stories.map((story) => (
                                <tr key={story._id} className="hover:bg-gray-50 transition">
                                    <td className="px-6 py-4">
                                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                                            <img
                                                src={story.thumbnail}
                                                alt={story.title}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-medium text-gray-900">{story.title}</td>
                                    <td className="px-6 py-4 text-gray-500">{story.location}</td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${story.status === "Active"
                                                ? "bg-green-100 text-green-700"
                                                : "bg-gray-100 text-gray-700"
                                                }`}
                                        >
                                            {story.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => handleEdit(story)}
                                                className="p-2 text-gray-500 hover:text-gold-500 hover:bg-gold-50 rounded-lg transition"
                                            >
                                                <Edit size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(story._id)}
                                                className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {!loading && stories.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-gray-400">
                                        No love stories found. Add your first one!
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            {/* Success Popup */}
            {showSuccess && (
                <div className="fixed bottom-10 right-10 z-[100] animate-bounce">
                    <div className="flex items-center gap-3 rounded-xl bg-emerald-500 px-6 py-4 shadow-2xl text-white">
                        <span className="text-2xl">👉</span>
                        <div className="font-bold">Story saved successfully</div>
                    </div>
                </div>
            )}
        </div>
    );
}
