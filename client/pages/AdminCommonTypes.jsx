import React, { useState, useEffect } from "react";
import { Plus, Trash2, Edit2, Check, X, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import PageHeader from "../components/PageHeader";

export default function AdminCommonTypes() {
    const [activeTab, setActiveTab] = useState("event-types");
    const [eventTypes, setEventTypes] = useState([]);
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(false);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

    // Form State
    const [formData, setFormData] = useState({});

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const fetchData = async () => {
        setLoading(true);
        try {
            if (activeTab === "event-types") {
                const res = await fetch("/api/event-types");
                if (res.ok) setEventTypes(await res.json());
            } else {
                const res = await fetch("/api/services");
                if (res.ok) setServices(await res.json());
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
        setLoading(false);
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this item?")) return;

        try {
            const endpoint = activeTab === "event-types" ? `/api/event-types/${id}` : `/api/services/${id}`;
            const res = await fetch(endpoint, { method: "DELETE" });
            if (res.ok) {
                fetchData();
            } else {
                alert("Failed to delete item");
            }
        } catch (error) {
            console.error("Error deleting:", error);
        }
    };

    const handleEdit = (item) => {
        setEditingItem(item);
        setFormData(item);
        setIsModalOpen(true);
    };

    const handleAddNew = () => {
        setEditingItem(null);
        setFormData(activeTab === "event-types" ? { name: "" } : { name: "", ratePerDay: 0, category: "photography" });
        setIsModalOpen(true);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            const endpoint = activeTab === "event-types" ? "/api/event-types" : "/api/services";
            const url = editingItem ? `${endpoint}/${editingItem._id}` : endpoint;
            const method = editingItem ? "PUT" : "POST";

            // Formatting payload for services if needed
            if (activeTab === "services") {
                formData.ratePerDay = parseFloat(formData.ratePerDay) || 0;
                formData.category = formData.category || 'other';
            }

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                setIsModalOpen(false);
                fetchData();
            } else {
                const err = await res.json();
                alert(`Error: ${err.message}`);
            }
        } catch (error) {
            console.error("Error saving:", error);
            alert("Error saving item");
        }
    };


    return (
        <div className="mt-4 container mx-auto p-4 animate-in fade-in duration-500 space-y-6">
            <PageHeader
                title="Common Types Management"
                description="Manage Event Types and Service Categories"
                action={
                    <Button onClick={handleAddNew} className="bg-gray-900 hover:bg-gray-800 text-white gap-2 flex items-center">
                        <Plus className="w-4 h-4" /> Add New {activeTab === "event-types" ? "Event Type" : "Service"}
                    </Button>
                }
            />

            {/* Tabs */}
            <div className="flex border-b border-gray-200 dark:border-gray-700">
                <button
                    className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${activeTab === "event-types"
                        ? "border-gold-500 text-gold-600"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                        }`}
                    onClick={() => setActiveTab("event-types")}
                >
                    Event Types
                </button>
                <button
                    className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${activeTab === "services"
                        ? "border-gold-500 text-gold-600"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                        }`}
                    onClick={() => setActiveTab("services")}
                >
                    Services
                </button>
            </div>

            {/* Content */}
            <div className="bg-white dark:bg-charcoal-800 rounded-lg shadow-sm border border-gold-100 dark:border-charcoal-700 overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-gray-500">Loading...</div>
                ) : (
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50 dark:bg-charcoal-900 text-gray-600 dark:text-gray-400 text-xs uppercase font-semibold">
                            <tr>
                                <th className="px-6 py-4">Name</th>
                                {activeTab === "services" && <th className="px-6 py-4">Rate (₹)</th>}
                                {activeTab === "services" && <th className="px-6 py-4">Category</th>}
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                            {(activeTab === "event-types" ? eventTypes : services).map((item) => (
                                <tr key={item._id} className="hover:bg-gray-50 dark:hover:bg-charcoal-700 transition">
                                    <td className="px-6 py-4 font-medium text-charcoal-900 dark:text-white">
                                        {item.name}
                                    </td>
                                    {activeTab === "services" && (
                                        <td className="px-6 py-4 text-charcoal-600 dark:text-gray-300">
                                            ₹{item.ratePerDay?.toLocaleString()}
                                        </td>
                                    )}
                                    {activeTab === "services" && (
                                        <td className="px-6 py-4 text-charcoal-600 dark:text-gray-300 lowercase">
                                            <span className="px-2 py-1 bg-gray-100 dark:bg-charcoal-600 rounded-full text-xs">
                                                {item.category}
                                            </span>
                                        </td>
                                    )}
                                    <td className="px-6 py-4 text-right space-x-2">
                                        <button
                                            onClick={() => handleEdit(item)}
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded transition"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(item._id)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded transition"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {(activeTab === "event-types" ? eventTypes : services).length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                                        No items found. Click "Add New" to create one.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Modal */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingItem ? "Edit" : "Add New"} {activeTab === "event-types" ? "Event Type" : "Service"}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSave} className="space-y-4 py-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Name</label>
                            <input
                                type="text"
                                value={formData.name || ""}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-3 py-2 border rounded-md dark:bg-charcoal-700 dark:border-gray-600"
                                required
                            />
                        </div>

                        {activeTab === "services" && (
                            <>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Rate Per Day</label>
                                    <input
                                        type="number"
                                        value={formData.ratePerDay || ""}
                                        onChange={(e) => setFormData({ ...formData, ratePerDay: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-md dark:bg-charcoal-700 dark:border-gray-600"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Category</label>
                                    <select
                                        value={formData.category || "photography"}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-md dark:bg-charcoal-700 dark:border-gray-600"
                                    >
                                        <option value="photography">Photography</option>
                                        <option value="video">Video</option>
                                        <option value="drone">Drone</option>
                                        <option value="product">Product</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                            </>
                        )}

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                            <Button type="submit">{editingItem ? "Save Changes" : "Create"}</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
