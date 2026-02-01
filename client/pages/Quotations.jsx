import { useState, useEffect } from "react";
import QuotationForm from "@/components/QuotationForm";
import { generateQuotationPDF } from "@/utils/pdfGenerator";
import { toast } from "sonner";
import { Plus, Edit2, Trash2, Copy, FileText, Download } from "lucide-react";

export default function Quotations() {
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedQuotation, setSelectedQuotation] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  useEffect(() => {
    fetchQuotations();
  }, []);

  const fetchQuotations = async () => {
    try {
      const response = await fetch("/api/quotations");
      if (!response.ok) throw new Error("Failed to fetch quotations");
      const data = await response.json();
      setQuotations(data);
    } catch (error) {
      console.error("Error fetching quotations:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNew = () => {
    setSelectedQuotation(null);
    setShowForm(true);
  };

  const handleEdit = (quotation) => {
    setSelectedQuotation(quotation);
    setShowForm(true);
  };

  const handleDelete = async (quotationId) => {
    if (!window.confirm("Are you sure you want to delete this quotation?"))
      return;

    try {
      const response = await fetch(`/api/quotations/${quotationId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete quotation");
      fetchQuotations();
      toast.success("Quotation deleted successfully");
    } catch (error) {
      console.error("Error deleting quotation:", error);
      toast.error("Error deleting quotation");
    }
  };

  const handleDuplicate = async (quotation) => {
    try {
      const response = await fetch(
        `/api/quotations/${quotation._id}/duplicate`,
        {
          method: "POST",
        },
      );
      if (!response.ok) throw new Error("Failed to duplicate quotation");
      fetchQuotations();
      toast.success("Quotation duplicated successfully");
    } catch (error) {
      console.error("Error duplicating quotation:", error);
      toast.error("Error duplicating quotation");
    }
  };

  const handleConvertToInvoice = async (quotation) => {
    if (!quotation.clientId) {
      toast.error("Please change status to 'Accepted' first to generate a Client record.");
      return;
    }

    if (!window.confirm("Convert this quotation to invoice?")) return;

    try {
      const invoiceData = {
        clientId: quotation.clientId._id,
        quotationId: quotation._id,
        eventType: quotation.eventType,
        eventDate: quotation.eventDate,
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
        services: quotation.services,
        subtotal: quotation.subtotal,
        discount: quotation.discount,
        discountType: quotation.discountType,
        taxPercentage: quotation.taxPercentage,
        tax: quotation.tax,
        grandTotal: quotation.grandTotal,
      };

      const response = await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(invoiceData),
      });

      if (!response.ok) throw new Error("Failed to create invoice");
      fetchQuotations();
      toast.success("Invoice created successfully!");
    } catch (error) {
      console.error("Error converting to invoice:", error);
      toast.error("Error converting to invoice");
    }
  };

  const handleSave = () => {
    setShowForm(false);
    setSelectedQuotation(null);
    fetchQuotations();
    toast.success(
      selectedQuotation
        ? "Quotation updated successfully"
        : "Quotation created successfully",
    );
  };

  const filteredQuotations = quotations.filter((q) => {
    // New logic: clientName is the primary name source. clientId might be null.
    const nameToCheck = q.clientName || q.clientId?.name || "Unknown Client";
    const matchesSearch =
      nameToCheck.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.quotationNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "All" || q.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    const colors = {
      Draft: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
      Sent: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      Accepted:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      Rejected: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    };
    return colors[status] || colors.Draft;
  };

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="luxury-text-title mb-2">Quotations</h1>
            <p className="font-montserrat text-charcoal-600 dark:text-charcoal-300">
              Manage and track all your quotations
            </p>
          </div>
          <button
            onClick={handleAddNew}
            className="flex items-center gap-2 px-6 py-3 bg-gold-500 hover:bg-gold-600 text-white font-montserrat font-medium rounded transition-colors"
          >
            <Plus className="w-5 h-5" />
            New Quotation
          </button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <input
            type="text"
            placeholder="Search by client name or quotation number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-3 border border-gold-200 dark:border-charcoal-700 bg-white dark:bg-charcoal-800 rounded font-montserrat text-charcoal-900 dark:text-white placeholder-charcoal-400"
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-3 border border-gold-200 dark:border-charcoal-700 bg-white dark:bg-charcoal-800 rounded font-montserrat text-charcoal-900 dark:text-white"
          >
            <option value="All">All Status</option>
            <option value="Draft">Draft</option>
            <option value="Sent">Sent</option>
            <option value="Accepted">Accepted</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin inline-block">
              <FileText className="w-8 h-8 text-gold-500" />
            </div>
            <p className="font-montserrat text-charcoal-600 dark:text-charcoal-400 mt-4">
              Loading quotations...
            </p>
          </div>
        ) : filteredQuotations.length === 0 &&
          searchTerm === "" &&
          filterStatus === "All" ? (
          <div className="luxury-card text-center py-16">
            <FileText className="w-16 h-16 text-gold-300 mx-auto mb-4" />
            <h2 className="luxury-text-subtitle text-xl mb-2">
              No Quotations Yet
            </h2>
            <p className="font-montserrat text-charcoal-600 dark:text-charcoal-400 mb-6">
              Start creating quotations to manage your photography services
            </p>
            <button
              onClick={handleAddNew}
              className="px-8 py-3 bg-gold-500 hover:bg-gold-600 text-white font-montserrat font-medium rounded transition-colors inline-block"
            >
              Create Your First Quotation
            </button>
          </div>
        ) : filteredQuotations.length === 0 ? (
          <div className="luxury-card text-center py-8">
            <p className="font-montserrat text-charcoal-600 dark:text-charcoal-400">
              No quotations found matching your filters.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredQuotations.map((quotation) => (
              <div key={quotation._id} className="luxury-card">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-playfair text-lg font-semibold text-charcoal-900 dark:text-white">
                        {quotation.quotationNumber}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-montserrat font-medium ${getStatusColor(
                          quotation.status,
                        )}`}
                      >
                        {quotation.status}
                      </span>
                      {quotation.convertedToInvoice && (
                        <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full text-xs font-montserrat font-medium">
                          Converted to Invoice
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                      <div>
                        <p className="font-montserrat text-sm text-charcoal-600 dark:text-charcoal-400">
                          Client
                        </p>
                        <p className="font-montserrat font-semibold text-charcoal-900 dark:text-white">
                          {quotation.clientName || quotation.clientId?.name || "Unknown"}
                        </p>
                      </div>
                      <div>
                        <p className="font-montserrat text-sm text-charcoal-600 dark:text-charcoal-400">
                          Event Type
                        </p>
                        <p className="font-montserrat font-semibold text-charcoal-900 dark:text-white">
                          {quotation.eventType}
                        </p>
                      </div>
                      <div>
                        <p className="font-montserrat text-sm text-charcoal-600 dark:text-charcoal-400">
                          Grand Total
                        </p>
                        <p className="font-montserrat font-bold text-gold-600 text-lg">
                          ₹{quotation.grandTotal.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="text-sm font-montserrat text-charcoal-500 dark:text-charcoal-400">
                      <p>
                        Quotation Date:{" "}
                        {new Date(quotation.quotationDate).toLocaleDateString()}
                      </p>
                      <p>
                        Valid Until:{" "}
                        {new Date(quotation.validityDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 ml-4 flex-wrap justify-end">
                    <button
                      onClick={() =>
                        generateQuotationPDF(quotation, quotation.clientId)
                      }
                      className="p-2 hover:bg-purple-100 dark:hover:bg-charcoal-700 rounded transition-colors"
                      title="Download PDF"
                    >
                      <Download className="w-5 h-5 text-purple-600" />
                    </button>
                    <button
                      onClick={() => handleEdit(quotation)}
                      className="p-2 hover:bg-gold-100 dark:hover:bg-charcoal-700 rounded transition-colors"
                      title="Edit"
                    >
                      <Edit2 className="w-5 h-5 text-gold-600" />
                    </button>
                    <button
                      onClick={() => handleDuplicate(quotation)}
                      className="p-2 hover:bg-blue-100 dark:hover:bg-charcoal-700 rounded transition-colors"
                      title="Duplicate"
                    >
                      <Copy className="w-5 h-5 text-blue-600" />
                    </button>
                    {!quotation.convertedToInvoice && (
                      <button
                        onClick={() => handleConvertToInvoice(quotation)}
                        className="p-2 hover:bg-green-100 dark:hover:bg-charcoal-700 rounded transition-colors"
                        title="Convert to Invoice"
                      >
                        <FileText className="w-5 h-5 text-green-600" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(quotation._id)}
                      className="p-2 hover:bg-red-100 dark:hover:bg-charcoal-700 rounded transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-5 h-5 text-red-600" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showForm && (
        <QuotationForm
          quotation={selectedQuotation}
          onSave={handleSave}
          onCancel={() => setShowForm(false)}
        />
      )}
    </>
  );
}
