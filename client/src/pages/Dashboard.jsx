import { useState, useEffect } from 'react';
import { FileText, CreditCard, Users, TrendingUp, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { clientService } from '../services/clientService';
import { quotationService } from '../services/quotationService';
import { invoiceService } from '../services/invoiceService';
import { useFetch } from '../hooks/useFetch';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalBilled: 0,
    totalReceived: 0,
    pendingPayments: 0,
    quotationsSent: 0,
    totalClients: 0,
  });
  const [recentQuotations, setRecentQuotations] = useState([]);
  const [recentInvoices, setRecentInvoices] = useState([]);

  // Fetch data on component mount
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [quotations, invoices, clients] = await Promise.all([
          quotationService.getAllQuotations(),
          invoiceService.getAllInvoices(),
          clientService.getAllClients(),
        ]);

        const totalBilled = invoices.reduce((sum, inv) => sum + inv.grandTotal, 0);
        const totalReceived = invoices.reduce(
          (sum, inv) => sum + (inv.amountPaid || 0),
          0
        );
        const pendingPayments = totalBilled - totalReceived;

        setStats({
          totalBilled,
          totalReceived,
          pendingPayments,
          quotationsSent: quotations.length,
          totalClients: clients.length,
        });

        setRecentQuotations(quotations.slice(0, 3));
        setRecentInvoices(invoices.slice(0, 3));
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, []);

  const StatCard = ({ icon: Icon, label, value, change, isPositive }) => (
    <div className="luxury-card">
      <div className="flex justify-between items-start">
        <div>
          <p className="font-montserrat text-charcoal-600 dark:text-charcoal-300 text-sm mb-1">
            {label}
          </p>
          <p className="font-playfair text-2xl font-bold text-charcoal-900 dark:text-white">
            {typeof value === 'number' && (label.includes('Pending') || label.includes('Quotations'))
              ? value.toLocaleString()
              : `₹${value.toLocaleString()}`}
          </p>
        </div>
        <div className="w-12 h-12 bg-gold-100 dark:bg-charcoal-700 rounded-lg flex items-center justify-center">
          <Icon className="w-6 h-6 text-gold-600" />
        </div>
      </div>
      {change && (
        <div className="flex items-center gap-1 mt-3 text-sm">
          {isPositive ? (
            <ArrowUpRight className="w-4 h-4 text-green-600" />
          ) : (
            <ArrowDownLeft className="w-4 h-4 text-red-600" />
          )}
          <span className={isPositive ? 'text-green-600' : 'text-red-600'}>
            {change}%
          </span>
        </div>
      )}
    </div>
  );

  return (
    <div>
      <div className="mb-12">
        <h1 className="luxury-text-title mb-2">Dashboard</h1>
        <p className="font-montserrat text-charcoal-600 dark:text-charcoal-300">
          Welcome back! Here's your business overview.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <StatCard icon={CreditCard} label="Total Billed" value={stats.totalBilled} change={12} isPositive={true} />
        <StatCard icon={TrendingUp} label="Total Received" value={stats.totalReceived} change={8} isPositive={true} />
        <StatCard icon={FileText} label="Pending Payments" value={stats.pendingPayments} change={-3} isPositive={false} />
        <StatCard icon={FileText} label="Quotations Sent" value={stats.quotationsSent} change={5} isPositive={true} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="luxury-card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="luxury-text-subtitle text-xl">Recent Quotations</h2>
            <Link to="/quotations" className="text-gold-600 hover:text-gold-700 font-montserrat text-sm">View All →</Link>
          </div>
          {recentQuotations.length === 0 ? (
            <p className="font-montserrat text-charcoal-600 dark:text-charcoal-400">No quotations yet</p>
          ) : (
            <div className="space-y-3">
              {recentQuotations.map((quotation, idx) => (
                <div key={idx} className="flex justify-between items-center py-3 border-b border-gold-100 dark:border-charcoal-700">
                  <div>
                    <p className="font-montserrat font-medium text-charcoal-900 dark:text-white">{quotation.clientId?.name || 'Unknown Client'}</p>
                    <p className="font-montserrat text-sm text-charcoal-500 dark:text-charcoal-400">{new Date(quotation.createdAt).toLocaleDateString()}</p>
                  </div>
                  <span className="font-montserrat font-semibold text-gold-600">₹{quotation.grandTotal?.toLocaleString()}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="luxury-card">
          <h2 className="luxury-text-subtitle text-xl mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link to="/quotations" className="block w-full px-4 py-3 bg-gold-500 hover:bg-gold-600 text-white font-montserrat font-medium rounded transition-colors text-center">+ Create New Quotation</Link>
            <Link to="/invoices" className="block w-full px-4 py-3 bg-charcoal-700 hover:bg-charcoal-800 dark:bg-charcoal-700 dark:hover:bg-charcoal-600 text-white font-montserrat font-medium rounded transition-colors text-center">+ Create New Invoice</Link>
            <Link to="/clients" className="block w-full px-4 py-3 border-2 border-gold-500 text-gold-600 hover:bg-gold-50 dark:hover:bg-charcoal-800 font-montserrat font-medium rounded transition-colors text-center">+ Add New Client</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
