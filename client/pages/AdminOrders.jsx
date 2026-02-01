import React, { useEffect, useMemo, useState, useRef } from "react";
import { generatePDF } from "../utils/pdfGenerator";
import { Eye, FileText, Edit, Trash2, Download, Plus } from "lucide-react";
import PageHeader from "../components/PageHeader";

const emptyOrder = {
  name: "",
  whatsapp_no: "",
  email: "",
  event_name: "",
  photography_type: "",
  location: "",
  event_date: "",
  event_end_date: "",
  start_time: "",
  end_time: "",
  service: "",
  album_pages: "",
  amount: "",
  amount_paid: "",
  remaining_amount: "",
  deliverables: "",
  delivery_date: "",
  order_status: "Pending",
  notes: "",
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [form, setForm] = useState(emptyOrder);
  const [showDelete, setShowDelete] = useState(false);
  const [toDeleteOrder, setToDeleteOrder] = useState(null);
  const [showView, setShowView] = useState(false);
  const [viewOrder, setViewOrder] = useState(null);

  // Client autocomplete state
  const [clientSearch, setClientSearch] = useState("");
  const [showClientDropdown, setShowClientDropdown] = useState(false);

  /* New states for UI enhancements */
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showServiceDropdown, setShowServiceDropdown] = useState(false); // For service multi-select

  // Dropdown Ref
  const dropdownRef = useRef(null);

  useEffect(() => {
    fetchOrders();
    fetchClients();
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowServiceDropdown(false);
      }
    }
    if (showServiceDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showServiceDropdown]);

  const stats = useMemo(() => {
    const total = orders.length;
    const delivered = orders.filter((o) => o.order_status === "Delivered").length;
    const inProgress = orders.filter((o) => o.order_status === "In Progress").length;
    const pending = orders.filter((o) => o.order_status === "Pending").length;
    return { total, delivered, inProgress, pending };
  }, [orders]);

  const statusClass = (status) => {
    switch (status) {
      case "Pending":
        return "bg-amber-100 text-amber-700";
      case "In Progress":
        return "bg-blue-100 text-blue-700";
      case "Delivered":
        return "bg-emerald-100 text-emerald-700";
      case "Cancelled":
        return "bg-rose-100 text-rose-700";
      default:
        return "bg-slate-100 text-slate-600";
    }
  };

  async function fetchClients() {
    try {
      const res = await fetch("/api/clients");
      if (!res.ok) throw new Error("Failed to load clients");
      const data = await res.json();
      setClients(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching clients:", err);
    }
  }

  async function fetchOrders() {
    setLoading(true);
    try {
      const res = await fetch("/api/orders");
      if (!res.ok) throw new Error("Failed to load orders");
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }

  function openAdd() {
    setEditingOrder(null);
    setForm(emptyOrder);
    setClientSearch("");
    setShowForm(true);
  }

  function openEdit(order) {
    setEditingOrder(order);

    // Retrieve stashed data from serviceConfig if available (Legacy fallback)
    const stash = order.serviceConfig || {};

    // Normalize data from potentially old schema fields or the stash
    setForm({
      ...emptyOrder,
      ...order,
      name: order.name || order.customerName || stash.name || "",
      whatsapp_no: order.whatsapp_no || order.customerPhone || stash.whatsapp_no || "",
      email: order.email || stash.email || "",
      event_name: order.event_name || stash.event_name || "",
      location: order.location || stash.location || "",
      start_time: order.start_time || stash.start_time || "",
      end_time: order.end_time || stash.end_time || "",
      deliverables: order.deliverables || stash.deliverables || "",
      notes: order.notes || stash.notes || "",

      event_date: [order.event_date, order.date, stash.event_date].find(d => d)
        ? new Date(order.event_date || order.date || stash.event_date).toISOString().split("T")[0] : "",
      event_end_date: (order.event_end_date || stash.event_end_date)
        ? new Date(order.event_end_date || stash.event_end_date).toISOString().split("T")[0] : "",

      amount_paid: order.amount_paid ?? order.paidAmount ?? stash.amount_paid ?? "",
      remaining_amount: order.remaining_amount ?? stash.remaining_amount ?? "",

      order_status: order.order_status || order.status || stash.order_status || "Pending",
      photography_type: order.photography_type || order.photographyType || stash.photography_type || "",
      album_pages: order.album_pages || order.albumPages || stash.album_pages || "",
      service: order.service || stash.service || (Array.isArray(order.services) ? order.services.join(", ") : ""),

      delivery_date: (order.delivery_date || stash.delivery_date)
        ? new Date(order.delivery_date || stash.delivery_date).toISOString().split("T")[0] : "",
    });
    setClientSearch(order.name || order.customerName || stash.name || "");
    setShowForm(true);
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => {
      const updated = { ...f, [name]: value };
      if (name === "amount" || name === "amount_paid") {
        const total = parseFloat(updated.amount) || 0;
        const paid = parseFloat(updated.amount_paid) || 0;
        updated.remaining_amount = total - paid;
      }
      if (name === "deliverables") {
        const days = parseInt(value, 10);
        const baseDate = updated.event_end_date || updated.event_date;
        if (!isNaN(days) && days > 0 && baseDate) {
          const resultDate = new Date(baseDate);
          resultDate.setDate(resultDate.getDate() + days);
          updated.delivery_date = resultDate.toISOString().split("T")[0];
        }
      }
      return updated;
    });
  }

  function handleClientSearchChange(e) {
    const value = e.target.value;
    setClientSearch(value);
    setForm(f => ({ ...f, name: value }));
    setShowClientDropdown(true);
  }

  function selectClient(client) {
    setClientSearch(client.name);
    setForm(f => ({
      ...f,
      name: client.name,
      whatsapp_no: client.phone || f.whatsapp_no,
      email: client.email || f.email
    }));
    setShowClientDropdown(false);
  }

  async function saveOrder() {
    if (isSaving) return;

    if (!form.name || !form.whatsapp_no) {
      alert("Please provide name and WhatsApp number");
      return;
    }

    try {
      const method = editingOrder ? "PUT" : "POST";
      const url = editingOrder ? `/api/orders/${editingOrder._id}` : "/api/orders";

      const payload = { ...form };

      if (payload.name) payload.customerName = payload.name;
      if (payload.whatsapp_no) payload.customerPhone = payload.whatsapp_no;
      if (payload.event_date) payload.date = payload.event_date;

      const legacyStatusMap = {
        "In Progress": "Pending",
        "Delivered": "Completed"
      };
      if (payload.order_status) {
        payload.status = legacyStatusMap[payload.order_status] || payload.order_status;
      }
      if (payload.amount_paid) payload.paidAmount = payload.amount_paid;

      payload.serviceConfig = {
        email: form.email,
        event_name: form.event_name,
        photography_type: form.photography_type,
        location: form.location,
        start_time: form.start_time,
        end_time: form.end_time,
        service: form.service,
        album_pages: form.album_pages,
        amount_paid: form.amount_paid,
        remaining_amount: form.remaining_amount,
        notes: form.notes,
        deliverables: form.deliverables,
        delivery_date: form.delivery_date,
        name: form.name,
        whatsapp_no: form.whatsapp_no,
        order_status: form.order_status,
        event_date: form.event_date,
        event_end_date: form.event_end_date
      };

      if (payload.photography_type) payload.photographyType = payload.photography_type;
      if (payload.album_pages) payload.albumPages = payload.album_pages;

      if (payload.service) payload.services = payload.service.split(',').map(s => s.trim());

      ['amount', 'amount_paid', 'remaining_amount', 'event_date', 'event_end_date', 'delivery_date', 'date', 'paidAmount'].forEach(field => {
        if (payload[field] === "") payload[field] = null;
      });

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "Failed to save order");
      }

      await fetchOrders();
      setShowForm(false);
      setEditingOrder(null);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setIsSaving(false);
    }
  }

  function confirmDelete(order) {
    setToDeleteOrder(order);
    setShowDelete(true);
  }

  async function doDelete() {
    if (!toDeleteOrder) return;
    try {
      const res = await fetch(`/api/orders/${toDeleteOrder._id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      setShowDelete(false);
      setToDeleteOrder(null);
      await fetchOrders();
    } catch (err) {
      console.error(err);
      alert("Could not delete order");
    }
  }

  function openView(order) {
    setViewOrder(order);
    setShowView(true);
  }

  async function downloadReceipt(order) {
    const businessName = "The Patil Photography";
    const logoHtml = `<div style="width: 50px; height: 50px; background: linear-gradient(135deg, #d4a574, #c49561); border-radius: 8px; display: flex; align-items: center; justify-content: center;"><span style="color: white; font-weight: bold; font-size: 20px;">P</span></div>`;

    const paid = parseFloat(order.amount_paid) || parseFloat(order.paidAmount) || 0;
    const total = parseFloat(order.amount) || 0;
    const remaining = total - paid;
    const eventDate = order.event_date || order.date ? new Date(order.event_date || order.date).toLocaleDateString() : "N/A";

    const content = `
      <div style="font-family: 'Playfair Display', serif; padding: 40px; background: white; color: #1a1a1a;">
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 40px; border-bottom: 3px solid #d4a574; padding-bottom: 20px;">
          <div style="display: flex; justify-content: center; align-items: center; gap: 15px; margin-bottom: 15px;">
            ${logoHtml}
            <div>
              <h1 style="margin: 0; font-size: 28px; font-weight: bold; color: #1a1a1a;">${businessName}</h1>
            </div>
          </div>
          <h2 style="font-size: 24px; font-weight: bold; margin: 20px 0 0 0; color: #1a1a1a;">PAYMENT RECEIPT</h2>
        </div>

        <!-- Receipt Details -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 30px;">
          <div>
            <h3 style="color: #d4a574; font-size: 12px; font-weight: bold; margin-bottom: 10px;">CLIENT DETAILS</h3>
            <p style="margin: 0; font-size: 16px; font-weight: bold;">${order.name || order.customerName}</p>
            <p style="margin: 5px 0; font-size: 12px;">${order.email || ""}</p>
            <p style="margin: 5px 0; font-size: 12px;">${order.whatsapp_no || order.customerPhone || ""}</p>
          </div>
          <div style="text-align: right;">
            <p style="margin: 5px 0; font-size: 12px;"><strong>Order ID:</strong> #${order._id.slice(-6).toUpperCase()}</p>
            <p style="margin: 5px 0; font-size: 12px;"><strong>Receipt Date:</strong> ${new Date().toLocaleDateString()}</p>
            <p style="margin: 5px 0; font-size: 12px;"><strong>Event:</strong> ${order.event_name || "-"}</p>
            <p style="margin: 5px 0; font-size: 12px;"><strong>Event Date:</strong> ${eventDate}</p>
          </div>
        </div>

        <!-- Financial Summary Table -->
         <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
          <thead>
            <tr style="background: #2d2d2d; color: white;">
              <th style="padding: 12px; text-align: left; border: 1px solid #d4a574;">Description</th>
              <th style="padding: 12px; text-align: right; border: 1px solid #d4a574;">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr style="border: 1px solid #e5e5e5;">
              <td style="padding: 12px; border: 1px solid #e5e5e5;">Total Project Value (${order.photography_type || "Service"})</td>
              <td style="padding: 12px; text-align: right; border: 1px solid #e5e5e5;">₹${total.toLocaleString()}</td>
            </tr>
             <tr style="border: 1px solid #e5e5e5;">
              <td style="padding: 12px; border: 1px solid #e5e5e5;">Amount Received</td>
              <td style="padding: 12px; text-align: right; border: 1px solid #e5e5e5; font-weight: bold; color: green;">₹${paid.toLocaleString()}</td>
            </tr>
          </tbody>
        </table>

         <!-- Summary / Balance -->
        <div style="display: flex; justify-content: flex-end; margin-bottom: 30px;">
          <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; width: 300px;">
             <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 8px;">
              <span>Total Amount:</span>
              <span>₹${total.toLocaleString()}</span>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 8px;">
              <span>Paid Amount:</span>
              <span>₹${paid.toLocaleString()}</span>
            </div>
             <div style="border-top: 2px solid #d4a574; padding-top: 8px; display: flex; justify-content: space-between; font-weight: bold; font-size: 14px; color: #d4a574;">
              <span>Balance Due:</span>
              <span>₹${remaining > 0 ? remaining.toLocaleString() : "0 (Fully Paid)"}</span>
            </div>
          </div>
        </div>

        <!-- Footer -->
         <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; text-align: center; margin-bottom: 30px;">
          <p style="margin: 0; font-size: 12px; line-height: 1.6; font-style: italic;">Thank you for trusting us with your memories!</p>
        </div>
      </div>
    `;

    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = content;
    tempDiv.id = "pdf-content";
    tempDiv.style.position = "absolute";
    tempDiv.style.left = "-9999px";
    tempDiv.style.width = "794px";
    document.body.appendChild(tempDiv);

    try {
      await generatePDF("pdf-content", `Receipt_${(order.name || "Order").replace(/\s+/g, '_')}.pdf`);
    } finally {
      document.body.removeChild(tempDiv);
    }
  }

  const [photographyTypes, setPhotographyTypes] = useState(() => {
    const saved = localStorage.getItem("photographyTypes");
    return saved ? JSON.parse(saved) : ["Wedding", "Pre-Wedding", "Baby Shower", "Birthday", "Corporate"];
  });
  const [serviceTypes, setServiceTypes] = useState(() => {
    const saved = localStorage.getItem("serviceTypes");
    return saved ? JSON.parse(saved) : ["Cinematic", "Candid", "Traditional", "Drone"];
  });

  const [showTypeModal, setShowTypeModal] = useState(false);
  const [showServiceModal, setShowServiceModal] = useState(false);

  const [newType, setNewType] = useState("");
  const [newService, setNewService] = useState("");

  function addNewType() {
    if (!newType.trim()) return;
    if (photographyTypes.includes(newType.trim())) {
      alert("Type already exists");
      return;
    }
    const updated = [...photographyTypes, newType.trim()];
    setPhotographyTypes(updated);
    localStorage.setItem("photographyTypes", JSON.stringify(updated));
    setForm((f) => ({ ...f, photography_type: newType.trim() }));
    setNewType("");
    setShowTypeModal(false);
  }

  function addNewService() {
    if (!newService.trim()) return;
    if (serviceTypes.includes(newService.trim())) {
      alert("Service already exists");
      return;
    }
    const updated = [...serviceTypes, newService.trim()];
    setServiceTypes(updated);
    localStorage.setItem("serviceTypes", JSON.stringify(updated));
    setNewService("");
    setShowServiceModal(false);
  }

  function handleServiceChange(e) {
    const { value, checked } = e.target;
    let current = form.service ? form.service.split(",").map(s => s.trim()).filter(Boolean) : [];

    if (checked) {
      if (!current.includes(value)) current.push(value);
    } else {
      current = current.filter(item => item !== value);
    }

    setForm(f => ({ ...f, service: current.join(", ") }));
  }

  return (
    <section className="mt-4 container mx-auto p-4">
      <PageHeader
        title="Orders"
        description="Monitor bookings, payment progress, and delivery milestones."
        action={
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-6 py-2.5 text-sm font-semibold text-white shadow-lg hover:bg-gray-800 transition-all"
            onClick={openAdd}
          >
            <Plus size={18} />
            Add Order
          </button>
        }
      />

      <div className="grid gap-4 md:grid-cols-4 mb-4">
        <SummaryCard label="Total" value={stats.total} accent="from-amber-100 to-white" />
        <SummaryCard label="In Progress" value={stats.inProgress} accent="from-blue-100 to-white" />
        <SummaryCard label="Pending" value={stats.pending} accent="from-orange-100 to-white" />
        <SummaryCard label="Delivered" value={stats.delivered} accent="from-emerald-100 to-white" />
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
          <h2 className="text-lg font-semibold text-charcoal-900">Manage Orders</h2>
          <p className="text-xs text-slate-500">Last updated {new Date().toLocaleDateString()}</p>
        </div>

        {/* Mobile Card View */}
        <div className="block md:hidden">
          {loading ? (
            <div className="p-8 text-center text-slate-500">Loading orders...</div>
          ) : orders.length === 0 ? (
            <div className="p-8 text-center text-slate-500">No orders found</div>
          ) : (
            <div className="divide-y divide-slate-100">
              {orders.map((order) => {
                const total = parseFloat(order.amount) || 0;
                const paid = parseFloat(order.amount_paid) || parseFloat(order.paidAmount) || 0;
                const remaining = total - paid;
                return (
                  <div key={order._id} className="p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-charcoal-900">{order.name || order.customerName}</h3>
                        <p className="text-sm text-slate-500">{order.event_name || "-"}</p>
                      </div>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusClass(order.order_status || order.status)}`}>
                        {order.order_status || order.status || "Pending"}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-xs text-slate-400 block">Date</span>
                        <span className="text-slate-700">
                          {order.event_date
                            ? new Date(order.event_date).toLocaleDateString()
                            : order.date ? new Date(order.date).toLocaleDateString() : "--"
                          }
                        </span>
                      </div>
                      <div>
                        <span className="text-xs text-slate-400 block">Amount</span>
                        <span className="text-slate-700">{order.amount?.toLocaleString ? `₹${order.amount.toLocaleString()}` : order.amount}</span>
                      </div>
                      <div>
                        <span className="text-xs text-slate-400 block">Remaining</span>
                        <span className={`${remaining > 0 ? "text-rose-600 font-medium" : "text-slate-500"}`}>
                          {remaining > 0 ? `₹${remaining.toLocaleString()}` : "-"}
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <button className="p-2 text-slate-500 hover:bg-slate-50 rounded" onClick={() => openView(order)}><Eye size={18} /></button>
                      <button className="p-2 text-slate-500 hover:bg-slate-50 rounded" onClick={() => downloadReceipt(order)}><Download size={18} /></button>
                      <button className="p-2 text-slate-500 hover:bg-slate-50 rounded" onClick={() => openEdit(order)}><Edit size={18} /></button>
                      <button className="p-2 text-rose-500 hover:bg-rose-50 rounded" onClick={() => confirmDelete(order)}><Trash2 size={18} /></button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Client</th>
                <th className="px-4 py-3 text-left font-semibold">Event</th>
                <th className="px-4 py-3 text-left font-semibold">Date</th>
                <th className="px-4 py-3 text-left font-semibold">Amount</th>
                <th className="px-4 py-3 text-left font-semibold">Remaining</th>
                <th className="px-4 py-3 text-left font-semibold">Status</th>
                <th className="px-4 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={10} className="px-4 py-16 text-center text-slate-500">
                    Loading orders...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-4 py-16 text-center text-slate-500">
                    No orders found
                  </td>
                </tr>
              ) : (
                orders.map((order) => {
                  const total = parseFloat(order.amount) || 0;
                  const paid = parseFloat(order.amount_paid) || parseFloat(order.paidAmount) || 0;
                  const remaining = total - paid;
                  return (
                    <tr key={order._id} className="odd:bg-white even:bg-slate-50 hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 font-semibold text-charcoal-900">{order.name || order.customerName}</td>
                      <td className="px-4 py-3">{order.event_name || "-"}</td>
                      <td className="px-4 py-3 text-slate-500">
                        {order.event_date
                          ? new Date(order.event_date).toLocaleDateString()
                          : order.date ? new Date(order.date).toLocaleDateString() : "--"
                        }
                      </td>
                      <td className="px-4 py-3 font-medium text-charcoal-900">
                        {order.amount?.toLocaleString ? `₹${order.amount.toLocaleString()}` : order.amount}
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {remaining > 0 ? `₹${remaining.toLocaleString()}` : "-"}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${statusClass(order.order_status || order.status)}`}>
                          {order.order_status || order.status || "Pending"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="inline-flex gap-2 justify-end">
                          <button
                            className="p-1.5 rounded-md text-slate-500 hover:bg-white hover:text-gold-500 transition-colors"
                            onClick={() => openView(order)}
                            title="View Details"
                          >
                            <Eye size={18} />
                          </button>
                          <button
                            className="p-1.5 rounded-md text-slate-500 hover:bg-white hover:text-blue-600 transition-colors"
                            onClick={() => downloadReceipt(order)}
                            title="Download Receipt"
                          >
                            <Download size={18} />
                          </button>
                          <button
                            className="p-1.5 rounded-md text-slate-500 hover:bg-white hover:text-green-600 transition-colors"
                            onClick={() => openEdit(order)}
                            title="Edit"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            className="p-1.5 rounded-md text-slate-500 hover:bg-white hover:text-rose-600 transition-colors"
                            onClick={() => confirmDelete(order)}
                            title="Delete"
                          >
                            <Trash2 size={18} />
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
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm" onClick={() => setShowForm(false)}>
          <div className="flex flex-col w-full max-w-5xl max-h-[90vh] rounded-2xl bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>

            {/* Header */}
            <div className="flex shrink-0 items-center justify-between border-b border-slate-200 px-6 py-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-gold-500">Order</p>
                <h2 className="text-2xl font-semibold text-charcoal-900">
                  {editingOrder ? "Edit Order" : "Add New Order"}
                </h2>
              </div>
              <button
                className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                onClick={() => setShowForm(false)}
              >
                ✕
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="flex-1 overflow-y-auto px-6 py-6 custom-scrollbar">
              <div className="grid gap-5 md:grid-cols-2">
                <FormField label="Name" required>
                  <div className="relative">
                    <input
                      type="text"
                      value={clientSearch}
                      onChange={handleClientSearchChange}
                      onFocus={() => setShowClientDropdown(true)}
                      onBlur={() => setTimeout(() => setShowClientDropdown(false), 200)}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none"
                      placeholder="Search for a client..."
                      autoComplete="off"
                    />
                    {showClientDropdown && (
                      <div className="absolute z-10 mt-1 max-h-48 w-full overflow-y-auto rounded-md border border-slate-200 bg-white shadow-lg">
                        {clients
                          .filter(c => c.name.toLowerCase().includes(clientSearch.toLowerCase()))
                          .map(client => (
                            <div
                              key={client._id}
                              className="cursor-pointer px-3 py-2 text-sm hover:bg-slate-50 text-slate-700"
                              onMouseDown={(e) => { e.preventDefault(); selectClient(client); }}
                            >
                              <div className="font-medium">{client.name}</div>
                              <div className="text-xs text-slate-500">{client.email}</div>
                            </div>
                          ))}
                        {clients.filter(c => c.name.toLowerCase().includes(clientSearch.toLowerCase())).length === 0 && (
                          <div className="px-3 py-2 text-sm text-slate-400">No matching clients</div>
                        )}
                      </div>
                    )}
                  </div>
                </FormField>
                <FormField label="WhatsApp No." required>
                  <input
                    name="whatsapp_no"
                    value={form.whatsapp_no}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none"
                  />
                </FormField>
                <FormField label="Email">
                  <input
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none"
                  />
                </FormField>

                <FormField label="Photography Type" required>
                  <div className="flex gap-2">
                    <select
                      name="photography_type"
                      value={form.photography_type}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none bg-white"
                    >
                      <option value="">Choose type</option>
                      {photographyTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => setShowTypeModal(true)}
                      className="shrink-0 rounded-lg border border-gold-200 bg-gold-50 px-3 text-gold-600 hover:bg-gold-100"
                      title="Add new type"
                    >
                      +
                    </button>
                  </div>
                </FormField>
                <FormField label="Location" required>
                  <input
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none"
                  />
                </FormField>
                <div className="grid grid-cols-2 gap-3">
                  <FormField label="Start Date" required>
                    <input
                      type="date"
                      name="event_date"
                      value={form.event_date}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none"
                    />
                  </FormField>
                  <FormField label="End Date">
                    <input
                      type="date"
                      name="event_end_date"
                      value={form.event_end_date}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none"
                    />
                  </FormField>
                </div>

                <FormField label="Service" required>
                  <div className="relative" ref={dropdownRef}>
                    <button
                      type="button"
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-left focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none bg-white flex justify-between items-center"
                      onClick={() => setShowServiceDropdown(!showServiceDropdown)}
                    >
                      <span className={form.service ? "text-slate-900" : "text-slate-400"}>
                        {form.service || "Select services..."}
                      </span>
                      <span className="text-slate-400">▼</span>
                    </button>
                    {showServiceDropdown && (
                      <div className="absolute z-20 mt-1 w-full rounded-md border border-slate-200 bg-white shadow-xl max-h-60 overflow-y-auto">
                        <div className="p-2 space-y-1">
                          {serviceTypes.map((svc) => (
                            <label key={svc} className="flex items-center gap-2 p-2 hover:bg-slate-50 rounded cursor-pointer">
                              <input
                                type="checkbox"
                                value={svc}
                                checked={(form.service || "").split(", ").map(s => s.trim()).includes(svc)}
                                onChange={handleServiceChange}
                                className="h-4 w-4 rounded border-slate-300 text-gold-500 focus:ring-gold-500"
                              />
                              <span className="text-sm text-slate-700">{svc}</span>
                            </label>
                          ))}
                        </div>
                        <div className="border-t border-slate-100 p-2">
                          <button
                            type="button"
                            onClick={() => { setShowServiceModal(true); setShowServiceDropdown(false); }}
                            className="w-full text-left px-2 py-1 text-xs font-semibold text-gold-600 hover:text-gold-700 hover:bg-gold-50 rounded"
                          >
                            + Add New Service
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </FormField>
                <FormField label="Album Pages">
                  <textarea
                    name="album_pages"
                    value={form.album_pages}
                    onChange={handleChange}
                    rows="1"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none"
                    placeholder="Enter pages..."
                  />
                </FormField>
                <FormField label="Amount" required>
                  <input
                    type="number"
                    name="amount"
                    value={form.amount}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none"
                  />
                </FormField>
                <div className="grid grid-cols-2 gap-3">
                  <FormField label="Paid" required>
                    <input
                      type="number"
                      name="amount_paid"
                      value={form.amount_paid}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none"
                    />
                  </FormField>
                  <FormField label="Remaining" required>
                    <input
                      type="number"
                      name="remaining_amount"
                      value={form.remaining_amount}
                      readOnly
                      className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500 cursor-not-allowed"
                    />
                  </FormField>
                </div>
                <FormField label="Deliverables">
                  <input
                    name="deliverables"
                    value={form.deliverables}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none"
                  />
                </FormField>
                <FormField label="Delivery Date">
                  <input
                    type="date"
                    name="delivery_date"
                    value={form.delivery_date}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none"
                  />
                </FormField>
                <FormField label="Order Status">
                  <select
                    name="order_status"
                    value={form.order_status}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none bg-white"
                  >
                    <option value="">Select status</option>
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </FormField>
                <div className="md:col-span-2">
                  <FormField label="Notes">
                    <textarea
                      name="notes"
                      value={form.notes}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none"
                      rows={3}
                    />
                  </FormField>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex shrink-0 justify-end gap-3 border-t border-slate-200 px-6 py-4">
              <button
                className="rounded-md border border-slate-200 px-4 py-2 text-sm hover:bg-slate-50 transition-colors"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
              <button
                className="rounded-md bg-gold-500 px-4 py-2 text-sm font-semibold text-white hover:bg-gold-600 transition-colors shadow-sm flex items-center gap-2"
                onClick={saveOrder}
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    Saving...
                  </>
                ) : "Save Order"}
              </button>
            </div>
          </div>
        </div>
      )
      }

      {
        showDelete && (
          <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-4" onClick={() => setShowDelete(false)}>
            <div className="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar" onClick={(e) => e.stopPropagation()}>
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rose-50 text-3xl text-rose-500">
                !
              </div>
              <h3 className="mt-4 text-lg font-semibold text-charcoal-900">Delete this order?</h3>
              <p className="mt-2 text-sm text-slate-500">
                This action cannot be undone. {toDeleteOrder?.name && `Order: ${toDeleteOrder.name}`}
              </p>
              <div className="mt-6 flex justify-center gap-3">
                <button className="rounded-md border border-slate-200 px-4 py-2 text-sm" onClick={() => setShowDelete(false)}>
                  Cancel
                </button>
                <button className="rounded-md bg-rose-500 px-4 py-2 text-sm font-semibold text-white" onClick={doDelete}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        )
      }

      {/* Add Type Modal */}
      {
        showTypeModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4" onClick={() => setShowTypeModal(false)}>
            <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl max-h-[90vh] overflow-y-auto custom-scrollbar" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-lg font-semibold text-charcoal-900">Add New Type</h3>
              <p className="mt-1 text-xs text-slate-500">Enter a new photography type to add to the list.</p>
              <div className="mt-4">
                <label className="block text-sm font-medium text-slate-700">Type Name</label>
                <input
                  type="text"
                  value={newType}
                  onChange={(e) => setNewType(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-gold-500 focus:ring-1 focus:ring-gold-500"
                  placeholder="e.g. Birthday, Corporate"
                  autoFocus
                />
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  className="rounded-md border border-slate-200 px-4 py-2 text-sm hover:bg-slate-50"
                  onClick={() => setShowTypeModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="rounded-md bg-gold-500 px-4 py-2 text-sm font-semibold text-white hover:bg-gold-600"
                  onClick={addNewType}
                >
                  Add Type
                </button>
              </div>
            </div>
          </div>
        )
      }

      {/* Add Service Modal */}
      {
        showServiceModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4" onClick={() => setShowServiceModal(false)}>
            <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl max-h-[90vh] overflow-y-auto custom-scrollbar" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-lg font-semibold text-charcoal-900">Add New Service</h3>
              <p className="mt-1 text-xs text-slate-500">Enter a new service name to add to the checklist.</p>
              <div className="mt-4">
                <label className="block text-sm font-medium text-slate-700">Service Name</label>
                <input
                  type="text"
                  value={newService}
                  onChange={(e) => setNewService(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-gold-500 focus:ring-1 focus:ring-gold-500"
                  placeholder="e.g. Drone, Live Streaming"
                  autoFocus
                />
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  className="rounded-md border border-slate-200 px-4 py-2 text-sm hover:bg-slate-50"
                  onClick={() => setShowServiceModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="rounded-md bg-gold-500 px-4 py-2 text-sm font-semibold text-white hover:bg-gold-600"
                  onClick={addNewService}
                >
                  Add Service
                </button>
              </div>
            </div>
          </div>
        )
      }
      {/* View Order Modal */}
      {
        showView && viewOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm" onClick={() => setShowView(false)}>
            <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl overflow-hidden max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
              <div className="flex shrink-0 items-center justify-between border-b border-slate-200 px-6 py-4 bg-slate-50">
                <h3 className="text-xl font-semibold text-charcoal-900">Order Details</h3>
                <button
                  className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-200 transition-colors"
                  onClick={() => setShowView(false)}
                >
                  ✕
                </button>
              </div>

              <div className="p-6 overflow-y-auto custom-scrollbar space-y-6">
                {/* Event Info */}
                <div>
                  <h4 className="text-sm uppercase tracking-wider text-gold-500 font-semibold mb-3">Event Information</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="block text-slate-500 text-xs">Client Name</span>
                      <span className="font-medium text-slate-900">{viewOrder.name || viewOrder.customerName}</span>
                    </div>

                    <div>
                      <span className="block text-slate-500 text-xs">Date</span>
                      <span className="font-medium text-slate-900">
                        {viewOrder.event_date || viewOrder.date ? new Date(viewOrder.event_date || viewOrder.date).toLocaleDateString() : "-"}
                      </span>
                    </div>

                    <div>
                      <span className="block text-slate-500 text-xs">Location</span>
                      <span className="font-medium text-slate-900">{viewOrder.location || "-"}</span>
                    </div>
                    <div>
                      <span className="block text-slate-500 text-xs">Photography Type</span>
                      <span className="font-medium text-slate-900">{viewOrder.photography_type || viewOrder.photographyType || "-"}</span>
                    </div>
                  </div>
                </div>

                {/* Contact & Service */}
                <div className="border-t border-slate-100 pt-4">
                  <h4 className="text-sm uppercase tracking-wider text-gold-500 font-semibold mb-3">Contact & Services</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="block text-slate-500 text-xs">WhatsApp</span>
                      <span className="font-medium text-slate-900">{viewOrder.whatsapp_no || viewOrder.customerPhone || "-"}</span>
                    </div>
                    <div>
                      <span className="block text-slate-500 text-xs">Email</span>
                      <span className="font-medium text-slate-900">{viewOrder.email || "-"}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="block text-slate-500 text-xs">Services Included</span>
                      <span className="font-medium text-slate-900">{viewOrder.service || (Array.isArray(viewOrder.services) ? viewOrder.services.join(", ") : "-")}</span>
                    </div>
                    <div>
                      <span className="block text-slate-500 text-xs">Album Pages</span>
                      <span className="font-medium text-slate-900">{viewOrder.album_pages || viewOrder.albumPages || "-"}</span>
                    </div>
                    <div>
                      <span className="block text-slate-500 text-xs">Deliverables</span>
                      <span className="font-medium text-slate-900">{viewOrder.deliverables || "-"}</span>
                    </div>
                  </div>
                </div>

                {/* Financials */}
                <div className="border-t border-slate-100 pt-4">
                  <h4 className="text-sm uppercase tracking-wider text-gold-500 font-semibold mb-3">Financials</h4>
                  <div className="grid grid-cols-3 gap-4 text-sm bg-slate-50 p-4 rounded-lg">
                    <div>
                      <span className="block text-slate-500 text-xs">Total Amount</span>
                      <span className="font-bold text-slate-900">₹{parseFloat(viewOrder.amount || 0).toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="block text-slate-500 text-xs">Paid</span>
                      <span className="font-bold text-emerald-600">₹{(parseFloat(viewOrder.amount_paid) || parseFloat(viewOrder.paidAmount) || 0).toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="block text-slate-500 text-xs">Remaining</span>
                      <span className={`font-bold ${(parseFloat(viewOrder.amount || 0) - (parseFloat(viewOrder.amount_paid) || parseFloat(viewOrder.paidAmount) || 0)) > 0 ? "text-rose-600" : "text-slate-400"}`}>
                        ₹{(parseFloat(viewOrder.amount || 0) - (parseFloat(viewOrder.amount_paid) || parseFloat(viewOrder.paidAmount) || 0)).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                {viewOrder.notes && (
                  <div className="border-t border-slate-100 pt-4">
                    <h4 className="text-sm uppercase tracking-wider text-gold-500 font-semibold mb-2">Notes</h4>
                    <p className="text-sm text-slate-700 bg-amber-50 p-3 rounded-md">{viewOrder.notes}</p>
                  </div>
                )}
              </div>

              <div className="flex shrink-0 justify-end gap-3 border-t border-slate-200 px-6 py-4 bg-slate-50">
                <button
                  className="flex items-center gap-2 rounded-md border border-slate-200 px-4 py-2 text-sm hover:bg-white text-slate-700 transition-colors"
                  onClick={() => downloadReceipt(viewOrder)}
                >
                  <Download size={16} /> Download Receipt
                </button>
                <button
                  className="rounded-md bg-gold-500 px-4 py-2 text-sm font-semibold text-white hover:bg-gold-600 transition-colors"
                  onClick={() => openEdit(viewOrder)}
                >
                  Edit Order
                </button>
              </div>

            </div>
          </div>
        )
      }

    </section >
  );
}

function SummaryCard({ label, value, accent }) {
  return (
    <div className={`rounded-2xl bg-gradient-to-br ${accent} p-4 shadow-inner`}>
      <p className="text-xs uppercase tracking-[0.3em] text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-bold text-charcoal-900">{value}</p>
    </div>
  );
}

function FormField({ label, children, required }) {
  return (
    <label className="block text-sm font-medium text-slate-700">
      {label}
      {required && <span className="text-rose-500"> *</span>}
      <div className="mt-1">{children}</div>
    </label>
  );
}
