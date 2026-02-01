import React, { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import PageHeader from "../components/PageHeader";

const initialAccessories = [
  {
    id: "ACC-201",
    name: "Profoto B10 Plus",
    category: "Lighting",
    kit: "Studio Pack",
    condition: "Excellent",
    stock: 4,
    reserved: 1,
    location: "HQ Cage",
    updatedAt: "2026-01-08",
    tags: ["Battery", "Flash"],
  },
  {
    id: "ACC-188",
    name: "Sony Gimbal RS4",
    category: "Motion",
    kit: "Wedding Doc",
    condition: "Needs Service",
    stock: 2,
    reserved: 2,
    location: "Field Vault",
    updatedAt: "2026-01-05",
    tags: ["Gimbal"],
  },
  {
    id: "ACC-150",
    name: "MagMod Creative Kit",
    category: "Modifiers",
    kit: "Elopement",
    condition: "Great",
    stock: 6,
    reserved: 0,
    location: "HQ Cage",
    updatedAt: "2026-01-02",
    tags: ["Magnetic", "Flash"],
  },
  {
    id: "ACC-132",
    name: "Nanlite Pavotube 30C",
    category: "Lighting",
    kit: "Commercial",
    condition: "Fair",
    stock: 3,
    reserved: 1,
    location: "Studio Loft",
    updatedAt: "2025-12-29",
    tags: ["RGB", "Tube"],
  },
  {
    id: "ACC-115",
    name: "DJI Wireless Mic",
    category: "Audio",
    kit: "Docu",
    condition: "Excellent",
    stock: 5,
    reserved: 2,
    location: "HQ Cage",
    updatedAt: "2025-12-25",
    tags: ["Audio"],
  },
];

const conditionStyles = {
  Excellent: "bg-emerald-50 text-emerald-700",
  Great: "bg-blue-50 text-blue-700",
  Fair: "bg-amber-50 text-amber-700",
  "Needs Service": "bg-rose-50 text-rose-600",
};

const filterOptions = ["all", "Lighting", "Motion", "Modifiers", "Audio"];

const emptyAccessory = {
  id: null,
  name: "",
  category: "Lighting",
  kit: "",
  condition: "Excellent",
  stock: "",
  reserved: "0",
  location: "",
  tags: "",
};

export default function AccessoriesManagement() {
  const [accessories, setAccessories] = useState(initialAccessories);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyAccessory);
  const [editingId, setEditingId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const stats = useMemo(() => {
    const total = accessories.reduce((sum, acc) => sum + Number(acc.stock || 0), 0);
    const reserved = accessories.reduce((sum, acc) => sum + Number(acc.reserved || 0), 0);
    const lowStock = accessories.filter((acc) => acc.stock - acc.reserved <= 1).length;
    const needsService = accessories.filter((acc) => acc.condition === "Needs Service").length;
    return { total, reserved, lowStock, needsService };
  }, [accessories]);

  const filteredAccessories = useMemo(() => {
    return accessories.filter((acc) => {
      const matchesSearch = [acc.name, acc.category, acc.kit, acc.id]
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesFilter = filter === "all" ? true : acc.category === filter;
      return matchesSearch && matchesFilter;
    });
  }, [accessories, search, filter]);

  const kitOverview = useMemo(() => {
    return accessories.reduce((map, acc) => {
      map[acc.kit] = map[acc.kit] || { items: 0, reserved: 0 };
      map[acc.kit].items += Number(acc.stock || 0);
      map[acc.kit].reserved += Number(acc.reserved || 0);
      return map;
    }, {});
  }, [accessories]);

  function openModal(accessory = null) {
    if (accessory) {
      setForm({
        ...accessory,
        stock: accessory.stock.toString(),
        reserved: accessory.reserved.toString(),
        tags: accessory.tags?.join(", ") || "",
      });
      setEditingId(accessory.id);
    } else {
      setForm({ ...emptyAccessory });
      setEditingId(null);
    }
    setModalOpen(true);
  }

  async function saveAccessory() {
    if (!form.name.trim()) return;

    setIsSaving(true);

    const payload = {
      ...form,
      stock: Number(form.stock) || 0,
      reserved: Number(form.reserved) || 0,
      tags: form.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      updatedAt: new Date().toISOString().slice(0, 10),
    };

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (editingId) {
        setAccessories((prev) => prev.map((acc) => (acc.id === editingId ? { ...acc, ...payload } : acc)));
      } else {
        const id = typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `ACC-${Date.now()}`;
        setAccessories((prev) => [{ ...payload, id }, ...prev]);
      }
      setModalOpen(false);
    } catch (error) {
      console.error("Failed to save accessory", error);
    } finally {
      setIsSaving(false);
    }
  }

  function toggleServiceFlag(id) {
    setAccessories((prev) =>
      prev.map((acc) =>
        acc.id === id
          ? { ...acc, condition: acc.condition === "Needs Service" ? "Great" : "Needs Service" }
          : acc
      )
    );
  }

  return (
    <section className="mt-4 container mx-auto p-4 animate-in fade-in duration-500 space-y-6">
      <PageHeader
        title="Accessories Control Room"
        description="Track modifiers, lighting, motion rigs, and on-location essentials in one board."
        action={
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-6 py-2.5 text-sm font-semibold text-white shadow-lg hover:bg-gray-800 transition-all"
            onClick={() => openModal()}
          >
            <Plus size={18} />
            Add Accessory
          </button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Pieces in vault" value={stats.total} hint="Total units" accent="from-amber-50" />
        <Stat label="On hold" value={stats.reserved} hint="Reserved across kits" accent="from-blue-50" />
        <Stat label="Low stock" value={stats.lowStock} hint="At or under 1 spare" accent="from-rose-50" />
        <Stat label="Needs service" value={stats.needsService} hint="Flagged for tech" accent="from-slate-100" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[2.1fr,1fr]">
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-4 py-3">
            <div>
              <h2 className="text-lg font-semibold text-charcoal-900">Inventory Grid</h2>
              <p className="text-xs text-slate-500">{filteredAccessories.length} assets • Live stock overview</p>
            </div>
            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
              <div className="relative">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search name, kit, ID"
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
                className={`rounded-full border px-3 py-1 capitalize transition ${filter === option ? "border-gold-500 bg-gold-50 text-gold-600" : "border-transparent bg-slate-100 text-slate-600"
                  }`}
                onClick={() => setFilter(option)}
              >
                {option === "all" ? "All" : option}
              </button>
            ))}
          </div>
          <div className="hidden overflow-x-auto md:block">
            <table className="min-w-full divide-y divide-slate-100 text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">Accessory</th>
                  <th className="px-4 py-3 text-left font-semibold">Kit / Location</th>
                  <th className="px-4 py-3 text-left font-semibold">Stock</th>
                  <th className="px-4 py-3 text-left font-semibold">Condition</th>
                  <th className="px-4 py-3 text-left font-semibold">Tags</th>
                  <th className="px-4 py-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAccessories.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center text-slate-500">
                      No accessories match your filters.
                    </td>
                  </tr>
                ) : (
                  filteredAccessories.map((acc) => {
                    const spare = Math.max(acc.stock - acc.reserved, 0);
                    const spareClass = spare <= 1 ? "text-rose-500" : "text-emerald-600";
                    return (
                      <tr key={acc.id} className="odd:bg-white even:bg-slate-50">
                        <td className="px-4 py-3">
                          <p className="font-semibold text-charcoal-900">{acc.name}</p>
                          <p className="text-xs text-slate-500">{acc.id}</p>
                        </td>
                        <td className="px-4 py-3 text-xs text-slate-600">
                          <p>{acc.kit || "—"}</p>
                          <p className="text-slate-400">{acc.location}</p>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-sm font-semibold text-charcoal-900">{acc.stock} total</div>
                          <div className="text-xs text-slate-500">{acc.reserved} reserved</div>
                          <div className={`text-xs font-semibold ${spareClass}`}>{spare} spare</div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${conditionStyles[acc.condition] || "bg-slate-100 text-slate-600"}`}>
                            {acc.condition}
                          </span>
                          <p className="mt-1 text-xs text-slate-400">Updated {formatDate(acc.updatedAt)}</p>
                        </td>
                        <td className="px-4 py-3 text-xs text-slate-600">
                          <div className="flex flex-wrap gap-1">
                            {acc.tags?.map((tag) => (
                              <span key={tag} className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] text-slate-600">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="inline-flex gap-2">
                            <button
                              className="rounded-md border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                              onClick={() => openModal(acc)}
                            >
                              Edit
                            </button>
                            <button
                              className="rounded-md border border-amber-100 px-3 py-1 text-xs font-semibold text-amber-600 hover:bg-amber-50"
                              onClick={() => toggleServiceFlag(acc.id)}
                            >
                              {acc.condition === "Needs Service" ? "Clear Flag" : "Flag"}
                            </button>
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
            {filteredAccessories.length === 0 ? (
              <p className="text-center text-sm text-slate-500">No accessories match your filters.</p>
            ) : (
              filteredAccessories.map((acc) => {
                const spare = Math.max(acc.stock - acc.reserved, 0);
                const spareClass = spare <= 1 ? "text-rose-500" : "text-emerald-600";
                return (
                  <div key={acc.id} className="space-y-3 rounded-2xl border border-slate-100 p-4 shadow-sm">
                    <div className="flex flex-col gap-1">
                      <p className="text-base font-semibold text-charcoal-900">{acc.name}</p>
                      <p className="text-xs text-slate-500">{acc.id}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-xs text-slate-500">
                      <div>
                        <p className="font-semibold text-charcoal-900">{acc.kit || "Unassigned"}</p>
                        <p>{acc.location}</p>
                      </div>
                      <div>
                        <p className="text-charcoal-900">{acc.stock} total</p>
                        <p>{acc.reserved} reserved</p>
                        <p className={`font-semibold ${spareClass}`}>{spare} spare</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 text-xs">
                      <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${conditionStyles[acc.condition] || "bg-slate-100 text-slate-600"}`}>
                        {acc.condition}
                      </span>
                      {acc.tags?.map((tag) => (
                        <span key={tag} className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] text-slate-600">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-500">
                      <span>Updated {formatDate(acc.updatedAt)}</span>
                      <div className="flex gap-2 text-xs">
                        <button className="rounded-md border border-slate-200 px-3 py-1 font-semibold text-slate-700" onClick={() => openModal(acc)}>
                          Edit
                        </button>
                        <button
                          className="rounded-md border border-amber-100 px-3 py-1 font-semibold text-amber-600"
                          onClick={() => toggleServiceFlag(acc.id)}
                        >
                          {acc.condition === "Needs Service" ? "Clear" : "Flag"}
                        </button>
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
                <h3 className="text-base font-semibold text-charcoal-900">Kit Availability</h3>
                <p className="text-xs text-slate-500">Live view of show-ready sets</p>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                {Object.keys(kitOverview).length}
              </span>
            </div>
            <ul className="mt-4 space-y-3">
              {Object.entries(kitOverview).map(([kit, info]) => {
                const spare = Math.max(info.items - info.reserved, 0);
                const percent = info.items ? Math.round(((info.items - spare) / info.items) * 100) : 0;
                return (
                  <li key={kit} className="rounded-xl border border-slate-100 p-3">
                    <div className="flex items-center justify-between text-sm font-semibold text-charcoal-900">
                      <span>{kit || "Unassigned"}</span>
                      <span>{spare} spare</span>
                    </div>
                    <div className="mt-2 h-2 rounded-full bg-slate-100">
                      <div className="h-full rounded-full bg-charcoal-900" style={{ width: `${percent}%` }} />
                    </div>
                    <p className="mt-1 text-xs text-slate-500">
                      {info.reserved} checked out • {info.items} total
                    </p>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-base font-semibold text-charcoal-900">Maintenance Tickets</h3>
            <p className="text-xs text-slate-500">Latest diagnostics</p>
            <ul className="mt-4 space-y-3 text-sm text-slate-600">
              <li className="rounded-xl bg-slate-50 p-3">
                <p className="font-semibold text-charcoal-900">RS4 gimbal drift</p>
                <p className="text-xs text-slate-500">Booked with MotionFix • ETA 12 Jan</p>
              </li>
              <li className="rounded-xl bg-slate-50 p-3">
                <p className="font-semibold text-charcoal-900">Pavotube cracked sleeve</p>
                <p className="text-xs text-slate-500">Awaiting spare diffuser</p>
              </li>
              <li className="rounded-xl bg-slate-50 p-3">
                <p className="font-semibold text-charcoal-900">Wireless mic foam replacements</p>
                <p className="text-xs text-slate-500">Bulk order queued</p>
              </li>
            </ul>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-base font-semibold text-charcoal-900">Run Sheet Notes</h3>
            <ul className="mt-3 space-y-3 text-xs text-slate-600">
              <li className="rounded-xl bg-slate-50 p-3">
                <p className="font-semibold text-charcoal-900">Charge cycle ritual</p>
                <p>Label charged batteries nightly with neon bands.</p>
              </li>
              <li className="rounded-xl bg-slate-50 p-3">
                <p className="font-semibold text-charcoal-900">Weatherproof bins</p>
                <p>Keep rain shells + silica gel inside Docu kits.</p>
              </li>
              <li className="rounded-xl bg-slate-50 p-3">
                <p className="font-semibold text-charcoal-900">QR tags</p>
                <p>Attach dynamic QR codes for quick check-outs.</p>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-4" onClick={() => setModalOpen(false)}>
          <div className="w-full max-w-3xl rounded-2xl bg-white p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-gold-500">Accessory</p>
                <h2 className="text-2xl font-semibold text-charcoal-900">{editingId ? "Edit Gear" : "Add Gear"}</h2>
              </div>
              <button className="text-slate-400 hover:text-slate-600" onClick={() => setModalOpen(false)}>
                ✕
              </button>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <Field label="Name" required>
                <input
                  value={form.name}
                  onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-gold-500 focus:ring-1 focus:ring-gold-500"
                />
              </Field>
              <Field label="Category">
                <select
                  value={form.category}
                  onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-gold-500 focus:ring-1 focus:ring-gold-500"
                >
                  <option>Lighting</option>
                  <option>Motion</option>
                  <option>Modifiers</option>
                  <option>Audio</option>
                  <option>Other</option>
                </select>
              </Field>
              <Field label="Assigned Kit">
                <input
                  value={form.kit}
                  onChange={(e) => setForm((prev) => ({ ...prev, kit: e.target.value }))}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-gold-500 focus:ring-1 focus:ring-gold-500"
                />
              </Field>
              <Field label="Location">
                <input
                  value={form.location}
                  onChange={(e) => setForm((prev) => ({ ...prev, location: e.target.value }))}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-gold-500 focus:ring-1 focus:ring-gold-500"
                />
              </Field>
              <Field label="Condition">
                <select
                  value={form.condition}
                  onChange={(e) => setForm((prev) => ({ ...prev, condition: e.target.value }))}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-gold-500 focus:ring-1 focus:ring-gold-500"
                >
                  <option>Excellent</option>
                  <option>Great</option>
                  <option>Fair</option>
                  <option>Needs Service</option>
                </select>
              </Field>
              <Field label="Stock" required>
                <input
                  type="number"
                  min={0}
                  value={form.stock}
                  onChange={(e) => setForm((prev) => ({ ...prev, stock: e.target.value }))}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-gold-500 focus:ring-1 focus:ring-gold-500"
                />
              </Field>
              <Field label="Reserved">
                <input
                  type="number"
                  min={0}
                  value={form.reserved}
                  onChange={(e) => setForm((prev) => ({ ...prev, reserved: e.target.value }))}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-gold-500 focus:ring-1 focus:ring-gold-500"
                />
              </Field>
              <div className="md:col-span-2">
                <Field label="Tags (comma separated)">
                  <input
                    value={form.tags}
                    onChange={(e) => setForm((prev) => ({ ...prev, tags: e.target.value }))}
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
                onClick={saveAccessory}
                disabled={isSaving}
              >
                {isSaving ? (
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

function Stat({ label, value, hint, accent }) {
  return (
    <div className={`rounded-2xl bg-gradient-to-br ${accent} to-white p-4 shadow-inner`}>
      <p className="text-xs uppercase tracking-[0.3em] text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-bold text-charcoal-900">{value}</p>
      <p className="text-xs text-slate-500">{hint}</p>
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

function formatDate(dateStr) {
  if (!dateStr) return "--";
  return new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short" }).format(new Date(dateStr));
}
