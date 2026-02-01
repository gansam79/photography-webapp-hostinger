import React, { useEffect, useState } from "react";
import { Trash2, Edit2, Plus, GripVertical, Star, AlertCircle, Search, ToggleLeft, ToggleRight, X } from "lucide-react";
import { Link } from "react-router-dom";
import Skeleton from "../components/Skeleton";
import PageHeader from "../components/PageHeader";

export default function AdminTestimonials() {
    const [testimonials, setTestimonials] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const [currentTestimonial, setCurrentTestimonial] = useState({
        coupleName: "",
        location: "",
        thumbnail: "",
        shortDescription: "",
        fullDescription: "",
        rating: 5,
        displayOrder: 0,
        status: "Active"
    });

    useEffect(() => {
        fetchTestimonials();
    }, []);

    const fetchTestimonials = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/testimonials");

            // Check content type before parsing
            const contentType = res.headers.get("content-type");
            if (contentType && contentType.includes("text/html")) {
                console.error("API returned HTML instead of JSON. Server restart required.");
                alert("⚠️ Backend Update Required\n\nThe new Testimonials API is not loaded yet.\n\nPlease go to your terminal, STOP the server (Ctrl+C), and START it again (npm run dev).");
                return;
            }

            if (!res.ok) {
                if (res.status === 404) {
                    alert("API endpoint not found. Please restart your server.");
                } else {
                    console.error("Server error:", res.status);
                }
                setLoading(false);
                return;
            }

            const data = await res.json();
            setTestimonials(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error fetching testimonials:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Simple Base64 conversion for this demo
            // ideally upload to cloud/server
            const reader = new FileReader();
            reader.onloadend = () => {
                setCurrentTestimonial(prev => ({ ...prev, thumbnail: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSaving) return;
        setIsSaving(true);

        try {
            const url = isEditing && currentTestimonial._id
                ? `/api/testimonials/${currentTestimonial._id}`
                : "/api/testimonials";

            const method = isEditing ? "PUT" : "POST";

            const res = await fetch(url, {
                method: method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(currentTestimonial),
            });

            if (res.ok) {
                setShowModal(false);
                resetForm();
                fetchTestimonials();
            } else {
                const errorData = await res.json();
                alert(`Error saving testimonial: ${errorData.message}`);
            }
        } catch (error) {
            console.error("Error saving testimonial:", error);
            alert("Network error. Please try again.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this testimonial?")) {
            await fetch(`/api/testimonials/${id}`, { method: "DELETE" });
            fetchTestimonials();
        }
    };

    const handleEdit = (t) => {
        setCurrentTestimonial(t);
        setIsEditing(true);
        setShowModal(true);
    };

    const handleToggleStatus = async (t) => {
        const newStatus = (t.status === "Active") ? "Inactive" : "Active";
        try {
            await fetch(`/api/testimonials/${t._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            });
            fetchTestimonials();
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    const resetForm = () => {
        setCurrentTestimonial({
            coupleName: "",
            location: "",
            thumbnail: "",
            shortDescription: "",
            fullDescription: "",
            rating: 5,
            displayOrder: 0,
            status: "Active"
        });
        setIsEditing(false);
    };

    const filteredTestimonials = testimonials.filter(t =>
        t.coupleName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.location?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="mt-4 container mx-auto p-4 animate-in fade-in duration-500">
            <PageHeader
                title="Testimonials"
                description="Manage accolades and love stories from couples."
                action={
                    <button
                        onClick={() => { resetForm(); setShowModal(true); }}
                        className="flex items-center gap-2 bg-gray-900 text-white px-6 py-2.5 rounded-lg hover:bg-gray-800 transition-all shadow-lg font-medium"
                    >
                        <Plus size={18} /> Add New Testimonial
                    </button>
                }
            />

            <div className="mb-6 relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                    type="text"
                    placeholder="Search testimonials by name or location..."
                    className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-charcoal-500/20 text-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {loading ? (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    {/* Mobile Card View */}
                    <div className="block md:hidden">
                        <div className="divide-y divide-slate-100">
                            {[1, 2, 3].map((_, index) => (
                                <div key={index} className="p-4 space-y-3">
                                    <div className="flex items-start gap-3">
                                        <div className="w-16 h-16 rounded-lg bg-slate-100 overflow-hidden flex-shrink-0 border border-slate-200">
                                            <Skeleton width="100%" height="100%" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <Skeleton width="70%" height="20px" style={{ marginBottom: "6px" }} />
                                            <Skeleton width="40%" height="14px" style={{ marginBottom: "6px" }} />
                                            <Skeleton width="30%" height="14px" />
                                        </div>
                                    </div>
                                    <Skeleton width="100%" height="40px" borderRadius="8px" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Desktop Table View */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-4">Couple</th>
                                    <th className="px-6 py-4">Testimonial</th>
                                    <th className="px-6 py-4">Rating</th>
                                    <th className="px-6 py-4">Order</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {[1, 2, 3, 4, 5].map((_, index) => (
                                    <tr key={index}>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <Skeleton width="40px" height="40px" borderRadius="50%" />
                                                <div>
                                                    <Skeleton width="120px" height="18px" style={{ marginBottom: "4px" }} />
                                                    <Skeleton width="80px" height="12px" />
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4"><Skeleton width="200px" height="16px" /></td>
                                        <td className="px-6 py-4"><Skeleton width="60px" height="16px" /></td>
                                        <td className="px-6 py-4"><Skeleton width="30px" height="16px" /></td>
                                        <td className="px-6 py-4"><Skeleton width="70px" height="24px" borderRadius="16px" /></td>
                                        <td className="px-6 py-4 text-right"><Skeleton width="60px" height="32px" borderRadius="8px" className="ml-auto" /></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : filteredTestimonials.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-200">
                    <p className="text-slate-500 mb-4">No testimonials found.</p>
                    <button onClick={() => setShowModal(true)} className="text-charcoal-900 font-semibold hover:underline">
                        Create your first testimonial
                    </button>
                </div>
            ) : (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    {/* Mobile Card View */}
                    <div className="block md:hidden">
                        <div className="divide-y divide-slate-100">
                            {filteredTestimonials.map((t) => (
                                <div key={t._id} className="p-4 space-y-3">
                                    <div className="flex items-start gap-3">
                                        <div className="w-16 h-16 rounded-lg bg-slate-100 overflow-hidden flex-shrink-0 border border-slate-200">
                                            <img
                                                src={t.thumbnail || "https://placehold.co/250x250?text=Couple"}
                                                alt={t.coupleName}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start">
                                                <h3 className="font-semibold text-charcoal-900 truncate pr-2">{t.coupleName}</h3>
                                                <button
                                                    onClick={() => handleToggleStatus(t)}
                                                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border ${t.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-slate-100 text-slate-600 border-slate-200'}`}
                                                >
                                                    {t.status}
                                                </button>
                                            </div>
                                            <p className="text-xs text-slate-500">{t.location || "No Location"}</p>
                                            <div className="flex items-center gap-1 mt-1 text-amber-400">
                                                <span className="text-charcoal-900 font-medium text-xs">{t.rating}</span>
                                                <Star size={10} fill="currentColor" />
                                            </div>
                                        </div>
                                    </div>

                                    <p className="text-sm text-slate-600 line-clamp-2 bg-slate-50 p-2 rounded-lg italic">
                                        "{t.shortDescription}"
                                    </p>

                                    <div className="flex items-center justify-between pt-2">
                                        <span className="text-xs text-slate-400">Order: {t.displayOrder}</span>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleEdit(t)}
                                                className="p-2 text-slate-500 hover:text-charcoal-900 hover:bg-slate-100 rounded-lg transition border border-slate-200"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(t._id)}
                                                className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition border border-slate-200"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Desktop Table View */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-4">Couple</th>
                                    <th className="px-6 py-4">Testimonial</th>
                                    <th className="px-6 py-4">Rating</th>
                                    <th className="px-6 py-4">Order</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredTestimonials.map((t) => (
                                    <tr key={t._id} className="hover:bg-slate-50/50 transition">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-slate-100 overflow-hidden flex-shrink-0 border border-slate-200">
                                                    <img
                                                        src={t.thumbnail || "https://placehold.co/250x250?text=Couple"}
                                                        alt={t.coupleName}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-charcoal-900">{t.coupleName}</p>
                                                    <p className="text-xs text-slate-500">{t.location || "No Location"}</p>
                                                    <p className="text-[10px] text-slate-400">{new Date(t.createdAt).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="truncate max-w-xs text-slate-600" title={t.fullDescription}>
                                                {t.shortDescription}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-0.5 text-amber-400">
                                                <span className="text-charcoal-900 font-medium mr-1">{t.rating}</span>
                                                <Star size={12} fill="currentColor" />
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-600">
                                            {t.displayOrder}
                                        </td>
                                        <td className="px-6 py-4">
                                            {t.status === 'Pending' ? (
                                                <button
                                                    onClick={() => handleToggleStatus(t)}
                                                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border bg-amber-50 text-amber-700 border-amber-100 hover:bg-amber-100"
                                                >
                                                    Approve
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => handleToggleStatus(t)}
                                                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${t.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-slate-100 text-slate-600 border-slate-200'}`}
                                                >
                                                    {t.status === 'Active' ? 'Active' : 'Inactive'}
                                                </button>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button onClick={() => handleEdit(t)} className="p-2 text-slate-400 hover:text-charcoal-900 hover:bg-slate-100 rounded-lg transition">
                                                    <Edit2 size={16} />
                                                </button>
                                                <button onClick={() => handleDelete(t._id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {showModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
                    <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
                        <div className="sticky top-0 bg-white px-6 py-4 border-b border-slate-100 flex justify-between items-center z-10">
                            <h2 className="text-xl font-bold text-charcoal-900">
                                {isEditing ? "Edit Testimonial" : "New Testimonial"}
                            </h2>
                            <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-charcoal-900">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                {/* Left Column: Basic Info */}
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Couple Name <span className="text-red-500">*</span></label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-charcoal-500/20"
                                            value={currentTestimonial.coupleName}
                                            onChange={e => setCurrentTestimonial({ ...currentTestimonial, coupleName: e.target.value })}
                                            placeholder="e.g. Rahul & Sneha"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
                                        <input
                                            type="text"
                                            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-charcoal-500/20"
                                            value={currentTestimonial.location}
                                            onChange={e => setCurrentTestimonial({ ...currentTestimonial, location: e.target.value })}
                                            placeholder="e.g. Pune"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Rating</label>
                                            <input
                                                type="number"
                                                min="1"
                                                max="5"
                                                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
                                                value={currentTestimonial.rating}
                                                onChange={e => setCurrentTestimonial({ ...currentTestimonial, rating: Number(e.target.value) })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Display Order</label>
                                            <input
                                                type="number"
                                                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
                                                value={currentTestimonial.displayOrder}
                                                onChange={e => setCurrentTestimonial({ ...currentTestimonial, displayOrder: Number(e.target.value) })}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                                        <select
                                            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
                                            value={currentTestimonial.status}
                                            onChange={e => setCurrentTestimonial({ ...currentTestimonial, status: e.target.value })}
                                        >
                                            <option value="Active">Active</option>
                                            <option value="Inactive">Inactive</option>
                                            <option value="Pending">Pending</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Right Column: Image */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Couple Photo</label>
                                    <div className="border border-slate-200 border-dashed rounded-xl p-4 text-center hover:bg-slate-50 transition cursor-pointer relative h-48 flex flex-col items-center justify-center">
                                        {currentTestimonial.thumbnail ? (
                                            <>
                                                <img
                                                    src={currentTestimonial.thumbnail}
                                                    alt="Preview"
                                                    className="absolute inset-0 w-full h-full object-cover rounded-xl opacity-50"
                                                />
                                                <div className="relative z-10 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-lg text-xs font-semibold">
                                                    Click to Change
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <Plus className="mx-auto text-slate-400 mb-2" />
                                                <span className="text-xs text-slate-500">Upload Thumbnail</span>
                                            </>
                                        )}
                                        <input
                                            type="file"
                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Full Width Inputs */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Short Testimonial <span className="text-slate-400 text-xs">(For preview, max 200 chars)</span></label>
                                <textarea
                                    required
                                    maxLength={200}
                                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm h-20"
                                    value={currentTestimonial.shortDescription}
                                    onChange={e => setCurrentTestimonial({ ...currentTestimonial, shortDescription: e.target.value })}
                                    placeholder="Brief highlight..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Full Testimonial</label>
                                <textarea
                                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm h-32"
                                    value={currentTestimonial.fullDescription}
                                    onChange={e => setCurrentTestimonial({ ...currentTestimonial, fullDescription: e.target.value })}
                                    placeholder="The complete story..."
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-5 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl font-medium transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2.5 bg-charcoal-900 text-white rounded-xl hover:bg-charcoal-800 font-medium transition shadow-sm"
                                >
                                    {isSaving ? "Saving..." : (isEditing ? "Update Testimonial" : "Create Testimonial")}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
