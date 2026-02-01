import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiRequest } from "../lib/apiFetch";
import { useToast } from "@/components/ui/use-toast"; // Assuming this exists or similar
import { Trash2, Edit, Plus, GripVertical, Image as ImageIcon } from "lucide-react";

export default function AdminTeam() {
    const [showForm, setShowForm] = useState(false);
    const [editingMember, setEditingMember] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        role: "",
        bio: "",
        image: "",
        isVisible: true,
        socialLinks: { instagram: "", facebook: "", website: "" },
        contact: { phone: "", email: "" },
        order: 0
    });

    const queryClient = useQueryClient();
    const { toast } = useToast();

    const { data: members, isLoading } = useQuery({
        queryKey: ["team"],
        queryFn: async () => {
            const res = await apiRequest("/api/team");
            return res.json();
        },
    });

    // Mutations
    const createMutation = useMutation({
        mutationFn: async (data) => {
            const res = await apiRequest("/api/team", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["team"]);
            setShowForm(false);
            resetForm();
            toast({ title: "Success", description: "Team member added." });
        },
    });

    const updateMutation = useMutation({
        mutationFn: async ({ id, data }) => {
            const res = await apiRequest(`/api/team/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["team"]);
            setShowForm(false);
            setEditingMember(null);
            resetForm();
            toast({ title: "Success", description: "Team member updated." });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async (id) => {
            await apiRequest(`/api/team/${id}`, { method: "DELETE" });
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["team"]);
            toast({ title: "Deleted", description: "Team member removed." });
        },
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingMember) {
            updateMutation.mutate({ id: editingMember._id, data: formData });
        } else {
            createMutation.mutate(formData);
        }
    };

    const handleEdit = (member) => {
        setEditingMember(member);
        setFormData(member);
        setShowForm(true);
    };

    const resetForm = () => {
        setFormData({
            name: "",
            role: "",
            bio: "",
            image: "",
            isVisible: true,
            socialLinks: { instagram: "", facebook: "", website: "" },
            contact: { phone: "", email: "" },
            order: 0
        });
        setEditingMember(null);
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({ ...formData, image: reader.result }); // Base64 for simplicity, or upload to server/S3
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold font-playfair text-charcoal-900">Team Management</h1>
                    <p className="text-slate-500">Manage your photographers and team members</p>
                </div>
                <Button onClick={() => { setShowForm(true); resetForm(); }} className="bg-gold-500 hover:bg-gold-600">
                    <Plus className="mr-2 h-4 w-4" /> Add Member
                </Button>
            </div>

            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">{editingMember ? "Edit Team Member" : "Add New Member"}</h2>
                            <Button variant="ghost" size="sm" onClick={() => setShowForm(false)}>✕</Button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Full Name</label>
                                    <Input
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Role / Title</label>
                                    <Input
                                        value={formData.role}
                                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                        placeholder="e.g. Lead Photographer"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Bio</label>
                                <textarea
                                    className="w-full p-2 border rounded-md"
                                    rows="3"
                                    value={formData.bio}
                                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                />
                            </div>

                            {/* Image Upload */}
                            <div>
                                <label className="block text-sm font-medium mb-1">Profile Photo</label>
                                <div className="flex items-center gap-4">
                                    {formData.image && (
                                        <img src={formData.image} alt="Preview" className="w-16 h-16 rounded-full object-cover" />
                                    )}
                                    <Input type="file" accept="image/*" onChange={handleImageUpload} />
                                </div>
                            </div>

                            {/* Social Links */}
                            <div className="space-y-2 border-t pt-2 mt-2">
                                <span className="font-semibold text-sm">Social Links</span>
                                <div className="grid grid-cols-3 gap-2">
                                    <Input
                                        placeholder="Instagram URL"
                                        value={formData.socialLinks?.instagram || ''}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            socialLinks: { ...formData.socialLinks, instagram: e.target.value }
                                        })}
                                    />
                                    <Input
                                        placeholder="Facebook URL"
                                        value={formData.socialLinks?.facebook || ''}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            socialLinks: { ...formData.socialLinks, facebook: e.target.value }
                                        })}
                                    />
                                    <Input
                                        placeholder="Portfolio / Website"
                                        value={formData.socialLinks?.website || ''}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            socialLinks: { ...formData.socialLinks, website: e.target.value }
                                        })}
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-2 mt-4">
                                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
                                <Button type="submit" className="bg-gold-500 hover:bg-gold-600">Save Member</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Team List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoading ? (
                    <p>Loading team...</p>
                ) : members?.length === 0 ? (
                    <div className="col-span-full text-center py-10 bg-slate-50 rounded-lg border border-dashed border-slate-300">
                        <p className="text-slate-500">No team members yet. Add your first photographer!</p>
                    </div>
                ) : (
                    members?.map((member) => (
                        <div key={member._id} className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 flex flex-col gap-4">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-16 h-16 rounded-full bg-slate-100 overflow-hidden shrink-0">
                                        {member.image ? (
                                            <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <ImageIcon className="w-8 h-8 m-auto mt-4 text-slate-400" />
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-charcoal-900">{member.name}</h3>
                                        <p className="text-sm text-gold-600 font-medium">{member.role}</p>
                                    </div>
                                </div>
                            </div>

                            {member.bio && <p className="text-sm text-slate-600 line-clamp-2">{member.bio}</p>}

                            <div className="flex items-center justify-between mt-auto border-t border-slate-100 pt-3">
                                <span className={`text-xs px-2 py-1 rounded-full ${member.isVisible ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                                    {member.isVisible ? 'Visible' : 'Hidden'}
                                </span>
                                <div className="flex gap-2">
                                    <Button size="icon" variant="ghost" className="h-8 w-8 text-blue-600 hover:bg-blue-50" onClick={() => handleEdit(member)}>
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button size="icon" variant="ghost" className="h-8 w-8 text-red-600 hover:bg-red-50" onClick={() => {
                                        if (confirm('Delete this team member?')) deleteMutation.mutate(member._id);
                                    }}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
