import React, { useEffect, useState } from "react";
import { Trash2, Phone, MapPin, Calendar, CheckSquare, Eye, X, ChevronDown, Plus } from "lucide-react";
import PageHeader from "../components/PageHeader";

export default function AdminEnquiries() {
    const [enquiries, setEnquiries] = useState([]);
    const [viewDetails, setViewDetails] = useState(null);

    useEffect(() => {
        fetchEnquiries();
    }, []);

    const fetchEnquiries = async () => {
        try {
            const res = await fetch("/api/enquiries");
            const data = await res.json();
            setEnquiries(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error fetching enquiries:", error);
        }
    };

    const updateStatus = async (id, status) => {
        try {
            const res = await fetch(`/api/enquiries/${id}/status`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status }),
            });
            if (res.ok) {
                // Update local state to reflect change immediately without refetching
                setEnquiries(prev => prev.map(e => e._id === id ? { ...e, status } : e));
            }
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    const handleDelete = async (id) => {
        if (confirm("Are you sure you want to delete this enquiry?")) {
            await fetch(`/api/enquiries/${id}`, { method: "DELETE" });
            fetchEnquiries();
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'New': return 'bg-blue-50 text-blue-700 border-blue-200';
            case 'Contacted': return 'bg-amber-50 text-amber-700 border-amber-200';
            case 'Booked': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
            case 'Closed': return 'bg-slate-50 text-slate-600 border-slate-200';
            default: return 'bg-gray-50 text-gray-600 border-gray-200';
        }
    };

    return (
         <>
        <div className="mt-4 container mx-auto p-4 animate-in fade-in duration-500">
            <PageHeader
                title="Book Us Enquiries"
                description="Manage enquiry requests and track customer interest"
            />
                {enquiries.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-200">
                        <p className="text-slate-500">No enquiries found yet.</p>
                    </div>
                ) : (
                    enquiries.map((enquiry) => (
                        <div key={enquiry._id} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
                            <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
                                <div>
                                    <div className="flex items-center gap-3">
                                        <h3 className="text-xl font-bold text-charcoal-900">
                                            {enquiry.groomName} <span className="text-gold-500">&</span> {enquiry.brideName}
                                        </h3>
                                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStatusColor(enquiry.status)} md:hidden`}>
                                            {enquiry.status}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-slate-500 text-sm mt-1">
                                        <Phone size={14} /> <span>{enquiry.phoneNumber}</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 w-full md:w-auto">
                                    <div className="relative group w-full md:w-48">
                                        <select
                                            value={enquiry.status}
                                            onChange={(e) => updateStatus(enquiry._id, e.target.value)}
                                            className={`w-full appearance-none pl-4 pr-10 py-2 rounded-xl text-sm font-semibold border border-transparent cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gold-500/20 transition-all ${getStatusColor(enquiry.status)}`}
                                        >
                                            <option value="New">New Enquiry</option>
                                            <option value="Contacted">Contacted</option>
                                            <option value="Booked">Booked</option>
                                            <option value="Closed">Closed</option>
                                        </select>
                                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-50" size={16} />
                                    </div>
                                    <button
                                        onClick={() => handleDelete(enquiry._id)}
                                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                                        title="Delete Enquiry"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-600 mb-6 bg-slate-50 p-4 rounded-xl border border-slate-100">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-gold-500 shadow-sm">
                                        <Calendar size={16} />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xs text-slate-400 uppercase font-semibold tracking-wider">Event Dates</span>
                                        <span className="font-medium">
                                            {new Date(enquiry.eventStartDate).toLocaleDateString()} - {new Date(enquiry.eventEndDate).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-gold-500 shadow-sm">
                                        <MapPin size={16} />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xs text-slate-400 uppercase font-semibold tracking-wider">Location</span>
                                        <span className="font-medium">{enquiry.location}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-6">
                                <p className="text-sm text-slate-600 italic line-clamp-2">
                                    "{enquiry.message || "No message provided."}"
                                </p>
                                {enquiry.message && enquiry.message.length > 100 && (
                                    <button
                                        onClick={() => setViewDetails(enquiry)}
                                        className="text-xs font-semibold text-gold-600 hover:text-gold-700 mt-2 hover:underline flex items-center gap-1"
                                    >
                                        View Full Details
                                    </button>
                                )}
                                {!enquiry.message && (
                                    <button
                                        onClick={() => setViewDetails(enquiry)}
                                        className="text-xs font-semibold text-gold-600 hover:text-gold-700 mt-2 hover:underline flex items-center gap-1"
                                    >
                                        View All Details
                                    </button>
                                )}
                            </div>

                            {/* Tags Section */}
                            <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-slate-100">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-semibold text-slate-400 uppercase">Budget</span>
                                    <span className="text-sm font-bold text-charcoal-900 bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-md border border-emerald-100">
                                        ₹{enquiry.budget ? enquiry.budget.toLocaleString() : "N/A"}
                                    </span>
                                </div>
                                <div className="flex-1"></div>
                                <button
                                    onClick={() => setViewDetails(enquiry)}
                                    className="text-sm font-medium text-charcoal-600 hover:text-charcoal-900 flex items-center gap-2 px-4 py-2 hover:bg-slate-50 rounded-lg transition"
                                >
                                    <Eye size={16} /> View Details
                                </button>
                            </div>

                        </div>
                    ))
                )}
            </div>

            {/* View Details Modal */}
            {viewDetails && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm" onClick={() => setViewDetails(null)}>
                    <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar shadow-2xl" onClick={(e) => e.stopPropagation()}>
                        <div className="sticky top-0 bg-white px-6 py-4 border-b border-slate-100 flex justify-between items-center z-10">
                            <div>
                                <h2 className="text-xl font-bold text-charcoal-900">Enquiry Details</h2>
                                <p className="text-sm text-slate-500">From {viewDetails.groomName} & {viewDetails.brideName}</p>
                            </div>
                            <button
                                onClick={() => setViewDetails(null)}
                                className="p-2 text-slate-400 hover:text-charcoal-900 hover:bg-slate-100 rounded-lg transition"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Status Banner */}
                            <div className={`p-4 rounded-xl border flex justify-between items-center ${getStatusColor(viewDetails.status)}`}>
                                <div>
                                    <span className="text-xs uppercase font-semibold opacity-70">Current Status</span>
                                    <p className="font-bold text-lg">{viewDetails.status}</p>
                                </div>
                                <div className="text-right">
                                    <span className="text-xs uppercase font-semibold opacity-70">Enquiry Date</span>
                                    <p className="font-semibold text-sm">
                                        {viewDetails.createdAt ? new Date(viewDetails.createdAt).toLocaleDateString() : new Date().toLocaleDateString()}
                                    </p>
                                </div>
                            </div>

                            {/* Contact Info */}
                            <div>
                                <h3 className="text-sm uppercase tracking-wider text-gold-500 font-semibold mb-3">Contact Information</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                                        <span className="block text-xs text-slate-500 mb-1">Mobile Number</span>
                                        <span className="block font-medium text-charcoal-900">{viewDetails.phoneNumber}</span>
                                    </div>
                                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                                        <span className="block text-xs text-slate-500 mb-1">Estimated Budget</span>
                                        <span className="block font-medium text-charcoal-900">₹{viewDetails.budget ? viewDetails.budget.toLocaleString() : "N/A"}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Event Details */}
                            <div>
                                <h3 className="text-sm uppercase tracking-wider text-gold-500 font-semibold mb-3">Event Details</h3>
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-3">
                                    <div className="flex gap-3">
                                        <Calendar className="text-slate-400 shrink-0 mt-0.5" size={18} />
                                        <div>
                                            <span className="block text-sm font-semibold text-charcoal-900">Date Range</span>
                                            <span className="text-sm text-slate-600">
                                                {new Date(viewDetails.eventStartDate).toLocaleDateString()} - {new Date(viewDetails.eventEndDate).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <MapPin className="text-slate-400 shrink-0 mt-0.5" size={18} />
                                        <div>
                                            <span className="block text-sm font-semibold text-charcoal-900">Location</span>
                                            <span className="text-sm text-slate-600">{viewDetails.location}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Selection */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="text-sm uppercase tracking-wider text-gold-500 font-semibold mb-3">Events Selected</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {viewDetails.events.map(e => (
                                            <span key={e} className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-sm font-medium text-charcoal-600 shadow-sm">
                                                {e}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-sm uppercase tracking-wider text-gold-500 font-semibold mb-3">Services Needed</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {viewDetails.services.map(s => (
                                            <span key={s} className="px-3 py-1.5 rounded-lg bg-gold-50 border border-gold-100 text-sm font-medium text-gold-700 shadow-sm">
                                                {s}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Message */}
                            <div>
                                <h3 className="text-sm uppercase tracking-wider text-gold-500 font-semibold mb-3">Personal Message</h3>
                                <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 text-charcoal-800 leading-relaxed text-sm">
                                    "{viewDetails.message || "No message provided."}"
                                </div>
                            </div>

                        </div>

                        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 rounded-b-2xl flex justify-end">
                            <button
                                onClick={() => setViewDetails(null)}
                                className="px-5 py-2.5 bg-charcoal-900 text-white rounded-xl hover:bg-charcoal-800 font-medium transition shadow-sm"
                            >
                                Close Details
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
