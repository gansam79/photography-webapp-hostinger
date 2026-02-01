import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Image as ImageIcon, Filter } from "lucide-react";
import Skeleton from "../components/Skeleton";
import PageHeader from "../components/PageHeader";

export default function AdminGallery() {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ id: null, title: "", image: "", category: "General", status: "Active" });
  const [deleteId, setDeleteId] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const { data: galleryItems = [], isLoading } = useQuery({
    queryKey: ["gallery"],
    queryFn: async () => {
      const res = await fetch("/api/gallery");
      if (!res.ok) throw new Error("Failed to fetch gallery");
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
      const url = data.id ? `/api/gallery/${data.id}` : "/api/gallery";
      const method = data.id ? "PUT" : "POST";
      const { id, ...body } = data;
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("Failed to save gallery item");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gallery"] });
      toast.success(form.id ? "Item updated" : "Item created");
      setModalOpen(false);
      setForm({ id: null, title: "", image: "", category: "General", status: "Active" });
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    },
    onError: (err) => toast.error(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const res = await fetch(`/api/gallery/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete item");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gallery"] });
      toast.success("Item deleted");
      setDeleteId(null);
    },
  });

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setForm({ ...form, image: reader.result });
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="mt-4 container mx-auto p-4 animate-in fade-in duration-500">
      <PageHeader
        title="Gallery"
        description="Manage your gallery and portfolio images."
        action={
          <button
            onClick={() => { setForm({ id: null, title: "", image: "", category: "General", status: "Active" }); setModalOpen(true); }}
            className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-6 py-2.5 text-sm font-semibold text-white shadow-lg hover:bg-gray-800 transition-all"
          >
            <Plus size={18} /> Add Item
          </button>
        }
      />

      {/* Gallery Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((_, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="relative aspect-square bg-gray-100">
                <Skeleton width="100%" height="100%" />
              </div>
              <div className="p-4">
                <Skeleton width="70%" height="24px" style={{ marginBottom: "8px" }} />
                <div className="flex justify-between items-center mt-2">
                  <Skeleton width="60px" height="20px" borderRadius="6px" />
                  <Skeleton width="12px" height="12px" borderRadius="50%" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : galleryItems.length === 0 ? (
        <div className="text-center py-12 text-gray-500">No images in gallery. Add your first masterpiece!</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {galleryItems.map((item) => (
            <div key={item._id} className="group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
              <div className="relative aspect-square bg-gray-100 flex items-center justify-center overflow-hidden">
                {item.image ? (
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <ImageIcon className="text-gray-400" />
                )}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <button
                    onClick={() => { setForm({ id: item._id, title: item.title, image: item.image, category: item.category, status: item.status }); setModalOpen(true); }}
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
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 truncate">{item.title || "Untitled"}</h3>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-md border border-gray-100">{item.category}</span>
                  <span className={`w-2 h-2 rounded-full ${item.status === "Active" ? "bg-green-500" : "bg-gray-300"}`}></span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setModalOpen(false)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto custom-scrollbar" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">{form.id ? "Edit Item" : "New Item"}</h2>
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
                  placeholder="Image title"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-shadow bg-white"
                  >
                    <option value="General">General</option>
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

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Image</label>

                {/* Image URL Input */}
                <div className="mb-3">
                  <input
                    type="text"
                    value={form.image && !form.image.startsWith("data:") ? form.image : ""}
                    onChange={(e) => setForm({ ...form, image: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-shadow"
                    placeholder="Paste Image URL..."
                  />
                  <p className="text-xs text-gray-500 mt-1">Or upload from your device below</p>
                </div>

                <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center hover:bg-gray-50 transition-colors cursor-pointer relative bg-gray-50/50">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    disabled={!!form.image}
                  />
                  {form.image ? (
                    <div className="relative z-20">
                      <img src={form.image} alt="Preview" className="w-full h-48 object-cover rounded-lg shadow-sm" />
                      <button
                        type="button"
                        onClick={(e) => { e.preventDefault(); setForm({ ...form, image: "" }); }}
                        className="absolute top-2 right-2 bg-white text-red-500 p-1.5 rounded-full shadow-md hover:bg-red-50 transition-colors"
                        title="Remove Image"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ) : (
                    <div className="py-8 text-gray-400 flex flex-col items-center gap-2">
                      <ImageIcon size={32} />
                      <span className="text-sm">Click to upload image</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end gap-3 pt-4 border-t border-gray-100">
              <button onClick={() => setModalOpen(false)} className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">Cancel</button>
              <button onClick={() => mutation.mutate(form)} disabled={mutation.isPending} className="px-5 py-2.5 text-sm font-medium bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors shadow-md flex items-center gap-2">
                {mutation.isPending ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  form.id ? "Update Item" : "Create Item"
                )}
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
            <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Item?</h3>
            <p className="text-gray-500 mb-6 text-sm">Are you sure you want to delete this item? This action cannot be undone.</p>
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
            <div className="font-bold">Gallery saved successfully</div>
          </div>
        </div>
      )}
    </div>
  );
}
