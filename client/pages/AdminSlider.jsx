import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Image as ImageIcon } from "lucide-react";
import Skeleton from "../components/Skeleton";
import PageHeader from "../components/PageHeader";

export default function AdminSlider() {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ id: null, title: "", subtitle: "", image: "", status: "Active", order: 0 });
  const [deleteId, setDeleteId] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const { data: rawSliders = [], isLoading } = useQuery({
    queryKey: ["slider"],
    queryFn: async () => {
      const res = await fetch("/api/slider");
      if (!res.ok) throw new Error("Failed to fetch sliders");
      return res.json();
    },
  });

  const sliders = React.useMemo(() => {
    return [...rawSliders].sort((a, b) => (a.order || 0) - (b.order || 0));
  }, [rawSliders]);

  const mutation = useMutation({
    mutationFn: async (data) => {
      const url = data.id ? `/api/slider/${data.id}` : "/api/slider";
      const method = data.id ? "PUT" : "POST";
      const { id, ...body } = data;
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("Failed to save slider");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["slider"] });
      toast.success(form.id ? "Slider updated" : "Slider created");
      setModalOpen(false);
      setForm({ id: null, title: "", subtitle: "", image: "", status: "Active", order: 0 });
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    },
    onError: (err) => toast.error(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const res = await fetch(`/api/slider/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete slider");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["slider"] });
      toast.success("Slider deleted");
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
        title="Slider Management"
        description="Manage homepage slider content and order"
        action={
          <button
            onClick={() => { setForm({ id: null, title: "", subtitle: "", image: "", status: "Active", order: 0 }); setModalOpen(true); }}
            className="flex items-center gap-2 bg-gray-900 text-white px-6 py-2.5 rounded-lg hover:bg-gray-800 transition-all shadow-lg"
          >
            <Plus size={18} /> Add Slide
          </button>
        }
      />

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Mobile Card View */}
        <div className="block md:hidden">
          {isLoading ? (
            <div className="divide-y divide-gray-100">
              {[1, 2, 3].map((_, index) => (
                <div key={index} className="p-4 space-y-3">
                  <div className="rounded-lg overflow-hidden bg-gray-100 border border-gray-200 shadow-sm">
                    <Skeleton width="100%" height="160px" />
                  </div>
                  <div>
                    <Skeleton width="70%" height="20px" style={{ marginBottom: "5px" }} />
                    <Skeleton width="30%" height="16px" />
                  </div>
                </div>
              ))}
            </div>
          ) : sliders.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No slides found. Create one!</div>
          ) : (
            <div className="divide-y divide-gray-100">
              {sliders.map((slider) => (
                <div key={slider._id} className="p-4 space-y-3">
                  <div className="relative h-40 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 shadow-sm group">
                    {slider.image ? (
                      <img src={slider.image} alt={slider.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon className="text-gray-400" size={32} />
                      </div>
                    )}
                    <span className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-xs font-medium shadow-sm ${slider.status === "Active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                      {slider.status}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg leading-tight">{slider.title}</h3>
                    <p className="text-sm text-gray-500 mt-0.5">Order: {slider.order}</p>
                  </div>

                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      onClick={() => { setForm({ id: slider._id, title: slider.title, subtitle: slider.subtitle || "", image: slider.image, status: slider.status, order: slider.order }); setModalOpen(true); }}
                      className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-gray-200"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => setDeleteId(slider._id)}
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
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 text-gray-600 text-xs font-bold uppercase tracking-wider">
              <tr>
                <th className="p-4 border-b">Image</th>
                <th className="p-4 border-b">Title</th>
                <th className="p-4 border-b">Order</th>
                <th className="p-4 border-b">Status</th>
                <th className="p-4 border-b text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                [1, 2, 3, 4, 5].map((_, index) => (
                  <tr key={index}>
                    <td className="p-4">
                      <Skeleton width="128px" height="80px" borderRadius="8px" />
                    </td>
                    <td className="p-4"><Skeleton width="200px" height="24px" /></td>
                    <td className="p-4"><Skeleton width="40px" height="24px" /></td>
                    <td className="p-4"><Skeleton width="60px" height="24px" borderRadius="15px" /></td>
                    <td className="p-4 text-right">
                      <div className="inline-flex gap-2">
                        <Skeleton width="36px" height="36px" borderRadius="8px" />
                        <Skeleton width="36px" height="36px" borderRadius="8px" />
                      </div>
                    </td>
                  </tr>
                ))
              ) : sliders.length === 0 ? (
                <tr><td colSpan={5} className="p-8 text-center text-gray-500">No slides found. Create one!</td></tr>
              ) : (
                sliders.map((slider) => (
                  <tr key={slider._id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <div className="w-32 h-20 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center border border-gray-200 shadow-sm group">
                        {slider.image ? (
                          <img src={slider.image} alt={slider.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                        ) : (
                          <ImageIcon className="text-gray-400" />
                        )}
                      </div>
                    </td>
                    <td className="p-4 font-semibold text-gray-900">{slider.title}</td>
                    <td className="p-4 text-gray-600">{slider.order}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${slider.status === "Active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                        {slider.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="inline-flex gap-2">
                        <button
                          onClick={() => { setForm({ id: slider._id, title: slider.title, subtitle: slider.subtitle || "", image: slider.image, status: slider.status, order: slider.order }); setModalOpen(true); }}
                          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          onClick={() => setDeleteId(slider._id)}
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

      {modalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setModalOpen(false)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto custom-scrollbar" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">{form.id ? "Edit Slide" : "New Slide"}</h2>
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
                  placeholder="Enter slide title"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Subtitle</label>
                <input
                  type="text"
                  value={form.subtitle}
                  onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-shadow"
                  placeholder="Enter slide subtitle"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Order</label>
                  <select
                    value={form.order}
                    onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
                    className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-shadow bg-white"
                  >
                    {[...Array(20)].map((_, i) => (
                      <option key={i} value={i + 1}>{i + 1}</option>
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
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-5 py-2.5 text-sm font-medium bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors shadow-md flex items-center gap-2"
              >
                {isSaving ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  editingId ? "Update Slide" : "Add Slide"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {
        deleteId && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setDeleteId(null)}>
            <div className="bg-white rounded-xl p-6 w-full max-w-sm text-center shadow-2xl animate-in fade-in zoom-in duration-200" onClick={(e) => e.stopPropagation()}>
              <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 size={24} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Slide?</h3>
              <p className="text-gray-500 mb-6 text-sm">Are you sure you want to delete this slide? This action cannot be undone.</p>
              <div className="flex justify-center gap-3">
                <button onClick={() => setDeleteId(null)} className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors">Cancel</button>
                <button onClick={() => deleteMutation.mutate(deleteId)} className="flex-1 px-4 py-2.5 text-sm font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-md">Delete</button>
              </div>
            </div>
          </div>
        )
      }

      {/* Success Popup */}
      {showSuccess && (
        <div className="fixed bottom-10 right-10 z-[100] animate-bounce">
          <div className="flex items-center gap-3 rounded-xl bg-emerald-500 px-6 py-4 shadow-2xl text-white">
            <span className="text-2xl">👉</span>
            <div className="font-bold">Slider saved successfully</div>
          </div>
        </div>
      )}
    </div>
  );
}
