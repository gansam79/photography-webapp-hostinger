import { useState, useEffect } from "react";
import { AlertCircle, Calendar, DollarSign, X } from "lucide-react";
import { Link } from "react-router-dom";

export default function Reminders() {
  const [reminders, setReminders] = useState({
    pendingInvoices: [],
    upcomingEvents: [],
    overDueInvoices: [],
  });
  const [isOpen, setIsOpen] = useState(false);
  const [dismissed, setDismissed] = useState(new Set());

  useEffect(() => {
    fetchReminders();
    const interval = setInterval(fetchReminders, 5 * 60 * 1000); // Refresh every 5 minutes
    return () => clearInterval(interval);
  }, []);

  const fetchReminders = async () => {
    try {
      const [invoicesRes, quotationsRes] = await Promise.all([
        fetch("/api/invoices"),
        fetch("/api/quotations"),
      ]);

      const invoices = await invoicesRes.json();
      const quotations = await quotationsRes.json();

      const today = new Date();
      const thirtyDaysFromNow = new Date(
        today.getTime() + 30 * 24 * 60 * 60 * 1000,
      );

      // Get pending invoices
      const pendingInvoices = invoices.filter((inv) =>
        ["Unpaid", "Partially Paid"].includes(inv.paymentStatus),
      );

      // Get overdue invoices
      const overDueInvoices = invoices.filter((inv) => {
        const dueDate = new Date(inv.dueDate);
        return dueDate < today && inv.paymentStatus !== "Paid";
      });

      // Get upcoming events (within next 30 days)
      const upcomingEvents = quotations.filter((q) => {
        const eventDate = new Date(q.eventDate);
        return eventDate >= today && eventDate <= thirtyDaysFromNow;
      });

      setReminders({
        pendingInvoices,
        upcomingEvents,
        overDueInvoices,
      });
    } catch (error) {
      console.error("Error fetching reminders:", error);
    }
  };

  const dismissReminder = (id) => {
    setDismissed((prev) => new Set([...prev, id]));
  };

  const totalReminders =
    reminders.pendingInvoices.length +
    reminders.upcomingEvents.length +
    reminders.overDueInvoices.length -
    dismissed.size;

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-14 h-14 bg-gold-500 hover:bg-gold-600 text-white rounded-full shadow-lg flex items-center justify-center transition-all"
      >
        <AlertCircle className="w-6 h-6" />
        {totalReminders > 0 && (
          <span className="absolute top-0 right-0 w-5 h-5 bg-red-600 text-white text-xs rounded-full flex items-center justify-center font-bold">
            {totalReminders}
          </span>
        )}
      </button>

      {/* Reminder Panel */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-96 bg-white dark:bg-charcoal-800 rounded-lg shadow-2xl border border-gold-200 dark:border-charcoal-700 max-h-96 overflow-y-auto">
          <div className="p-4 border-b border-gold-200 dark:border-charcoal-700 sticky top-0 bg-white dark:bg-charcoal-800">
            <h2 className="font-playfair text-lg font-bold text-charcoal-900 dark:text-white">
              Reminders & Alerts
            </h2>
          </div>

          <div className="divide-y divide-gold-100 dark:divide-charcoal-700">
            {/* Overdue Invoices */}
            {reminders.overDueInvoices.length > 0 && (
              <div className="p-4 bg-red-50 dark:bg-red-900 dark:bg-opacity-20">
                <h3 className="font-montserrat font-bold text-red-700 dark:text-red-400 mb-3 text-sm">
                  ⚠️ {reminders.overDueInvoices.length} Overdue Invoice
                  {reminders.overDueInvoices.length !== 1 ? "s" : ""}
                </h3>
                <div className="space-y-2">
                  {reminders.overDueInvoices.map((invoice) => {
                    if (dismissed.has(`overdue-${invoice._id}`)) return null;
                    return (
                      <div
                        key={`overdue-${invoice._id}`}
                        className="bg-white dark:bg-charcoal-700 p-3 rounded flex justify-between items-start"
                      >
                        <Link
                          to="/invoices"
                          className="flex-1 hover:text-red-600 transition-colors"
                        >
                          <p className="font-montserrat text-sm font-semibold text-charcoal-900 dark:text-white">
                            {invoice.invoiceNumber}
                          </p>
                          <p className="font-montserrat text-xs text-charcoal-600 dark:text-charcoal-400">
                            {invoice.clientId.name} - ₹
                            {invoice.grandTotal.toLocaleString()}
                          </p>
                          <p className="font-montserrat text-xs text-red-600">
                            Due:{" "}
                            {new Date(invoice.dueDate).toLocaleDateString()}
                          </p>
                        </Link>
                        <button
                          onClick={() =>
                            dismissReminder(`overdue-${invoice._id}`)
                          }
                          className="ml-2 p-1 hover:bg-red-100 rounded"
                        >
                          <X className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Pending Invoices */}
            {reminders.pendingInvoices.length > 0 && (
              <div className="p-4 bg-yellow-50 dark:bg-yellow-900 dark:bg-opacity-20">
                <h3 className="font-montserrat font-bold text-yellow-700 dark:text-yellow-400 mb-3 text-sm">
                  💰 {reminders.pendingInvoices.length} Pending Payment
                  {reminders.pendingInvoices.length !== 1 ? "s" : ""}
                </h3>
                <div className="space-y-2">
                  {reminders.pendingInvoices.map((invoice) => {
                    if (dismissed.has(`pending-${invoice._id}`)) return null;
                    return (
                      <div
                        key={`pending-${invoice._id}`}
                        className="bg-white dark:bg-charcoal-700 p-3 rounded flex justify-between items-start"
                      >
                        <Link
                          to="/invoices"
                          className="flex-1 hover:text-yellow-600 transition-colors"
                        >
                          <p className="font-montserrat text-sm font-semibold text-charcoal-900 dark:text-white">
                            {invoice.invoiceNumber}
                          </p>
                          <p className="font-montserrat text-xs text-charcoal-600 dark:text-charcoal-400">
                            {invoice.clientId.name} - ₹
                            {invoice.grandTotal.toLocaleString()}
                          </p>
                          <p className="font-montserrat text-xs text-yellow-600">
                            Status: {invoice.paymentStatus}
                          </p>
                        </Link>
                        <button
                          onClick={() =>
                            dismissReminder(`pending-${invoice._id}`)
                          }
                          className="ml-2 p-1 hover:bg-yellow-100 rounded"
                        >
                          <X className="w-4 h-4 text-yellow-600" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Upcoming Events */}
            {reminders.upcomingEvents.length > 0 && (
              <div className="p-4 bg-blue-50 dark:bg-blue-900 dark:bg-opacity-20">
                <h3 className="font-montserrat font-bold text-blue-700 dark:text-blue-400 mb-3 text-sm">
                  📅 {reminders.upcomingEvents.length} Upcoming Event
                  {reminders.upcomingEvents.length !== 1 ? "s" : ""}
                </h3>
                <div className="space-y-2">
                  {reminders.upcomingEvents.map((quotation) => {
                    if (dismissed.has(`event-${quotation._id}`)) return null;
                    const daysUntil = Math.ceil(
                      (new Date(quotation.eventDate) - new Date()) /
                        (1000 * 60 * 60 * 24),
                    );
                    return (
                      <div
                        key={`event-${quotation._id}`}
                        className="bg-white dark:bg-charcoal-700 p-3 rounded flex justify-between items-start"
                      >
                        <Link
                          to="/quotations"
                          className="flex-1 hover:text-blue-600 transition-colors"
                        >
                          <p className="font-montserrat text-sm font-semibold text-charcoal-900 dark:text-white">
                            {quotation.clientId.name} - {quotation.eventType}
                          </p>
                          <p className="font-montserrat text-xs text-charcoal-600 dark:text-charcoal-400">
                            {quotation.quotationNumber}
                          </p>
                          <p className="font-montserrat text-xs text-blue-600">
                            {daysUntil} days away •{" "}
                            {new Date(quotation.eventDate).toLocaleDateString()}
                          </p>
                        </Link>
                        <button
                          onClick={() =>
                            dismissReminder(`event-${quotation._id}`)
                          }
                          className="ml-2 p-1 hover:bg-blue-100 rounded"
                        >
                          <X className="w-4 h-4 text-blue-600" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* No Reminders */}
            {totalReminders === 0 && (
              <div className="p-8 text-center">
                <AlertCircle className="w-12 h-12 text-gold-300 mx-auto mb-3" />
                <p className="font-montserrat text-charcoal-600 dark:text-charcoal-400">
                  All caught up! No pending reminders.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
