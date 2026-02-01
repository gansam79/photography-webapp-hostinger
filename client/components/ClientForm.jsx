import { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function ClientForm({ client, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    category: "New Inquiry",
    tags: "",
    notes: "",
  });

  useEffect(() => {
    if (client) {
      setFormData({
        ...client,
        tags: client.tags ? client.tags.join(", ") : "",
      });
    }
  }, [client]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const submitData = {
      ...formData,
      tags: formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag),
    };

    try {
      const method = client ? "PUT" : "POST";
      const url = client ? `/api/clients/${client._id}` : "/api/clients";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submitData),
      });

      if (!response.ok) throw new Error("Failed to save client");
      const savedClient = await response.json();
      onSave(savedClient);
    } catch (error) {
      console.error("Error saving client:", error);
      alert("Error saving client");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-charcoal-800 rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gold-200 dark:border-charcoal-700 sticky top-0 bg-white dark:bg-charcoal-800">
          <h2 className="font-playfair text-2xl font-bold text-charcoal-900 dark:text-white">
            {client ? "Edit Client" : "Add New Client"}
          </h2>
          <button
            onClick={onCancel}
            className="p-1 hover:bg-gold-50 dark:hover:bg-charcoal-700 rounded transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Info */}
          <div>
            <h3 className="font-montserrat font-semibold text-charcoal-900 dark:text-white mb-3">
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="name"
                placeholder="Full Name *"
                value={formData.name}
                onChange={handleChange}
                required
                className="px-4 py-2 border border-gold-200 dark:border-charcoal-700 bg-white dark:bg-charcoal-700 rounded font-montserrat text-charcoal-900 dark:text-white placeholder-charcoal-400"
              />
              <input
                type="email"
                name="email"
                placeholder="Email *"
                value={formData.email}
                onChange={handleChange}
                required
                className="px-4 py-2 border border-gold-200 dark:border-charcoal-700 bg-white dark:bg-charcoal-700 rounded font-montserrat text-charcoal-900 dark:text-white placeholder-charcoal-400"
              />
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number *"
                value={formData.phone}
                onChange={handleChange}
                required
                className="px-4 py-2 border border-gold-200 dark:border-charcoal-700 bg-white dark:bg-charcoal-700 rounded font-montserrat text-charcoal-900 dark:text-white placeholder-charcoal-400"
              />
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="px-4 py-2 border border-gold-200 dark:border-charcoal-700 bg-white dark:bg-charcoal-700 rounded font-montserrat text-charcoal-900 dark:text-white"
              >
                <option value="New Inquiry">New Inquiry</option>
                <option value="Regular">Regular</option>
                <option value="VIP">VIP</option>
              </select>
            </div>
          </div>

          {/* Address Info */}
          <div>
            <h3 className="font-montserrat font-semibold text-charcoal-900 dark:text-white mb-3">
              Address
            </h3>
            <div className="space-y-4">
              <input
                type="text"
                name="address"
                placeholder="Street Address"
                value={formData.address}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gold-200 dark:border-charcoal-700 bg-white dark:bg-charcoal-700 rounded font-montserrat text-charcoal-900 dark:text-white placeholder-charcoal-400"
              />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={formData.city}
                  onChange={handleChange}
                  className="px-4 py-2 border border-gold-200 dark:border-charcoal-700 bg-white dark:bg-charcoal-700 rounded font-montserrat text-charcoal-900 dark:text-white placeholder-charcoal-400"
                />
                <input
                  type="text"
                  name="state"
                  placeholder="State"
                  value={formData.state}
                  onChange={handleChange}
                  className="px-4 py-2 border border-gold-200 dark:border-charcoal-700 bg-white dark:bg-charcoal-700 rounded font-montserrat text-charcoal-900 dark:text-white placeholder-charcoal-400"
                />
                <input
                  type="text"
                  name="zipCode"
                  placeholder="ZIP Code"
                  value={formData.zipCode}
                  onChange={handleChange}
                  className="px-4 py-2 border border-gold-200 dark:border-charcoal-700 bg-white dark:bg-charcoal-700 rounded font-montserrat text-charcoal-900 dark:text-white placeholder-charcoal-400"
                />
              </div>
            </div>
          </div>

          {/* Tags & Notes */}
          <div>
            <h3 className="font-montserrat font-semibold text-charcoal-900 dark:text-white mb-3">
              Additional Info
            </h3>
            <div className="space-y-4">
              <input
                type="text"
                name="tags"
                placeholder="Tags (comma separated, e.g., wedding, premium)"
                value={formData.tags}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gold-200 dark:border-charcoal-700 bg-white dark:bg-charcoal-700 rounded font-montserrat text-charcoal-900 dark:text-white placeholder-charcoal-400"
              />
              <textarea
                name="notes"
                placeholder="Internal notes"
                value={formData.notes}
                onChange={handleChange}
                rows="3"
                className="w-full px-4 py-2 border border-gold-200 dark:border-charcoal-700 bg-white dark:bg-charcoal-700 rounded font-montserrat text-charcoal-900 dark:text-white placeholder-charcoal-400"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-gold-500 hover:bg-gold-600 text-white font-montserrat font-semibold rounded transition-colors"
            >
              {client ? "Update Client" : "Add Client"}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-6 py-3 border border-gold-500 text-gold-600 hover:bg-gold-50 dark:hover:bg-charcoal-700 font-montserrat font-semibold rounded transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
