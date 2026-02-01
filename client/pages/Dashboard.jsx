
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  CreditCard,
  Users,
  Image,
  Film,
  MessageSquare,
  Calendar,
  ArrowRight,
  AlertCircle,
  CheckCircle,
  Plus,
  TrendingUp,
  Clock,
  X,
  Star,
  PieChart as PieIcon,
  BarChart as BarChartIcon,
  Activity
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { format, isSameDay } from "date-fns";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import "../Calendar.css"; // Reuse gold/charcoal theme
import PageHeader from "../components/PageHeader";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTestimonial, setSelectedTestimonial] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/dashboard/stats");
        if (!res.ok) throw new Error("Failed to load stats");
        const json = await res.json();
        setData(json);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-charcoal-900" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-rose-500">
        <AlertCircle className="mx-auto h-8 w-8 mb-2" />
        <p>Error loading dashboard: {error}</p>
      </div>
    );
  }

  const {
    kpi,
    actionRequired,
    pipeline,
    schedule,
    revenue,
    activityFeed,
    ordersByType,
    contentHealth
  } = data;

  // Derive specialized stats
  const totalPipelineValue = "₹" + (revenue.totalOutstanding / 100000).toFixed(1) + "L";
  const collectedThisMonth = "₹" + (revenue.thisMonthCollected / 100000).toFixed(1) + "L";

  const handleApproveTestimonial = async (id) => {
    try {
      await fetch(`/api/testimonials/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Active" }),
      });
      // Refresh stats
      const res = await fetch("/api/dashboard/stats");
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error("Error approving testimonial:", err);
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-50 text-charcoal-900 pb-20">

      {/* Header & Quick Actions */}
      <header className="mb-8 space-y-6 mt-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-charcoal-900">Studio Oversight</h1>
            <p className="text-slate-500">Welcome back. Here's what's happening today.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <QuickAction to="/orders" label="New Order" icon={Plus} />
            <QuickAction to="/quotations" label="Create Quote" icon={Plus} />
            <QuickAction to="/invoices" label="New Invoice" icon={Plus} />
            <QuickAction to="/enquiries" label="Add Enquiry" icon={Plus} />
          </div>
        </div>

        {/* Action Required Section */}
        {(actionRequired.enquiriesNoReply.length > 0 || actionRequired.overdueInvoices.length > 0) && (
          <div className="rounded-2xl border border-rose-100 bg-rose-50/50 p-4">
            <div className="mb-3 flex items-center gap-2 text-rose-700">
              <AlertCircle className="h-5 w-5" />
              <h3 className="font-semibold">Action Required</h3>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {actionRequired.enquiriesNoReply.map(e => (
                <Link key={e._id} to="/enquiries" className="flex items-center justify-between rounded-xl bg-white p-3 text-sm shadow-sm ring-1 ring-rose-100 transition hover:ring-rose-200">
                  <span className="truncate font-medium text-charcoal-900">Reply to {e.names?.split('&')[0] || e.groomName}</span>
                  <span className="text-xs text-rose-500">Overdue</span>
                </Link>
              ))}
              {actionRequired.overdueInvoices.map(i => (
                <Link key={i._id} to="/invoices" className="flex items-center justify-between rounded-xl bg-white p-3 text-sm shadow-sm ring-1 ring-rose-100 transition hover:ring-rose-200">
                  <span className="truncate font-medium text-charcoal-900">INV {i.invoiceNumber} Due</span>
                  <span className="text-xs text-rose-500">₹{i.grandTotal}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
        <KpiCard label="New Enquiries" value={kpi.newEnquiriesWeek} sub={`+${kpi.newEnquiriesToday} today`} icon={MessageSquare} />
        <KpiCard label="Active Orders" value={kpi.newOrdersCount} sub="This month" icon={Calendar} />
        <KpiCard label="Pending Quotes" value={kpi.pendingQuotations} sub="Drafts & Sent" icon={Users} />
        <KpiCard label="Unpaid Invoices" value={kpi.unpaidInvoicesCount} sub={`Total ₹${(kpi.unpaidInvoicesAmount / 1000).toFixed(0)}k`} icon={CreditCard} accent />
        <KpiCard label="Shoots This Week" value={kpi.upcomingShootsCount} sub="Next 7 days" icon={Film} />
        <KpiCard label="Unread Messages" value={kpi.unreadMessages} sub="Contact forms" icon={MessageSquare} />
        <Link to="/testimonials" className="block">
          <KpiCard label="Testimonials" value={kpi.pendingTestimonials} sub="Pending review" icon={CheckCircle} />
        </Link>
      </div>

      {/* Analytics Charts */}
      {data.charts && (
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">

          {/* Revenue Trend */}
          <div className="h-max md:col-span-2 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-charcoal-900">Revenue Performance</h2>
                <p className="text-sm text-slate-500">Billed vs Collected (Last 6 Months)</p>
              </div>
              <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
                <BarChartIcon className="h-5 w-5" />
              </div>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={formatMonthlyData(data.charts.monthlyRevenue)}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#64748b', fontSize: 12 }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#64748b', fontSize: 12 }}
                    tickFormatter={(value) => `₹${value / 1000}k`}
                  />
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    cursor={{ fill: '#f1f5f9' }}
                    formatter={(value) => [`₹${value.toLocaleString()}`, undefined]}
                  />
                  <Legend wrapperStyle={{ paddingTop: '20px' }} />
                  <Bar
                    name="Billed"
                    dataKey="total"
                    fill="#1e293b"
                    radius={[4, 4, 0, 0]}
                    barSize={20}
                  />
                  <Bar
                    name="Collected"
                    dataKey="collected"
                    fill="#10b981"
                    radius={[4, 4, 0, 0]}
                    barSize={20}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Order Trend & Invoice Status */}
          <div className="space-y-8">
            {/* Orders Trend */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-charcoal-900">Order Growth</h2>
                  <p className="text-sm text-slate-500">New bookings per month</p>
                </div>
                <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600">
                  <Activity className="h-5 w-5" />
                </div>
              </div>
              <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={formatMonthlyData(data.charts.monthlyOrders)}>
                    <defs>
                      <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10 }} />
                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Area
                      type="monotone"
                      dataKey="count"
                      stroke="#6366f1"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorOrders)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Invoice Status */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-charcoal-900">Invoice Status</h2>
                  <p className="text-sm text-slate-500">By value</p>
                </div>
                <div className="rounded-lg bg-rose-50 p-2 text-rose-600">
                  <PieIcon className="h-5 w-5" />
                </div>
              </div>
              <div className="h-[200px] w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data.charts.invoiceStatus}
                      dataKey="value"
                      nameKey="_id"
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                    >
                      {data.charts.invoiceStatus.map((entry, index) => {
                        const colors = {
                          'Paid': '#10b981', // Emerald
                          'Pending': '#f59e0b', // Amber
                          'Overdue': '#ef4444', // Rose
                          'Draft': '#94a3b8'  // Slate
                        };
                        return <Cell key={`cell-${index}`} fill={colors[entry._id] || '#cbd5e1'} />;
                      })}
                    </Pie>
                    <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '12px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-8 grid gap-8 lg:grid-cols-[2fr,1fr]">

        {/* Main Content Column */}
        <div className="space-y-8">

          {/* Upcoming Schedule & Mini Calendar */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col h-[500px]">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-charcoal-900">Schedule</h2>
              <Link to="/admin-calendar" className="flex items-center text-sm font-medium text-gold-600 hover:text-gold-700">
                Full Calendar <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>

            <div className="flex flex-col xl:flex-row gap-6 h-full overflow-hidden">
              {/* Mini Calendar Widget */}
              <div className="shrink-0 flex justify-center xl:justify-start">
                <DayPicker
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  modifiers={{
                    booked: (date) => schedule.some(evt => isSameDay(new Date(evt.event_date), date)),
                  }}
                  modifiersClassNames={{
                    booked: "bg-gold-100 text-gold-700 font-bold rounded-full",
                  }}
                  className="border border-slate-100 rounded-xl p-4 shadow-sm"
                />
              </div>

              {/* Events List for Selected Date or Upcoming */}
              <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-3">
                  {selectedDate ? format(selectedDate, "MMMM d, yyyy") : "Upcoming"}
                </h3>

                {(() => {
                  // Filter events for selected date
                  const dayEvents = selectedDate
                    ? schedule.filter(evt => isSameDay(new Date(evt.event_date), selectedDate))
                    : schedule;

                  if (dayEvents.length === 0) {
                    return (
                      <div className="flex flex-col items-center justify-center h-40 text-slate-400">
                        <Calendar className="h-8 w-8 mb-2 opacity-50" />
                        <p className="text-sm">No shoots on this day.</p>
                      </div>
                    );
                  }

                  return (
                    <div className="space-y-3">
                      {dayEvents.map((evt) => (
                        <div key={evt._id} className="flex items-center gap-3 rounded-xl border border-slate-100 p-3 transition hover:bg-slate-50 hover:border-gold-200">
                          <div className="flex h-10 w-10 flex-none items-center justify-center rounded-lg bg-gold-50 text-gold-600">
                            <span className="text-xs font-bold uppercase">{format(new Date(evt.event_date), 'dd')}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="truncate font-medium text-charcoal-900 text-sm">{evt.name}</h4>
                            <div className="flex items-center gap-2 text-xs text-slate-500">
                              <span>{evt.event_name || 'Event'}</span>
                              {evt.location && <span>• {evt.location}</span>}
                            </div>
                          </div>
                          <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide
                                  ${evt.order_status === 'Delivered' ? 'bg-emerald-100 text-emerald-700' :
                              evt.order_status === 'Completed' ? 'bg-emerald-100 text-emerald-700' :
                                evt.order_status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                                  'bg-amber-100 text-amber-700'}`}>
                            {evt.order_status || 'Pending'}
                          </span>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>
            </div>
          </section>

          {/* Pipeline & Revenue Split */}
          <div className="grid gap-6 sm:grid-cols-2">
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold text-charcoal-900">Pipeline Status</h2>
              <div className="space-y-4">
                {pipeline.map((status) => (
                  <div key={status._id} className="group">
                    <div className="mb-1 flex justify-between text-sm">
                      <span className="font-medium text-slate-700">{status._id}</span>
                      <span className="text-slate-500">{status.count}</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                      <div className="h-full rounded-full bg-charcoal-900 transition-all duration-500" style={{ width: `${(status.count / Math.max(...pipeline.map(p => p.count), 1)) * 100}%` }} />
                    </div>
                  </div>
                ))}
                {pipeline.length === 0 && <p className="text-sm text-slate-400">No active orders</p>}
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold text-charcoal-900">Revenue Month</h2>
              <div className="space-y-6">
                <div>
                  <p className="text-sm text-slate-500">Collected</p>
                  <p className="text-2xl font-bold text-emerald-600">{collectedThisMonth}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Billed</p>
                  <p className="text-2xl font-bold text-charcoal-900">{"₹" + (revenue.thisMonthBilled / 100000).toFixed(1) + "L"}</p>
                </div>
                <div className="pt-4 border-t border-slate-100">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Total Outstanding</span>
                    <span className="font-medium text-rose-600">{totalPipelineValue}</span>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Sidebar Column */}
        <div className="space-y-8">

          {/* Pending Reviews */}
          {actionRequired.pendingTestimonialsList?.length > 0 && (
            <section className="rounded-3xl border border-amber-100 bg-amber-50/50 p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-semibold text-amber-900">Testimonal Reviews</h3>
                <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">{actionRequired.pendingTestimonialsList.length}</span>
              </div>
              <div className="space-y-3">
                {actionRequired.pendingTestimonialsList.map((t) => (
                  <div key={t._id} className="rounded-xl bg-white p-3 shadow-sm ring-1 ring-amber-100/50 transition hover:ring-amber-200">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium text-sm text-charcoal-900">{t.coupleName}</p>
                        <p className="text-xs text-slate-500">{new Date(t.createdAt).toLocaleDateString()}</p>
                      </div>
                      {/* Compact Star Rating */}
                      <div className="flex text-amber-400">
                        <Star className="w-3 h-3 fill-current" />
                        <span className="text-xs ml-0.5 font-bold text-slate-600">{t.rating}</span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 line-clamp-2 italic mb-3 border-l-2 border-amber-200 pl-2">
                      "{t.shortDescription}"
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApproveTestimonial(t._id)}
                        className="flex-1 rounded-lg bg-amber-100 py-1.5 text-xs font-semibold text-amber-700 hover:bg-amber-200 transition"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => setSelectedTestimonial(t)}
                        className="flex-1 rounded-lg bg-slate-50 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
                      >
                        Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Quick Health Stats */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 font-semibold text-charcoal-900">Content Health</h3>
            <div className="space-y-3">
              <HealthRow label="Gallery Queued" value={kpi.galleryQueue} />
              <HealthRow label="Active Slider" value={contentHealth.sliderActive} />
              <HealthRow label="Stories Live" value={contentHealth.storiesPublished} />
              <HealthRow label="Testimonials" value={contentHealth.testimonialsPublished} />
            </div>
          </section>

          {/* Activity Feed */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 font-semibold text-charcoal-900">Recent Activity</h3>
            <div className="relative space-y-6 pl-4 before:absolute before:left-1.5 before:top-2 before:h-full before:w-px before:bg-slate-200">
              {activityFeed.map((item, i) => (
                <div key={i} className="relative">
                  <div className={`absolute -left-[21px] top-1.5 h-3 w-3 rounded-full border-2 border-white ${item.type === 'Enquiry' ? 'bg-blue-500' :
                    item.type === 'Order' ? 'bg-emerald-500' : 'bg-amber-500'
                    }`} />
                  <p className="text-sm font-medium text-charcoal-900">{item.text}</p>
                  <p className="text-xs text-slate-400">{format(new Date(item.date), 'MMM dd, HH:mm')}</p>
                </div>
              ))}
            </div>
          </section>

        </div>
      </div>
      {/* Testimonial Preview Modal */}
      {selectedTestimonial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm" onClick={() => setSelectedTestimonial(null)}>
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl animate-in fade-in zoom-in duration-200" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-start justify-between">
              <h3 className="text-xl font-bold text-charcoal-900">Review Testimonial</h3>
              <button
                onClick={() => setSelectedTestimonial(null)}
                className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mb-6 space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 overflow-hidden rounded-full border border-slate-200 bg-slate-100">
                  <img
                    src={selectedTestimonial.thumbnail || "https://placehold.co/250x250?text=Couple"}
                    alt={selectedTestimonial.coupleName}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-semibold text-charcoal-900">{selectedTestimonial.coupleName}</h4>
                  <p className="text-sm text-slate-500">{selectedTestimonial.location || "No Location"}</p>
                  <div className="mt-1 flex items-center gap-1 text-amber-400">
                    <span className="text-sm font-medium text-charcoal-900">{selectedTestimonial.rating || 5}</span>
                    <Star className="h-3 w-3 fill-current" />
                  </div>
                </div>
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">Short Description</p>
                <p className="text-sm text-slate-700 italic">"{selectedTestimonial.shortDescription}"</p>
              </div>

              {selectedTestimonial.fullDescription && (
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">Full Story</p>
                  <p className="text-sm text-slate-700 whitespace-pre-line">{selectedTestimonial.fullDescription}</p>
                </div>
              )}

              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Submitted: {new Date(selectedTestimonial.createdAt).toLocaleDateString()}</span>
                <span className="rounded-full bg-amber-100 px-2 py-0.5 text-amber-700">Pending Approval</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setSelectedTestimonial(null)}
                className="flex-1 rounded-xl border border-slate-200 py-2.5 font-medium text-slate-600 hover:bg-slate-50"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleApproveTestimonial(selectedTestimonial._id);
                  setSelectedTestimonial(null);
                }}
                className="flex-1 rounded-xl bg-charcoal-900 py-2.5 font-medium text-white hover:bg-charcoal-800"
              >
                Approve & Publish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function KpiCard({ label, value, sub, icon: Icon, accent }) {
  return (
    <div className={`rounded-2xl border p-5 transition hover:-translate-y-1 hover:shadow-md ${accent ? 'border-indigo-100 bg-indigo-50/30' : 'border-slate-100 bg-white'
      }`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-bold text-charcoal-900">{value}</p>
        </div>
        <div className={`rounded-xl p-2.5 ${accent ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-500'}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      {sub && <p className="mt-2 text-xs font-medium text-slate-400">{sub}</p>}
    </div>
  );
}

function QuickAction({ to, label, icon: Icon }) {
  return (
    <Link to={to} className="inline-flex items-center gap-2 rounded-xl bg-charcoal-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-charcoal-800">
      <Icon className="h-4 w-4" />
      {label}
    </Link>
  );
}

function HealthRow({ label, value }) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2">
      <span className="text-sm font-medium text-slate-600">{label}</span>
      <span className="font-bold text-charcoal-900">{value}</span>
    </div>
  );
}

function formatMonthlyData(data) {
  if (!data) return [];

  // Create a map of existing data
  const dataMap = {};
  data.forEach(item => {
    const key = `${item._id.year}-${item._id.month}`;
    dataMap[key] = item;
  });

  // Generate last 6 months to ensure continuity
  const result = [];
  const today = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${d.getMonth() + 1}`;
    const item = dataMap[key] || {};

    result.push({
      name: format(d, 'MMM'),
      fullDate: key,
      total: item.total || 0,
      collected: item.collected || 0,
      count: item.count || 0
    });
  }
  return result;
}
