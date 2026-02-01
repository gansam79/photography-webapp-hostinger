import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Video, PlayCircle } from "lucide-react";
import PageHeader from "../components/PageHeader";

export default function AdminFilms() {
    const queryClient = useQueryClient();
    const [modalOpen, setModalOpen] = useState(false);
    const [form, setForm] = useState({ id: null, title: "", youtubeUrl: "", category: "Wedding", status: "Active" });
    const [deleteId, setDeleteId] = useState(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const { data: films = [], isLoading } = useQuery({
        queryKey: ["films"],
        queryFn: async () => {
            const res = await fetch("/api/films");
            if (!res.ok) throw new Error("Failed to fetch films");
            return res.json();
        },
    });

    const { data: eventTypes = [] } = useQuery({
        queryKey: ["eventTypes"],
        queryFn: async () => {
            const res = await fetch("/api/event-types");
            if (!res.ok) throw new Error("Failed to fetch event types");
            return res.json();
        },
    });

    const mutation = useMutation({
        mutationFn: async (data) => {
            const url = data.id ? `/api/films/${data.id}` : "/api/films";
            const method = data.id ? "PUT" : "POST";
            const { id, ...body } = data;
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });
            if (!res.ok) throw new Error("Failed to save film");
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["films"] });
            toast.success(form.id ? "Film updated" : "Film created");
            setModalOpen(false);
            setForm({ id: null, title: "", youtubeUrl: "", category: "Wedding", status: "Active" });
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
        },
        onError: (err) => toast.error(err.message),
        onSettled: () => setIsSaving(false),
    });

    const handleSave = () => {
        if (isSaving) return;
        setIsSaving(true);
        mutation.mutate(form);
    };

    const deleteMutation = useMutation({
        mutationFn: async (id) => {
            const res = await fetch(`/api/films/${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Failed to delete film");
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["films"] });
            toast.success("Film deleted");
            setDeleteId(null);
        },
    });

    // Extract YouTube ID helper (same as frontend)
    const getYouTubeId = (url) => {
        if (!url) return null;
        const regExp = /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/ ]{11})/;
        const match = url.match(regExp);
        return match ? match[1] : null;
    };

    return (
        <div className="mt-4 container mx-auto p-4 animate-in fade-in duration-500">
            {/* Header */}
            <PageHeader
                title="Films"
                description="Manage and showcase video content and films"
                action={
                    <button
                        onClick={() => { setForm({ id: null, title: "", youtubeUrl: "", category: "Wedding", status: "Active" }); setModalOpen(true); }}
                        className="flex items-center gap-2 bg-gray-900 text-white px-6 py-2.5 rounded-lg hover:bg-gray-800 transition-all shadow-lg"
                    >
                        <Plus size={18} /> Add Film
                    </button>
                }
            />

            {/* Films Grid */}
            {isLoading ? (
                <div className="text-center py-12 text-gray-500">Loading films...</div>
            ) : films.length === 0 ? (
                <div className="text-center py-12 text-gray-500">No films found. Add your first masterpiece!</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {films.map((item) => {
                        const videoId = getYouTubeId(item.youtubeUrl);
                        const thumbnail = videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : null;

                        return (
                            <div key={item._id} className="group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                                <div className="relative aspect-video bg-gray-100 flex items-center justify-center overflow-hidden">
                                    {thumbnail ? (
                                        <img src={thumbnail} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    ) : (
                                        <Video className="text-gray-400" />
                                    )}
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                        <button
                                            onClick={() => { setForm({ id: item._id, title: item.title, youtubeUrl: item.youtubeUrl, category: item.category, status: item.status }); setModalOpen(true); }}
                                            className="p-2 bg-white text-gray-900 rounded-full hover:scale-110 transition-transform"
                                        >
                                            <Pencil size={16} />
                                        </button>
                                        <button
                                            onClick={() => setDeleteId(item._id)}
                                            className="p-2 bg-white text-red-600 rounded-full hover:scale-110 transition-transform"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                    {thumbnail && (
                                        <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded flex items-center gap-1 group-hover:opacity-0 transition-opacity">
                                            <PlayCircle size={12} /> YouTube
                                        </div>
                                    )}
                                </div>
                                <div className="p-4">
                                    <h3 className="font-semibold text-gray-900 truncate" title={item.title}>{item.title || "Untitled"}</h3>
                                    <div className="flex justify-between items-center mt-2">
                                        <span className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-md border border-gray-100 truncate max-w-[100px]">{item.category}</span>
                                        <span className={`w-2 h-2 rounded-full ${item.status === "Active" ? "bg-green-500" : "bg-gray-300"}`}></span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Modal */}
            {modalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setModalOpen(false)}>
                    <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl animate-in fade-in zoom-in duration-200" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-gray-900">{form.id ? "Edit Film" : "New Film"}</h2>
                            <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-gray-600 p-1">✕</button>
                        </div>

                        <div className="space-y-5">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Title</label>
                                <input
                                    type="text"
                                    value={form.title}
                                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                                    className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-shadow"
                                    placeholder="Film title"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">YouTube URL</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={form.youtubeUrl}
                                        onChange={(e) => setForm({ ...form, youtubeUrl: e.target.value })}
                                        className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-shadow"
                                        placeholder="https://www.youtube.com/watch?v=..."
                                    />
                                </div>
                                {form.youtubeUrl && (
                                    <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                                        <Video size={12} />
                                        Preview: {getYouTubeId(form.youtubeUrl) ? "Valid Link" : "Invalid Link"}
                                    </p>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Category</label>
                                    <select
                                        value={form.category}
                                        onChange={(e) => setForm({ ...form, category: e.target.value })}
                                        className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-shadow bg-white"
                                    >
                                        <option value="Wedding">Wedding</option>
                                        {eventTypes.map((type) => (
                                            <option key={type._id} value={type.name}>
                                                {type.label || type.name}
                                            </option>
                                        ))}
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
                        </div>

                        <div className="mt-8 flex justify-end gap-3 pt-4 border-t border-gray-100">
                            <button onClick={() => setModalOpen(false)} className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">Cancel</button>
                            <button onClick={handleSave} disabled={isSaving} className="px-5 py-2.5 text-sm font-medium bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors shadow-md disabled:bg-gray-400">
                                {isSaving ? "Saving..." : (form.id ? "Update Film" : "Create Film")}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation */}
            {deleteId && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setDeleteId(null)}>
                    <div className="bg-white rounded-xl p-6 w-full max-w-sm text-center shadow-2xl animate-in fade-in zoom-in duration-200" onClick={(e) => e.stopPropagation()}>
                        <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Trash2 size={24} />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Film?</h3>
                        <p className="text-gray-500 mb-6 text-sm">Are you sure you want to delete this film? This action cannot be undone.</p>
                        <div className="flex justify-center gap-3">
                            <button onClick={() => setDeleteId(null)} className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors">Cancel</button>
                            <button onClick={() => deleteMutation.mutate(deleteId)} className="flex-1 px-4 py-2.5 text-sm font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-md">Delete</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Success Popup */}
            {showSuccess && (
                <div className="fixed bottom-10 right-10 z-[100] animate-bounce">
                    <div className="flex items-center gap-3 rounded-xl bg-emerald-500 px-6 py-4 shadow-2xl text-white">
                        <span className="text-2xl">👉</span>
                        <div className="font-bold">Film saved successfully</div>
                    </div>
                </div>
            )}
        </div>
    );
}
