import { useState, useEffect } from "react";

export default function Invoices() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const res = await fetch("/api/invoices");
        if (!res.ok) {
          setInvoices([]);
          return;
        }
        const data = await res.json();
        setInvoices(data || []);
      } catch (e) {
        console.error(e);
        setInvoices([]);
      } finally {
        setLoading(false);
      }
    };
    fetchInvoices();
  }, []);

  return (
    <div className="mt-4">
      <div>
        <h1 className="luxury-text-title">Invoices</h1>
        <p className="text-sm text-charcoal-600">Track and manage invoices.</p>
      </div>

      {loading ? (
        <p className="text-sm">Loading...</p>
      ) : invoices.length === 0 ? (
        <div className="luxury-card text-center py-12">No invoices yet.</div>
      ) : (
        <div className="grid gap-4">
          {invoices.map((inv) => (
            <div key={inv._id} className="luxury-card">
              <div className="flex justify-between">
                <div>
                  <div className="font-playfair font-semibold">{inv.invoiceNumber}</div>
                  <div className="text-sm text-charcoal-600">{inv.clientId?.name}</div>
                </div>
                <div className="font-bold">₹{inv.grandTotal?.toLocaleString()}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
