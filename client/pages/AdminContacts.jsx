import React, { useEffect, useState } from "react";
import { Trash2, MessageSquare, Mail, AlertCircle, Plus } from "lucide-react";
import PageHeader from "../components/PageHeader";

export default function AdminContacts() {
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        try {
            const res = await fetch("/api/contact");
            const data = await res.json();
            setMessages(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error fetching messages:", error);
        }
    };

    const updateStatus = async (id, status) => {
        try {
            const res = await fetch(`/api/contact/${id}/status`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status }),
            });
            if (res.ok) {
                fetchMessages();
            }
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    const handleDelete = async (id) => {
        if (confirm("Are you sure you want to delete this message?")) {
            await fetch(`/api/contact/${id}`, { method: "DELETE" });
            fetchMessages();
        }
    };

    return (
        <div className="mt-4 container mx-auto p-4 animate-in fade-in duration-500">
            <PageHeader
                title="Contact Messages"
                description="Manage website contact form messages"
            />

            <div className="grid gap-6">
                {messages.length === 0 ? (
                    <p className="text-gray-500 text-center py-10">No messages found yet.</p>
                ) : (
                    messages.map((msg) => (
                        <div key={msg._id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">{msg.subject}</h3>
                                    <div className="flex items-center gap-2 text-gray-500 text-sm mt-1">
                                        <span className="font-medium text-gray-700">{msg.name}</span>
                                        <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                                        <span className="flex items-center gap-1"><Mail size={12} /> {msg.email}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <select
                                        value={msg.status}
                                        onChange={(e) => updateStatus(msg._id, e.target.value)}
                                        className={`px-3 py-1 rounded-full text-xs font-semibold border-none outline-none cursor-pointer
                            ${msg.status === 'New' ? 'bg-blue-100 text-blue-700' : ''}
                            ${msg.status === 'Read' ? 'bg-gray-100 text-gray-700' : ''}
                            ${msg.status === 'Replied' ? 'bg-green-100 text-green-700' : ''}
                        `}
                                    >
                                        <option value="New">New</option>
                                        <option value="Read">Read</option>
                                        <option value="Replied">Replied</option>
                                    </select>
                                    <button
                                        onClick={() => handleDelete(msg._id)}
                                        className="text-gray-400 hover:text-red-500 transition"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-sm text-gray-700 whitespace-pre-wrap">{msg.message}</p>
                            </div>

                            <div className="mt-3 text-xs text-gray-400 text-right">
                                Received: {new Date(msg.createdAt).toLocaleString()}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
