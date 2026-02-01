import React, { useMemo, useState } from "react";
import { useSettings } from "../hooks/useSettings";
import { generateQuotationPDF } from "../utils/pdfGenerator";
import QuotationForm from "../components/QuotationForm";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import PageHeader from "../components/PageHeader";

const quoteStatusStyles = {
  Draft: "bg-slate-100 text-slate-600",
  Sent: "bg-indigo-100 text-indigo-700",
  Negotiation: "bg-amber-100 text-amber-700",
  Accepted: "bg-emerald-100 text-emerald-700",
  Rejected: "bg-rose-100 text-rose-600",
  Expired: "bg-slate-200 text-slate-600",
};

const statusFilters = ["all", "Draft", "Sent", "Negotiation", "Accepted", "Rejected", "Expired"];

export default function AdminQuotations() {
  const queryClient = useQueryClient();
  const { data: settings } = useSettings();

  const { data: quotes = [], isLoading } = useQuery({
    queryKey: ["quotations"],
    queryFn: async () => {
      const res = await fetch("/api/quotations");
      if (!res.ok) throw new Error("Failed to fetch quotations");

      const data = await res.json();
      // Map Backend fields to Frontend shape
      return data.map((q) => ({
        ...q,
        id: q._id,
        quoteNo: q.quotationNumber,
        client: q.clientId?.name || "Unknown",
        event: q.eventType,
        shootDate: q.eventDate,
        createdAt: q.quotationDate,
        location: q.clientId?.city || q.location || "—",
        total: q.grandTotal,
        retainer: q.retainerAmount ?? Math.round((q.grandTotal || 0) * 0.3),
        status: q.status || "Draft",
        stage: q.workflowStage || "Concept",
        followUp: q.validityDate,
        channel: q.channel || "Email",
        moodboard: q.moodboard || "",
        notes: q.notes || "",
        deliverables: (q.services || []).map((service) => service.serviceName || service.description || "Package item"),
      }));
    },
    enabled: true,
  });

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [activeQuote, setActiveQuote] = useState(null);

  const stats = useMemo(() => {
    const sent = quotes.filter((q) => q.status !== "Draft").length;
    const accepted = quotes.filter((q) => q.status === "Accepted").length;
    const acceptanceRate = sent ? Math.round((accepted / sent) * 100) : 0;
    const pending = quotes.filter((q) => ["Sent", "Negotiation"].includes(q.status)).length;
    const avgDeal = quotes.length
      ? Math.round(quotes.reduce((sum, q) => sum + Number(q.total || 0), 0) / quotes.length)
      : 0;
    return { sent, acceptanceRate, pending, avgDeal };
  }, [quotes]);

  const filteredQuotes = useMemo(() => {
    return quotes.filter((quote) => {
      const matchesSearch = [quote.quoteNo, quote.client, quote.event, quote.location]
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesFilter = filter === "all" ? true : quote.status === filter;
      return matchesSearch && matchesFilter;
    });
  }, [quotes, search, filter]);

  const followUpQueue = useMemo(() => {
    return [...quotes]
      .filter((q) => q.followUp && q.status !== "Accepted")
      .sort((a, b) => new Date(a.followUp) - new Date(b.followUp))
      .slice(0, 5);
  }, [quotes]);

  function handleGeneratePdf(quote) {
    const clientProfile = quote.clientId || {
      name: quote.client,
      email: `${quote.client?.toLowerCase().replace(/\s+/g, "") || "client"}@studio.com`,
      phone: "+91 90000 00000",
      address: quote.location,
    };

    generateQuotationPDF(quote, clientProfile, settings);
  }

  function openForm(quote = null) {
    setActiveQuote(quote);
    setShowForm(true);
  }

  function closeForm() {
    setActiveQuote(null);
    setShowForm(false);
  }

  function handleFormSaved() {
    closeForm();
    queryClient.invalidateQueries(["quotations"]);
  }

  const statusMutation = useMutation({
    mutationFn: async ({ id, status, stage }) => {
      const res = await fetch(`/api/quotations/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status, stage }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["quotations"]);
      toast.success("Status updated");
    }
  });

  function markAccepted(id) {
    statusMutation.mutate({ id, status: "Accepted", stage: "Booked" });
  }

  const duplicateMutation = useMutation({
    mutationFn: async (id) => {
      const res = await fetch(`/api/quotations/${id}/duplicate`, { method: "POST" });
      if (!res.ok) throw new Error("Failed to duplicate quotation");
      return res.json();
    },
    onSuccess: () => {
      toast.success("Quotation duplicated");
      queryClient.invalidateQueries(["quotations"]);
    },
    onError: (err) => toast.error(err.message || "Unable to duplicate quote"),
  });

  function formatCurrency(value) {
    return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(
      Number(value || 0)
    );
  }

  return (
    <section className="mt-4 container mx-auto p-4 animate-in fade-in duration-500">
      <PageHeader
        title="Quotations"
        description="Shape bespoke photography offers, track approvals, and keep follow-ups on rhythm."
        action={
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-6 py-2.5 text-sm font-semibold text-white shadow-lg hover:bg-gray-800 transition-all"
            onClick={() => openForm()}
          >
            <Plus size={18} />
            New Quotation
          </button>
        }
      />


      <div className="grid gap-4 md:grid-cols-4 mb-4">
        <Metric label="Sent this month" value={`${stats.sent}`} sub="Client decks" accent="from-amber-50" />
        <Metric label="Acceptance rate" value={`${stats.acceptanceRate}%`} sub="Win ratio" accent="from-emerald-50" />
        <Metric label="Pending approvals" value={`${stats.pending}`} sub="Need nudges" accent="from-rose-50" />
        <Metric label="Average deal" value={formatCurrency(stats.avgDeal)} sub="Per booking" accent="from-slate-100" />
      </div>

      <div className="grid gap-6 lg:grid-cols-[2.1fr,1fr]">
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-4 py-3">
            <div>
              <h2 className="text-lg font-semibold text-charcoal-900">Quote Pipeline</h2>
              <p className="text-xs text-slate-500">{filteredQuotes.length} files • Sorted by shoot date</p>
            </div>
            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
              <div className="relative">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search client, city, quote #"
                  className="w-full rounded-full border border-slate-200 px-4 py-2 text-sm focus:border-gold-500 focus:outline-none"
                />
                <span className="pointer-events-none absolute right-3 top-2.5 text-xs text-slate-400">⌕</span>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 border-b border-slate-100 px-4 py-3 text-xs font-semibold">
            {statusFilters.map((value) => (
              <button
                key={value}
                className={`rounded-full border px-3 py-1 capitalize transition ${filter === value ? "border-gold-500 bg-gold-50 text-gold-600" : "border-transparent bg-slate-100 text-slate-600"
                  }`}
                onClick={() => setFilter(value)}
              >
                {value === "all" ? "All" : value}
              </button>
            ))}
          </div>
          <div className="hidden overflow-x-auto md:block">
            <table className="min-w-full divide-y divide-slate-100 text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">Quote</th>
                  <th className="px-4 py-3 text-left font-semibold">Client & Event</th>
                  <th className="px-4 py-3 text-left font-semibold">Shoot Date</th>
                  <th className="px-4 py-3 text-left font-semibold">Deliverables</th>
                  <th className="px-4 py-3 text-left font-semibold">Value</th>
                  <th className="px-4 py-3 text-left font-semibold">Status</th>
                  <th className="px-4 py-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredQuotes.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center text-slate-500">
                      No quotations match your filters.
                    </td>
                  </tr>
                ) : (
                  filteredQuotes.map((quote) => (
                    <tr key={quote.id} className="odd:bg-white even:bg-slate-50">
                      <td className="px-4 py-3">
                        <p className="font-semibold text-charcoal-900">{quote.quoteNo}</p>
                        <p className="text-xs text-slate-500">{quote.stage}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-semibold text-charcoal-900">{quote.client}</p>
                        <p className="text-xs text-slate-500">{quote.event} • {quote.location}</p>
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        <div className="text-xs">{formatDate(quote.shootDate)}</div>
                        <div className="text-xs text-slate-400">Issued {formatDate(quote.createdAt)}</div>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-600">
                        <ul className="space-y-1">
                          {quote.deliverables.slice(0, 3).map((item) => (
                            <li key={item}>• {item}</li>
                          ))}
                        </ul>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-semibold text-charcoal-900">{formatCurrency(quote.total)}</p>
                        <p className="text-xs text-slate-500">Retainer {formatCurrency(quote.retainer)}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${quoteStatusStyles[quote.status] || "bg-slate-100 text-slate-600"}`}>
                          {quote.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="inline-flex gap-2">
                          <button
                            className="rounded-md border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                            onClick={() => openForm(quote)}
                          >
                            Edit
                          </button>
                          <button
                            className="rounded-md border border-blue-100 px-3 py-1 text-xs font-semibold text-blue-600 hover:bg-blue-50"
                            onClick={() => duplicateMutation.mutate(quote.id)}
                          >
                            Duplicate
                          </button>
                          <button
                            className="rounded-md border border-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-600 hover:bg-emerald-50"
                            onClick={() => markAccepted(quote.id)}
                            disabled={quote.status === "Accepted"}
                          >
                            Mark Won
                          </button>
                          <button
                            className="rounded-md border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                            onClick={() => handleGeneratePdf(quote)}
                          >
                            PDF
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="grid gap-4 px-4 py-5 md:hidden">
            {filteredQuotes.length === 0 ? (
              <p className="text-center text-sm text-slate-500">No quotations match your filters.</p>
            ) : (
              filteredQuotes.map((quote) => (
                <div key={quote.id} className="space-y-3 rounded-2xl border border-slate-100 p-4 shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="text-base font-semibold text-charcoal-900">{quote.quoteNo}</p>
                      <p className="text-xs text-slate-500">{quote.stage}</p>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-[11px] font-semibold ${quoteStatusStyles[quote.status] || "bg-slate-100 text-slate-600"
                        }`}
                    >
                      {quote.status}
                    </span>
                  </div>
                  <div className="grid gap-3 text-xs text-slate-500 sm:grid-cols-2">
                    <div>
                      <p className="text-sm font-semibold text-charcoal-900">{quote.client}</p>
                      <p>
                        {quote.event} • {quote.location}
                      </p>
                    </div>
                    <div>
                      <p>Shoot — {formatDate(quote.shootDate)}</p>
                      <p>Issued — {formatDate(quote.createdAt)}</p>
                    </div>
                  </div>
                  <div className="text-sm font-semibold text-charcoal-900">{formatCurrency(quote.total)}</div>
                  <ul className="text-xs text-slate-600">
                    {quote.deliverables.slice(0, 3).map((item) => (
                      <li key={item}>• {item}</li>
                    ))}
                  </ul>
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                    <span>Follow-up {formatDate(quote.followUp)}</span>
                    <div className="flex gap-2 text-xs">
                      <button
                        className="rounded-md border border-slate-200 px-3 py-1 font-semibold text-slate-700"
                        onClick={() => openForm(quote)}
                      >
                        Edit
                      </button>
                      <button
                        className="rounded-md border border-blue-100 px-3 py-1 font-semibold text-blue-600"
                        onClick={() => duplicateMutation.mutate(quote.id)}
                      >
                        Copy
                      </button>
                      <button
                        className="rounded-md border border-emerald-100 px-3 py-1 font-semibold text-emerald-600"
                        onClick={() => markAccepted(quote.id)}
                        disabled={quote.status === "Accepted"}
                      >
                        Won
                      </button>
                      <button
                        className="rounded-md border border-slate-200 px-3 py-1 font-semibold text-slate-700"
                        onClick={() => handleGeneratePdf(quote)}
                      >
                        PDF
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-charcoal-900">Follow-up Radar</h3>
                <p className="text-xs text-slate-500">Auto-prioritized by due date</p>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">{followUpQueue.length}</span>
            </div>
            <ul className="mt-4 space-y-3">
              {followUpQueue.map((quote) => (
                <li key={quote.id} className="rounded-xl border border-slate-100 p-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-semibold text-charcoal-900">{quote.client}</p>
                      <p className="text-xs text-slate-500">{quote.event}</p>
                    </div>
                    <span className="text-xs font-semibold text-rose-500">{formatDate(quote.followUp)}</span>
                  </div>
                  <p className="mt-1 text-xs text-slate-500">via {quote.channel}</p>
                  <p className="mt-2 text-xs text-charcoal-900">{quote.notes}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-base font-semibold text-charcoal-900">Package Blueprint</h3>
            <p className="text-xs text-slate-500">Most requested deliverables</p>
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <Blueprint title="Signature Wedding" items={["2 lead photographers", "Cinematic + candid team", "Album + parent books"]} />
              <Blueprint title="Intimate Elopement" items={["Solo storyteller", "Half-day coverage", "Story film teaser"]} />
              <Blueprint title="Commercial Lookbook" items={["Light crew", "14 looks", "BTS reel for social"]} />
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-base font-semibold text-charcoal-900">Shot Planning Notes</h3>
            <ul className="mt-3 space-y-3 text-xs text-slate-600">
              <li className="rounded-xl bg-slate-50 p-3">
                <p className="font-semibold text-charcoal-900">Bundle hotel stay</p>
                <p>Add on-site stay to premium tiers for stress-free logistics.</p>
              </li>
              <li className="rounded-xl bg-slate-50 p-3">
                <p className="font-semibold text-charcoal-900">Preview within 72h</p>
                <p>Fast teaser delivery increases conversion by 28%.</p>
              </li>
              <li className="rounded-xl bg-slate-50 p-3">
                <p className="font-semibold text-charcoal-900">Offer moodboard swap</p>
                <p>Share 3 visual directions to encourage upsells.</p>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {showForm && (
        <QuotationForm quotation={activeQuote} onSave={handleFormSaved} onCancel={closeForm} />
      )}
    </section>
  );
}

function Metric({ label, value, sub, accent }) {
  return (
    <div className={`rounded-2xl bg-gradient-to-br ${accent} to-white p-4 shadow-inner`}>
      <p className="text-xs uppercase tracking-[0.3em] text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-bold text-charcoal-900">{value}</p>
      <p className="text-xs text-slate-500">{sub}</p>
    </div>
  );
}

function Blueprint({ title, items }) {
  return (
    <div className="rounded-2xl border border-slate-100 p-3">
      <p className="text-sm font-semibold text-charcoal-900">{title}</p>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-xs text-slate-600">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

function formatDate(dateStr) {
  if (!dateStr) return "--";
  return new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short" }).format(new Date(dateStr));
}
