import React, { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus, FileText, Download, Eye, FileCheck } from "lucide-react";
import PageHeader from "../components/PageHeader";
import { generateInvoicePDF } from "../utils/pdfGenerator";
import { useSettings } from "../hooks/useSettings";

const seedInvoices = [
  // ... (keep seed data if needed, but we rely on API)
];

const emptyInvoice = {
  id: null,
  invoiceNo: "",
  client: "",
  event: "Wedding",
  issueDate: "",
  dueDate: "",
  amount: "",
  paid: "0",
  status: "Draft",
  stage: "Planning",
  paymentMethod: "UPI",
  notes: "",
  services: [] // Added services array
};

const statusStyles = {
  Draft: "bg-slate-100 text-slate-600 border-slate-200",
  Sent: "bg-blue-50 text-blue-700 border-blue-200",
  Partial: "bg-amber-50 text-amber-700 border-amber-200",
  Paid: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Overdue: "bg-rose-50 text-rose-700 border-rose-200",
};

const filterOptions = ["all", "Draft", "Sent", "Partial", "Paid", "Overdue"];

export default function AdminInvoices() {
  const queryClient = useQueryClient();
  const { data: settings } = useSettings(); // Get Settings

  const { data: invoices = [], isLoading } = useQuery({
    queryKey: ["invoices"],
    queryFn: async () => {
      const res = await fetch("/api/invoices");
      if (!res.ok) throw new Error("Failed to fetch invoices");
      const data = await res.json();

      // Map Backend to Frontend
      return data.map(inv => ({
        ...inv,
        id: inv._id,
        invoiceNo: inv.invoiceNumber,
        client: inv.clientName || inv.clientId?.name || "Unknown",
        clientData: inv.clientId, // Store full client object
        event: inv.eventType,
        issueDate: inv.invoiceDate,
        dueDate: inv.dueDate,
        amount: inv.grandTotal,
        paid: inv.amountPaid,
        status: inv.paymentStatus,
        stage: inv.workflowStage,
        paymentMethod: inv.paymentMethod,
        services: inv.services || [] // Ensure services exist
      }));
    },
    enabled: true,
  });

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyInvoice);
  const [editingId, setEditingId] = useState(null);

  const handleGeneratePDF = (e, invoice) => {
    e.stopPropagation();
    // Construct client object if missing or incomplete
    const clientObj = invoice.clientData || {
      name: invoice.client,
      email: "clients@example.com", // Fallback
      phone: "",
      address: ""
    };

    // Construct invoice object for PDF generator
    // We need to ensure logic for empty services to avoid empty table
    const safeServices = (invoice.services && invoice.services.length > 0)
      ? invoice.services
      : [{
        serviceName: "Consolidated Services",
        quantity: 1,
        days: 1,
        ratePerDay: invoice.amount,
        total: invoice.amount
      }];

    const pdfInvoice = {
      ...invoice,
      invoiceNumber: invoice.invoiceNo,
      invoiceDate: invoice.issueDate,
      services: safeServices,
      subtotal: invoice.amount,
      tax: 0, // Fallback as basic form doesn't track tax separately
      taxPercentage: 0,
      grandTotal: invoice.amount,
      discount: 0,
      bankDetails: settings?.bankDetails || {} // Use global settings bank details
    };

    generateInvoicePDF(pdfInvoice, clientObj, settings || {});
  };

  const stats = useMemo(() => {
    const total = invoices.reduce((sum, inv) => sum + Number(inv.amount || 0), 0);
    const collected = invoices.reduce((sum, inv) => sum + Number(inv.paid || 0), 0);
    const outstanding = invoices.reduce(
      (sum, inv) => sum + Math.max(Number(inv.amount || 0) - Number(inv.paid || 0), 0),
      0
    );
    const overdue = invoices.filter((inv) => isOverdue(inv)).length;
    return {
      total,
      collected,
      outstanding,
      overdue,
    };
  }, [invoices]);

  const filteredInvoices = useMemo(() => {
    return invoices.filter((inv) => {
      const matchesSearch = [inv.invoiceNo, inv.client, inv.event]
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesFilter =
        statusFilter === "all" ? true : inv.status === statusFilter || (statusFilter === "Overdue" && isOverdue(inv));
      return matchesSearch && matchesFilter;
    });
  }, [invoices, search, statusFilter]);

  const upcomingDue = useMemo(() => {
    return [...invoices]
      .filter((inv) => inv.status !== "Paid")
      .sort((a, b) => new Date(a.dueDate || Date.now()) - new Date(b.dueDate || Date.now()))
      .slice(0, 4);
  }, [invoices]);

  const paymentMix = useMemo(() => {
    const totals = invoices.reduce((acc, inv) => {
      const method = inv.paymentMethod || "Other";
      acc[method] = (acc[method] || 0) + Number(inv.paid || 0);
      return acc;
    }, {});
    const sum = Object.values(totals).reduce((a, b) => a + b, 0) || 1;
    return Object.entries(totals).map(([method, value]) => ({
      method,
      value,
      percent: Math.round((value / sum) * 100),
    }));
  }, [invoices]);

  function openModal(invoice = null) {
    if (invoice) {
      setForm({ ...invoice });
      setEditingId(invoice.id);
    } else {
      setForm({ ...emptyInvoice });
      setEditingId(null);
    }
    setModalOpen(true);
  }

  const mutation = useMutation({
    mutationFn: async (invoiceData) => {
      const url = editingId ? `/api/invoices/${editingId}` : "/api/invoices";
      const method = editingId ? "PUT" : "POST";

      const payload = {
        ...invoiceData,
        eventType: invoiceData.event, // Map event -> eventType
        invoiceDate: invoiceData.issueDate,
        grandTotal: Number(invoiceData.amount) || 0,
        amountPaid: Number(invoiceData.paid) || 0,
        paymentStatus: invoiceData.status,
        workflowStage: invoiceData.stage,
        clientName: invoiceData.client,
        eventDate: invoiceData.issueDate // Fallback for required field
      };

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to save invoice");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["invoices"]);
      toast.success(editingId ? "Invoice updated" : "Invoice created");
      setModalOpen(false);
    },
    onError: (err) => toast.error(err.message)
  });

  function saveInvoice() {
    if (!form.client.trim() || !form.invoiceNo.trim() || !form.amount) {
      toast.error("Client, Invoice No, and Amount are required");
      return;
    }
    mutation.mutate(form);
  }

  const statusMutation = useMutation({
    mutationFn: async ({ id, paymentStatus, amountPaid }) => {
      const res = await fetch(`/api/invoices/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          paymentStatus,
          amountPaid // Update the amount paid when marking as Paid
        }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["invoices"]);
      toast.success("Marked as Paid");
    }
  });

  function markAsPaid(id) {
    // Find the invoice to get its full amount
    const inv = invoices.find(i => i.id === id);
    if (!inv) return;
    statusMutation.mutate({
      id,
      paymentStatus: "Paid",
      amountPaid: inv.amount // Set paid amount to total amount
    });
  }

  function formatCurrency(value) {
    return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(
      Number(value || 0)
    );
  }

  return (
    <section className="mt-4 container mx-auto p-4 animate-in fade-in duration-500">
      <PageHeader
        title="Invoice Command Center"
        description="Track photography retainers, production balances, and delivery-linked payouts in one dashboard."
        action={
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-6 py-2.5 text-sm font-semibold text-white shadow-lg hover:bg-gray-800 transition-all"
            onClick={() => openModal()}
          >
            <Plus size={18} />
            Create Invoice
          </button>
        }
      />

      <div className="grid gap-4 md:grid-cols-4 mb-4">
        <OverviewCard label="Billed this season" value={formatCurrency(stats.total)} subLabel="Gross" accent="from-amber-50" />
        <OverviewCard label="Collected" value={formatCurrency(stats.collected)} subLabel="Deposited" accent="from-emerald-50" />
        <OverviewCard label="Outstanding" value={formatCurrency(stats.outstanding)} subLabel="Yet to collect" accent="from-rose-50" />
        <OverviewCard label="Overdue" value={`${stats.overdue} files`} subLabel="Need follow-up" accent="from-slate-100" />
      </div>

      <div className="grid gap-6 lg:grid-cols-[2.1fr,1fr]">
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-4 py-3">
            <div>
              <h2 className="text-lg font-semibold text-charcoal-900">Invoice Ledger</h2>
              <p className="text-xs text-slate-500">Sorted by due date • {filteredInvoices.length} active</p>
            </div>
            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
              <div className="relative">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search client, event, invoice #"
                  className="w-full rounded-full border border-slate-200 px-4 py-2 text-sm focus:border-gold-500 focus:outline-none"
                />
                <span className="pointer-events-none absolute right-3 top-2.5 text-xs text-slate-400">⌕</span>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 border-b border-slate-100 px-4 py-3 text-xs font-semibold">
            {filterOptions.map((option) => (
              <button
                key={option}
                className={`rounded-full border px-3 py-1 capitalize transition ${statusFilter === option ? "border-gold-500 bg-gold-50 text-gold-600" : "border-transparent bg-slate-100 text-slate-600"
                  }`}
                onClick={() => setStatusFilter(option)}
              >
                {option === "all" ? "All" : option}
              </button>
            ))}
          </div>
          <div className="hidden overflow-x-auto md:block">
            <table className="min-w-full divide-y divide-slate-100 text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">Invoice</th>
                  <th className="px-4 py-3 text-left font-semibold">Client & Event</th>
                  <th className="px-4 py-3 text-left font-semibold">Issue / Due</th>
                  <th className="px-4 py-3 text-left font-semibold">Amount</th>
                  <th className="px-4 py-3 text-left font-semibold">Progress</th>
                  <th className="px-4 py-3 text-left font-semibold">Status</th>
                  <th className="px-4 py-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInvoices.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center text-slate-500">
                      No invoices match your filters.
                    </td>
                  </tr>
                ) : (
                  filteredInvoices.map((invoice) => {
                    const balance = Math.max(Number(invoice.amount) - Number(invoice.paid), 0);
                    const progress = Math.min(100, Math.round((Number(invoice.paid || 0) / Number(invoice.amount || 1)) * 100));
                    return (
                      <tr key={invoice.id} className="group odd:bg-white even:bg-slate-50 hover:bg-gold-50/30 transition-colors">
                        <td className="px-4 py-3">
                          <p className="font-semibold text-charcoal-900">{invoice.invoiceNo}</p>
                          <p className="text-xs text-slate-500">{invoice.stage}</p>
                        </td>
                        <td className="px-4 py-3">
                          <p className="font-medium text-charcoal-900">{invoice.client}</p>
                          <p className="text-xs text-slate-500">{invoice.event}</p>
                        </td>
                        <td className="px-4 py-3 text-slate-600">
                          <div className="text-xs">{formatDate(invoice.issueDate)}</div>
                          <div className={`text-xs ${isOverdue(invoice) ? "text-rose-500 font-medium" : "text-slate-400"}`}>
                            Due: {formatDate(invoice.dueDate)}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <p className="font-semibold text-charcoal-900">{formatCurrency(invoice.amount)}</p>
                          {balance > 0 ? (
                            <p className="text-xs text-slate-500">Bal: {formatCurrency(balance)}</p>
                          ) : (
                            <p className="text-xs text-emerald-600 font-medium flex items-center gap-1"><FileCheck size={10} /> Fully Paid</p>
                          )}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <div className="relative h-2 w-16 rounded-full bg-slate-100 overflow-hidden mx-auto">
                            <div className={`absolute top-0 left-0 h-full rounded-full ${progress === 100 ? "bg-emerald-500" : "bg-gold-500"}`} style={{ width: `${progress}%` }} />
                          </div>
                          <span className="text-[10px] font-medium text-slate-400 mt-1 block">{progress}%</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${isOverdue(invoice) ? statusStyles.Overdue : (statusStyles[invoice.status] || "bg-slate-100 text-slate-600 border-slate-200")}`}>
                            {isOverdue(invoice) ? "Overdue" : invoice.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={(e) => handleGeneratePDF(e, invoice)}
                              className="p-1.5 rounded-md hover:bg-slate-100 text-slate-500 hover:text-charcoal-900 transition-colors"
                              title="Download PDF"
                            >
                              <FileText size={16} />
                            </button>
                            <button
                              className="px-3 py-1 rounded-md border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-all bg-white"
                              onClick={() => openModal(invoice)}
                            >
                              Edit
                            </button>
                            {invoice.status !== "Paid" && (
                              <button
                                className="px-3 py-1 rounded-md bg-emerald-50 border border-emerald-100 text-xs font-semibold text-emerald-600 hover:bg-emerald-100 transition-all"
                                onClick={() => markAsPaid(invoice.id)}
                              >
                                Mark Paid
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          <div className="grid gap-4 px-4 py-5 md:hidden">
            {filteredInvoices.length === 0 ? (
              <p className="text-center text-sm text-slate-500">No invoices match your filters.</p>
            ) : (
              filteredInvoices.map((invoice) => {
                const balance = Math.max(Number(invoice.amount) - Number(invoice.paid), 0);
                const progress = Math.min(100, Math.round((Number(invoice.paid || 0) / Number(invoice.amount || 1)) * 100));
                return (
                  <div key={invoice.id} className="space-y-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm hover:border-gold-200 transition-colors">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <p className="text-base font-semibold text-charcoal-900">{invoice.invoiceNo}</p>
                        <p className="text-xs text-slate-500">{invoice.stage}</p>
                      </div>
                      <span
                        className={`rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${isOverdue(invoice) ? statusStyles.Overdue : (statusStyles[invoice.status] || "bg-slate-100 text-slate-600 border-slate-200")}`}
                      >
                        {isOverdue(invoice) ? "Overdue" : invoice.status}
                      </span>
                    </div>
                    <div className="grid gap-3 text-xs text-slate-500 sm:grid-cols-2">
                      <div>
                        <p className="text-sm font-medium text-charcoal-900">{invoice.client}</p>
                        <p>{invoice.event}</p>
                      </div>
                      <div className="text-right sm:text-left">
                        <p>Issue: {formatDate(invoice.issueDate)}</p>
                        <p className={`${isOverdue(invoice) ? "text-rose-500 font-medium" : ""}`}>Due: {formatDate(invoice.dueDate)}</p>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-baseline mb-1">
                        <div className="text-sm font-semibold text-charcoal-900">{formatCurrency(invoice.amount)}</div>
                        {balance === 0 && <span className="text-xs text-emerald-600 font-medium flex items-center gap-1"><FileCheck size={10} /> Fully Paid</span>}
                      </div>

                      <div className="mt-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                        <div className={`h-full rounded-full ${progress === 100 ? "bg-emerald-500" : "bg-gold-500"}`} style={{ width: `${progress}%` }} />
                      </div>
                      {balance > 0 && <p className="mt-1 text-xs text-slate-500 text-right">Balance {formatCurrency(balance)}</p>}
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 border-t border-slate-50 pt-3">
                      <span>{invoice.paymentMethod}</span>
                      <div className="flex gap-2 text-xs">
                        <button
                          onClick={(e) => handleGeneratePDF(e, invoice)}
                          className="flex items-center justify-center h-8 w-8 rounded-full bg-slate-50 text-slate-600 border border-slate-200"
                        >
                          <FileText size={14} />
                        </button>
                        <button
                          className="rounded-md border border-slate-200 px-3 py-1 font-semibold text-slate-700 bg-white"
                          onClick={() => openModal(invoice)}
                        >
                          Edit
                        </button>
                        {invoice.status !== "Paid" && (
                          <button
                            className="rounded-md border border-emerald-100 px-3 py-1 font-semibold text-emerald-600 bg-emerald-50"
                            onClick={() => markAsPaid(invoice.id)}
                          >
                            Paid
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-charcoal-900">Upcoming Due Dates</h3>
                <p className="text-xs text-slate-500">Auto-sort by urgency</p>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                {upcomingDue.length}
              </span>
            </div>
            <ul className="mt-4 space-y-3">
              {upcomingDue.map((invoice) => (
                <li key={invoice.id} className="flex items-start justify-between rounded-xl border border-slate-100 p-3">
                  <div>
                    <p className="text-sm font-semibold text-charcoal-900">{invoice.client}</p>
                    <p className="text-xs text-slate-500">{invoice.event}</p>
                    <p className="mt-1 text-xs text-rose-500">Due {formatDate(invoice.dueDate)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-charcoal-900">{formatCurrency(invoice.amount - invoice.paid)}</p>
                    <p className="text-xs text-slate-400">Remaining</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-base font-semibold text-charcoal-900">Payment Mix</h3>
            <p className="text-xs text-slate-500">Where the money landed</p>
            <div className="mt-4 space-y-3">
              {paymentMix.map((entry) => (
                <div key={entry.method}>
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                    <span>{entry.method}</span>
                    <span>{entry.percent}%</span>
                  </div>
                  <div className="mt-1 h-2 rounded-full bg-slate-100">
                    <div className="h-full rounded-full bg-charcoal-900" style={{ width: `${entry.percent}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-base font-semibold text-charcoal-900">Workflow Notes</h3>
            <ol className="mt-4 space-y-3 text-sm text-slate-600">
              <li className="rounded-xl bg-slate-50 p-3">
                <p className="font-semibold text-charcoal-900">Send teaser-linked invoices</p>
                <p className="text-xs text-slate-500">Attach preview gallery for faster approvals.</p>
              </li>
              <li className="rounded-xl bg-slate-50 p-3">
                <p className="font-semibold text-charcoal-900">Automate WhatsApp nudges</p>
                <p className="text-xs text-slate-500">Schedule reminders 48h before due date.</p>
              </li>
              <li className="rounded-xl bg-slate-50 p-3">
                <p className="font-semibold text-charcoal-900">Reward early settlements</p>
                <p className="text-xs text-slate-500">Offer 5% off on advance payments.</p>
              </li>
            </ol>
          </div>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-4" onClick={() => setModalOpen(false)}>
          <div className="w-full max-w-3xl rounded-2xl bg-white p-6 shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-gold-500">Invoice</p>
                <h2 className="text-2xl font-semibold text-charcoal-900">{editingId ? "Edit Invoice" : "New Invoice"}</h2>
              </div>
              <button className="text-slate-400 hover:text-slate-600" onClick={() => setModalOpen(false)}>
                ✕
              </button>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <Field label="Invoice No." required>
                <input
                  value={form.invoiceNo}
                  onChange={(e) => setForm((prev) => ({ ...prev, invoiceNo: e.target.value }))}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-gold-500 focus:ring-1 focus:ring-gold-500"
                />
              </Field>
              <Field label="Client" required>
                <input
                  value={form.client}
                  onChange={(e) => setForm((prev) => ({ ...prev, client: e.target.value }))}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-gold-500 focus:ring-1 focus:ring-gold-500"
                />
              </Field>
              <Field label="Event">
                <select
                  value={form.event}
                  onChange={(e) => setForm((prev) => ({ ...prev, event: e.target.value }))}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-gold-500 focus:ring-1 focus:ring-gold-500"
                >
                  <option>Wedding</option>
                  <option>Pre-Wedding</option>
                  <option>Engagement</option>
                  <option>Commercial</option>
                </select>
              </Field>
              <Field label="Issue Date">
                <input
                  type="date"
                  value={form.issueDate}
                  onChange={(e) => setForm((prev) => ({ ...prev, issueDate: e.target.value }))}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-gold-500 focus:ring-1 focus:ring-gold-500"
                />
              </Field>
              <Field label="Due Date">
                <input
                  type="date"
                  value={form.dueDate}
                  onChange={(e) => setForm((prev) => ({ ...prev, dueDate: e.target.value }))}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-gold-500 focus:ring-1 focus:ring-gold-500"
                />
              </Field>
              <Field label="Amount" required>
                <input
                  type="number"
                  value={form.amount}
                  onChange={(e) => setForm((prev) => ({ ...prev, amount: e.target.value }))}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-gold-500 focus:ring-1 focus:ring-gold-500"
                />
              </Field>
              <Field label="Paid">
                <input
                  type="number"
                  value={form.paid}
                  onChange={(e) => setForm((prev) => ({ ...prev, paid: e.target.value }))}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-gold-500 focus:ring-1 focus:ring-gold-500"
                />
              </Field>
              <Field label="Status">
                <select
                  value={form.status}
                  onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value }))}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-gold-500 focus:ring-1 focus:ring-gold-500"
                >
                  <option>Draft</option>
                  <option>Sent</option>
                  <option>Partial</option>
                  <option>Paid</option>
                  <option>Overdue</option>
                </select>
              </Field>
              <Field label="Workflow Stage">
                <select
                  value={form.stage}
                  onChange={(e) => setForm((prev) => ({ ...prev, stage: e.target.value }))}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-gold-500 focus:ring-1 focus:ring-gold-500"
                >
                  <option>Planning</option>
                  <option>Shoot</option>
                  <option>Editing</option>
                  <option>Album Design</option>
                  <option>Delivered</option>
                </select>
              </Field>
              <Field label="Payment Method">
                <select
                  value={form.paymentMethod}
                  onChange={(e) => setForm((prev) => ({ ...prev, paymentMethod: e.target.value }))}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-gold-500 focus:ring-1 focus:ring-gold-500"
                >
                  <option>UPI</option>
                  <option>Bank Transfer</option>
                  <option>NEFT</option>
                  <option>Cash</option>
                </select>
              </Field>
              <div className="md:col-span-2">
                <Field label="Notes">
                  <textarea
                    rows={3}
                    value={form.notes}
                    onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-gold-500 focus:ring-1 focus:ring-gold-500"
                  />
                </Field>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3 border-t border-slate-200 pt-4">
              <button className="rounded-md border border-slate-200 px-4 py-2 text-sm" onClick={() => setModalOpen(false)}>
                Cancel
              </button>
              <button
                className="rounded-md bg-gold-500 px-4 py-2 text-sm font-semibold text-white flex items-center gap-2"
                onClick={saveInvoice}
                disabled={mutation.isPending}
              >
                {mutation.isPending ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  editingId ? "Update" : "Save"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function OverviewCard({ label, value, subLabel, accent }) {
  return (
    <div className={`rounded-2xl bg-gradient-to-br ${accent} to-white p-4 shadow-inner`}>
      <p className="text-xs uppercase tracking-[0.3em] text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-bold text-charcoal-900">{value}</p>
      <p className="text-xs text-slate-500">{formatSubLabel(subLabel)}</p>
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

function isOverdue(invoice) {
  if (invoice.status === "Paid") return false;
  if (!invoice.dueDate) return false;
  const due = new Date(invoice.dueDate);
  const now = new Date();
  return due < now;
}

function formatDate(dateStr) {
  if (!dateStr) return "--";
  return new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short" }).format(new Date(dateStr));
}

function formatSubLabel(text) {
  return text || "";
}
