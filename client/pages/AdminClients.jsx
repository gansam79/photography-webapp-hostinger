import React, { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import PageHeader from "../components/PageHeader";

const seedClients = [
  {
    id: "1",
    name: "Rahul & Sneha",
    email: "rahul.sneha@example.com",
    whatsapp: "9876512345",
    event: "Wedding",
    city: "Pune",
    budget: 95000,
    status: "Active",
    createdAt: "2025-10-12",
  },
  {
    id: "2",
    name: "Ishaan Patil",
    email: "ishaan@studio.com",
    whatsapp: "9988776655",
    event: "Pre-Wedding",
    city: "Kolhapur",
    budget: 45000,
    status: "Lead",
    createdAt: "2025-10-05",
  },
  {
    id: "3",
    name: "Aditi & Neel",
    email: "aditi.neel@example.com",
    whatsapp: "9765432100",
    event: "Engagement",
    city: "Mumbai",
    budget: 62000,
    status: "Archived",
    createdAt: "2025-08-21",
  },
];

const emptyClient = {
  id: null,
  name: "",
  email: "",
  whatsapp: "",
  event: "Wedding",
  city: "",
  budget: "",
  status: "Lead",
};

const statusMap = {
  Lead: "bg-amber-100 text-amber-700",
  Active: "bg-emerald-100 text-emerald-700",
  Archived: "bg-slate-200 text-slate-600",
};

export default function AdminClients() {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);

  // Fetch Clients
  const { data: clients = [], isLoading, isError, error } = useQuery({
    queryKey: ["clients"],
    queryFn: async () => {
      console.log("Fetching clients from /api/clients...");
      const res = await fetch("/api/clients");
      console.log("Fetch status:", res.status);
      if (!res.ok) {
        const text = await res.text();
        console.error("Fetch failed:", text);
        throw new Error("Failed to fetch clients");
      }
      const data = await res.json();
      console.log("Raw API Data:", data);

      // Map Backend -> Frontend
      return data.map(c => ({
        ...c,
        id: c._id,
        whatsapp: c.whatsapp || c.phone || "",
        event: c.event || c.eventType || "Wedding",
        budget: c.budget || 0,
        status: c.status || "Lead"
      }));
    },
    enabled: true,
  });
  const [form, setForm] = useState(emptyClient);
  const [deleteId, setDeleteId] = useState(null);

  const stats = useMemo(() => {
    const total = clients.length;
    const active = clients.filter((c) => c.status === "Active").length;
    const leads = clients.filter((c) => c.status === "Lead").length;
    const archived = clients.filter((c) => c.status === "Archived").length;
    const pipeline = clients.reduce((sum, c) => sum + (Number(c.budget) || 0), 0);
    return { total, active, leads, archived, pipeline };
  }, [clients]);

  const openModal = (client = null) => {
    setForm(client || emptyClient);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setForm(emptyClient);
  };

  const mutation = useMutation({
    mutationFn: async (clientData) => {
      const url = clientData.id ? `/api/clients/${clientData.id}` : "/api/clients";
      const method = clientData.id ? "PUT" : "POST";

      const payload = {
        ...clientData,
        phone: clientData.whatsapp, // Map UI 'whatsapp' to API 'phone'
      };

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to save client");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["clients"]);
      toast.success(form.id ? "Client updated" : "Client created");
      closeModal();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const saveClient = () => {
    if (!form.name.trim() || !form.whatsapp.trim()) {
      toast.error("Name and WhatsApp are required");
      return;
    }
    mutation.mutate(form);
  };

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const res = await fetch(`/api/clients/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to delete client");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["clients"]);
      toast.success("Client deleted");
      setDeleteId(null);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const confirmDelete = () => {
    deleteMutation.mutate(deleteId);
  };

  return (
    <section className="mt-4 container mx-auto p-4 animate-in fade-in duration-500">
      <PageHeader
        title="Client Registry"
        description="Track couples, monitor budgets, and assign the next touchpoint."
        action={
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-6 py-2.5 text-sm font-semibold text-white shadow-lg hover:bg-gray-800 transition-all"
            onClick={() => openModal()}
          >
            <Plus size={18} />
            Add Client
          </button>
        }
      />

      <div className="grid gap-4 md:grid-cols-4 mb-4">
        <Stat label="Total" value={stats.total} accent="from-amber-100 to-white" />
        <Stat label="Active" value={stats.active} accent="from-emerald-100 to-white" />
        <Stat label="Leads" value={stats.leads} accent="from-blue-100 to-white" />
        <Stat label="Pipeline" value={`₹${stats.pipeline.toLocaleString()}`} accent="from-rose-50 to-white" />
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
          <h2 className="text-lg font-semibold text-charcoal-900">Client List</h2>
          <p className="text-xs text-slate-500">{stats.archived} archived</p>
        </div>

        {/* Mobile Card View */}
        <div className="block md:hidden">
          {isLoading ? (
            <div className="p-8 text-center text-slate-500">Loading clients...</div>
          ) : isError ? (
            <div className="p-8 text-center text-rose-500">Failed to load clients.</div>
          ) : clients.length === 0 ? (
            <div className="p-8 text-center text-slate-500">No clients yet.</div>
          ) : (
            <div className="divide-y divide-slate-100">
              {clients.map((client) => (
                <div key={client.id} className="p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-charcoal-900">{client.name}</h3>
                      <p className="text-sm text-slate-500">{client.city || "No City"}</p>
                    </div>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusMap[client.status] || "bg-slate-200 text-slate-600"}`}>
                      {client.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-xs text-slate-400 block">Event</span>
                      <span className="text-slate-700">{client.event}</span>
                    </div>
                    <div>
                      <span className="text-xs text-slate-400 block">Budget</span>
                      <span className="text-slate-700">{client.budget ? `₹${Number(client.budget).toLocaleString()}` : "--"}</span>
                    </div>
                  </div>

                  <div className="text-sm text-slate-500 flex flex-col gap-1">
                    {client.whatsapp && <div><span className="font-medium text-xs uppercase text-slate-400">WhatsApp:</span> {client.whatsapp}</div>}
                    {client.email && <div><span className="font-medium text-xs uppercase text-slate-400">Email:</span> {client.email}</div>}
                  </div>

                  <div className="flex justify-end gap-2 pt-2 border-t border-slate-50 mt-2">
                    <button
                      className="rounded-md border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                      onClick={() => openModal(client)}
                    >
                      Edit
                    </button>
                    <button
                      className="rounded-md border border-rose-100 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50"
                      onClick={() => setDeleteId(client.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Name</th>
                <th className="px-4 py-3 text-left font-semibold">WhatsApp</th>
                <th className="px-4 py-3 text-left font-semibold">Email</th>
                <th className="px-4 py-3 text-left font-semibold">Event</th>
                <th className="px-4 py-3 text-left font-semibold">City</th>
                <th className="px-4 py-3 text-left font-semibold">Budget</th>
                <th className="px-4 py-3 text-left font-semibold">Status</th>
                <th className="px-4 py-3 text-left font-semibold">Created</th>
                <th className="px-4 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={9} className="px-4 py-12 text-center text-slate-500">
                    Loading clients...
                  </td>
                </tr>
              ) : isError ? (
                <tr>
                  <td colSpan={9} className="px-4 py-12 text-center text-rose-500">
                    Failed to load clients. Please check your connection or login again.
                  </td>
                </tr>
              ) : clients.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-12 text-center text-slate-500">
                    No clients yet. Start by adding your first booking.
                  </td>
                </tr>
              ) : (
                clients.map((client) => (
                  <tr key={client.id} className="odd:bg-white even:bg-slate-50 hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 font-semibold text-charcoal-900">{client.name}</td>
                    <td className="px-4 py-3 text-slate-600">{client.whatsapp}</td>
                    <td className="px-4 py-3 text-slate-600">{client.email}</td>
                    <td className="px-4 py-3">{client.event}</td>
                    <td className="px-4 py-3">{client.city}</td>
                    <td className="px-4 py-3 font-medium text-charcoal-900">
                      {client.budget ? `₹${Number(client.budget).toLocaleString()}` : "--"}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${statusMap[client.status] || "bg-slate-200 text-slate-600"}`}>
                        {client.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-500">{client.createdAt || "--"}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex gap-2">
                        <button
                          className="rounded-md border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                          onClick={() => openModal(client)}
                        >
                          Edit
                        </button>
                        <button
                          className="rounded-md border border-rose-100 px-3 py-1 text-xs font-semibold text-rose-600 hover:bg-rose-50"
                          onClick={() => setDeleteId(client.id)}
                        >
                          Delete
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
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-4" onClick={closeModal}>
          <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-gold-500">Client</p>
                <h2 className="text-2xl font-semibold text-charcoal-900">
                  {form.id ? "Edit Client" : "Add New Client"}
                </h2>
              </div>
              <button className="text-slate-400 hover:text-slate-600" onClick={closeModal}>
                ✕
              </button>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <Field label="Full Name" required>
                <input
                  value={form.name}
                  onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-gold-500 focus:ring-1 focus:ring-gold-500"
                />
              </Field>
              <Field label="WhatsApp" required>
                <input
                  value={form.whatsapp}
                  maxLength={10}
                  onChange={(e) => setForm((prev) => ({ ...prev, whatsapp: e.target.value.replace(/[^0-9]/g, "") }))}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-gold-500 focus:ring-1 focus:ring-gold-500"
                />
              </Field>
              <Field label="Email">
                <input
                  value={form.email}
                  onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-gold-500 focus:ring-1 focus:ring-gold-500"
                />
              </Field>
              <Field label="Event Type">
                <select
                  value={form.event}
                  onChange={(e) => setForm((prev) => ({ ...prev, event: e.target.value }))}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-gold-500 focus:ring-1 focus:ring-gold-500"
                >
                  <option>Wedding</option>
                  <option>Pre-Wedding</option>
                  <option>Engagement</option>
                  <option>Baby Shower</option>
                </select>
              </Field>
              <Field label="City">
                <input
                  value={form.city}
                  onChange={(e) => setForm((prev) => ({ ...prev, city: e.target.value }))}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-gold-500 focus:ring-1 focus:ring-gold-500"
                />
              </Field>
              <Field label="Budget">
                <input
                  type="number"
                  value={form.budget}
                  onChange={(e) => setForm((prev) => ({ ...prev, budget: e.target.value }))}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-gold-500 focus:ring-1 focus:ring-gold-500"
                />
              </Field>
              <Field label="Status">
                <select
                  value={form.status}
                  onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value }))}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-gold-500 focus:ring-1 focus:ring-gold-500"
                >
                  <option value="Lead">Lead</option>
                  <option value="Active">Active</option>
                  <option value="Archived">Archived</option>
                </select>
              </Field>
            </div>
            <div className="mt-6 flex justify-end gap-3 border-t border-slate-200 pt-4">
              <button className="rounded-md border border-slate-200 px-4 py-2 text-sm" onClick={closeModal}>
                Cancel
              </button>
              <button
                className="rounded-md bg-gold-500 px-4 py-2 text-sm font-semibold text-white flex items-center gap-2"
                onClick={saveClient}
                disabled={mutation.isPending}
              >
                {mutation.isPending ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  form.id ? "Update" : "Save"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-4" onClick={() => setDeleteId(null)}>
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rose-50 text-3xl text-rose-500">
              !
            </div>
            <h3 className="mt-4 text-lg font-semibold text-charcoal-900">Delete this client?</h3>
            <p className="mt-2 text-sm text-slate-500">This action cannot be undone.</p>
            <div className="mt-6 flex justify-center gap-3">
              <button className="rounded-md border border-slate-200 px-4 py-2 text-sm" onClick={() => setDeleteId(null)}>
                Cancel
              </button>
              <button className="rounded-md bg-rose-500 px-4 py-2 text-sm font-semibold text-white" onClick={confirmDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function Stat({ label, value, accent }) {
  return (
    <div className={`rounded-2xl bg-gradient-to-br ${accent} p-4 shadow-inner`}>
      <p className="text-xs uppercase tracking-[0.3em] text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-bold text-charcoal-900">{value}</p>
    </div>
  );
}

function Field({ label, required, children }) {
  return (
    <label className="block text-sm font-medium text-slate-700">
      {label}
      {required && <span className="text-rose-500"> *</span>}
      <div className="mt-1">{children}</div>
    </label>
  );
}
