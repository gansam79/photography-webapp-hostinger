import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Upload, Trash2, Eye, EyeOff } from "lucide-react";
import PageHeader from "../components/PageHeader";

export default function AdminPopup() {
    const queryClient = useQueryClient();
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        image: "",
        isActive: false,
    });

    const { data: popup, isLoading } = useQuery({
        queryKey: ["popup"],
        queryFn: async () => {
            const res = await fetch("/api/popup");
            if (!res.ok) throw new Error("Failed to fetch popup settings");
            return res.json();
        },
    });

    useEffect(() => {
        if (popup) {
            setFormData({
                title: popup.title || "",
                description: popup.description || "",
                image: popup.image || "",
                isActive: popup.isActive || false,
            });
        }
    }, [popup]);

    const mutation = useMutation({
        mutationFn: async (data) => {
            const res = await fetch("/api/popup", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error("Failed to update popup");
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["popup"] });
            toast.success("Popup updated successfully");
        },
        onError: (err) => toast.error(err.message),
    });

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setFormData({ ...formData, image: reader.result });
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        mutation.mutate(formData);
    };

    return (
        <div className="mt-4 container mx-auto p-4 animate-in fade-in duration-500">
            <PageHeader
                title="Popup Manager"
                description="Manage the global site popup (Tribute, Announcement, etc.)"
                action={
                    <div className="bg-white rounded-lg border border-slate-200 px-3 py-1 flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${formData.isActive ? "bg-green-500" : "bg-slate-300"}`}></span>
                        <span className="text-sm font-medium text-slate-600">{formData.isActive ? "Live" : "Inactive"}</span>
                    </div>
                }
            />

            <div className="max-w-4xl mx-auto mt-8">
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">

                    {/* Left Column: Form */}
                    <div className="space-y-6 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Title</label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm focus:border-gold-500 focus:outline-none focus:ring-1 focus:ring-gold-500"
                                placeholder="Enter popup title..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Description / Message</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm focus:border-gold-500 focus:outline-none focus:ring-1 focus:ring-gold-500 min-h-[120px]"
                                placeholder="Enter message text..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Visibility</label>
                            <div className="flex items-center gap-4">
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${formData.isActive
                                        ? "bg-green-50 border-green-200 text-green-700 font-medium"
                                        : "bg-slate-50 border-slate-200 text-slate-600"
                                        }`}
                                >
                                    {formData.isActive ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                                    {formData.isActive ? "Visible on Website" : "Hidden"}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={mutation.isPending}
                            className="w-full bg-gold-500 text-white rounded-lg py-3 font-semibold hover:bg-gold-600 transition-colors disabled:opacity-50"
                        >
                            {mutation.isPending ? "Saving..." : "Save Changes"}
                        </button>
                    </div>

                    {/* Right Column: Image & Preview */}
                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                            <label className="block text-sm font-semibold text-slate-700 mb-4">Popup Image (Optional)</label>

                            {formData.image ? (
                                <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
                                    <img
                                        src={formData.image}
                                        alt="Popup"
                                        className="w-full h-auto object-cover max-h-[300px]"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, image: "" })}
                                        className="absolute top-2 right-2 p-2 bg-white/90 text-red-500 rounded-full shadow-sm hover:bg-red-50"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            ) : (
                                <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <Upload className="w-8 h-8 text-slate-400 mb-2" />
                                        <p className="text-sm text-slate-500">Click to upload image</p>
                                    </div>
                                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                                </label>
                            )}
                        </div>

                        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-sm text-blue-800">
                            <p className="font-semibold mb-1">Preview Logic:</p>
                            <ul className="list-disc list-inside space-y-1 opacity-80">
                                <li>If only Image is set: Shows just the image.</li>
                                <li>If only Text is set: Shows just the text.</li>
                                <li>If both are set: Shows standard layout with image top + text below.</li>
                            </ul>
                        </div>
                    </div>

                </form>
            </div>
        </div>
    );
}
