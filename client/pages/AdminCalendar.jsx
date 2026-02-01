
import React, { useEffect, useState, useMemo } from 'react';
import { Calendar, dateFnsLocalizer, Views } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '../Calendar.css'; // Import custom styles
import PageHeader from "../components/PageHeader";

// Setup the localizer
// Custom Event Component for richer display
const CustomEvent = ({ event }) => {
    if (event.type === 'holiday') {
        return (
            <div className="flex items-center h-full w-full px-1">
                <span className="text-[10px] font-bold text-rose-800 truncate">🎉 {event.title}</span>
            </div>
        );
    }

    const icons = {
        'Wedding': '💍',
        'Pre-Wedding': '💑',
        'Birthday': '🎂',
        'Corporate': '🏢',
        'Baby Shower': '👶'
    };

    return (
        <div className="flex flex-col h-full w-full px-1 py-0.5 overflow-hidden">
            <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold truncate">
                    {icons[event.resource.photography_type] || '📷'} {event.title.split(' - ')[0]}
                </span>
            </div>
            {event.resource.location && (
                <span className="text-[9px] opacity-80 truncate">📍 {event.resource.location}</span>
            )}
        </div>
    );
};

const locales = {
    'en-US': enUS,
};

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
});

// Mock Holidays for 2026 (Approximate for movable feasts)
const HOLIDAYS_2026 = [
    { id: 'h1', title: 'Republic Day', allDay: true, start: new Date(2026, 0, 26), end: new Date(2026, 0, 26), type: 'holiday' },
    { id: 'h2', title: 'Maha Shivaratri', allDay: true, start: new Date(2026, 1, 16), end: new Date(2026, 1, 16), type: 'holiday' },
    { id: 'h3', title: 'Holi', allDay: true, start: new Date(2026, 2, 4), end: new Date(2026, 2, 4), type: 'holiday' },
    { id: 'h4', title: 'Gudi Padwa', allDay: true, start: new Date(2026, 2, 19), end: new Date(2026, 2, 19), type: 'holiday' },
    { id: 'h5', title: 'Independence Day', allDay: true, start: new Date(2026, 7, 15), end: new Date(2026, 7, 15), type: 'holiday' },
    { id: 'h6', title: 'Ganesh Chaturthi', allDay: true, start: new Date(2026, 8, 14), end: new Date(2026, 8, 14), type: 'holiday' },
    { id: 'h7', title: 'Gandhi Jayanti', allDay: true, start: new Date(2026, 9, 2), end: new Date(2026, 9, 2), type: 'holiday' },
    { id: 'h8', title: 'Dussehra', allDay: true, start: new Date(2026, 9, 20), end: new Date(2026, 9, 20), type: 'holiday' },
    { id: 'h9', title: 'Diwali', allDay: true, start: new Date(2026, 10, 8), end: new Date(2026, 10, 8), type: 'holiday' },
    { id: 'h10', title: 'Christmas', allDay: true, start: new Date(2026, 11, 25), end: new Date(2026, 11, 25), type: 'holiday' },
];

export default function AdminCalendar() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('All');
    const [filterType, setFilterType] = useState('All');
    const [viewDate, setViewDate] = useState(new Date());

    useEffect(() => {
        fetchOrders();
    }, []);

    async function fetchOrders() {
        try {
            setLoading(true);
            const res = await fetch("/api/orders");
            if (!res.ok) throw new Error("Failed to fetch orders");
            const data = await res.json();
            setOrders(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    const { events, stats } = useMemo(() => {
        let filteredOrders = orders;

        // Apply filters
        if (filterStatus !== 'All') {
            filteredOrders = filteredOrders.filter(o => (o.order_status || 'Pending') === filterStatus);
        }
        if (filterType !== 'All') {
            filteredOrders = filteredOrders.filter(o => (o.photography_type || 'Other') === filterType);
        }

        // Generate Events
        const orderEvents = filteredOrders.map(order => {
            const startDate = order.event_date ? new Date(order.event_date) : (order.date ? new Date(order.date) : null);
            if (!startDate) return null;
            const endDate = order.event_end_date ? new Date(order.event_end_date) : startDate;

            return {
                id: order._id,
                title: `${order.name || order.customerName} - ${order.event_name || 'Event'}`,
                start: startDate,
                end: endDate,
                allDay: true,
                resource: order,
                type: 'order',
                status: order.order_status || order.status || 'Pending'
            };
        }).filter(Boolean);

        // Calculate Stats for the CURRENT VIEW (approximate to month for simplicity or total filtered)
        const total = orderEvents.length;
        const weddings = orderEvents.filter(e => e.resource.photography_type === 'Wedding').length;
        const pending = orderEvents.filter(e => e.status === 'Pending').length;

        // Always show holidays unless specifically filtered out (optional logic, keeping them for now)
        const displayEvents = [...HOLIDAYS_2026, ...orderEvents];

        return { events: displayEvents, stats: { total, weddings, pending } };
    }, [orders, filterStatus, filterType]);

    const eventStyleGetter = (event, start, end, isSelected) => {
        let className = '';
        if (event.type === 'holiday') {
            className = 'type-holiday';
            // Holidays shouldn't disappear if filters are active, but maybe we want to hide them?
            // Let's keep them visible.
        } else if (event.type === 'order') {
            className = `type-order-${event.status.replace(/\s+/g, '')}`;
        }
        return { className };
    };

    const uniqueTypes = useMemo(() => {
        const types = new Set(orders.map(o => o.photography_type).filter(Boolean));
        return ['All', ...Array.from(types)];
    }, [orders]);

    return (
        <section className="container mx-auto p-4 pb-20 space-y-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <PageHeader
                    title="Calendar"
                    description="Manage your schedule efficiently."
                />

                {/* Stats Summary */}
                <div className="flex gap-3 bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
                    <div className="px-3 py-1 text-center border-r border-slate-100">
                        <span className="block text-xs text-slate-400 uppercase tracking-wider">Events</span>
                        <span className="text-lg font-bold text-charcoal-900">{stats.total}</span>
                    </div>
                    <div className="px-3 py-1 text-center border-r border-slate-100">
                        <span className="block text-xs text-slate-400 uppercase tracking-wider">Weddings</span>
                        <span className="text-lg font-bold text-gold-600">{stats.weddings}</span>
                    </div>
                    <div className="px-3 py-1 text-center">
                        <span className="block text-xs text-slate-400 uppercase tracking-wider">Pending</span>
                        <span className="text-lg font-bold text-amber-500">{stats.pending}</span>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-3xl border border-gold-200/50 shadow-xl overflow-hidden">
                {/* Toolbar / Filters */}
                <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-wrap items-center gap-4 justify-between">
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg p-1">
                            <span className="text-xs font-bold px-2 text-slate-400 uppercase">View:</span>
                            {/* Date Navigation Controls */}
                            <div className="flex items-center gap-1">
                                <select
                                    className="bg-transparent text-sm font-bold text-charcoal-900 outline-none cursor-pointer py-1"
                                    value={viewDate.getMonth()}
                                    onChange={(e) => {
                                        const newDate = new Date(viewDate);
                                        newDate.setMonth(parseInt(e.target.value));
                                        setViewDate(newDate);
                                    }}
                                >
                                    {Array.from({ length: 12 }, (_, i) => (
                                        <option key={i} value={i}>{format(new Date(2024, i, 1), 'MMMM')}</option>
                                    ))}
                                </select>
                                <select
                                    className="bg-transparent text-sm font-bold text-charcoal-900 outline-none cursor-pointer py-1"
                                    value={viewDate.getFullYear()}
                                    onChange={(e) => {
                                        const newDate = new Date(viewDate);
                                        newDate.setFullYear(parseInt(e.target.value));
                                        setViewDate(newDate);
                                    }}
                                >
                                    {Array.from({ length: 11 }, (_, i) => 2020 + i).map(year => (
                                        <option key={year} value={year}>{year}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="w-px h-4 bg-slate-200"></div>

                            <span className="text-xs font-bold px-2 text-slate-400 uppercase">Filter:</span>
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="bg-transparent text-sm font-medium text-charcoal-800 outline-none cursor-pointer"
                            >
                                <option value="All">All Statuses</option>
                                <option value="Pending">Pending</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Delivered">Delivered</option>
                                <option value="Cancelled">Cancelled</option>
                            </select>
                            <div className="w-px h-4 bg-slate-200"></div>
                            <select
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value)}
                                className="bg-transparent text-sm font-medium text-charcoal-800 outline-none cursor-pointer"
                            >
                                {uniqueTypes.map(t => <option key={t} value={t}>{t === 'All' ? 'All Types' : t}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* Legend (Compact) */}
                    <div className="flex items-center gap-3 text-[10px] font-medium uppercase tracking-wider text-slate-500">
                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-400"></span> Holiday</span>
                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400"></span> Pending</span>
                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-400"></span> Active</span>
                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-400"></span> Done</span>
                    </div>
                </div>

                <div className="h-[750px] bg-white p-2">
                    <Calendar
                        localizer={localizer}
                        events={events}
                        startAccessor="start"
                        endAccessor="end"
                        style={{ height: '100%' }}
                        eventPropGetter={eventStyleGetter}
                        components={{
                            event: CustomEvent
                        }}
                        views={[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]}
                        defaultView={Views.MONTH}
                        date={viewDate}
                        onNavigate={setViewDate}
                        popup
                    />
                </div>
            </div>
        </section>
    );
}
