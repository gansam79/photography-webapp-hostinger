import { useState, useEffect } from "react";
import ClientForm from "@/components/ClientForm";
import { toast } from "sonner";
import { Plus, Edit2, Trash2, Users } from "lucide-react";

export default function Clients() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const response = await fetch("/api/clients");
      if (!response.ok) throw new Error("Failed to fetch clients");
      const data = await response.json();
      setClients(data);
    } catch (error) {
      console.error("Error fetching clients:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNew = () => {
    setSelectedClient(null);
    setShowForm(true);
  };

  const handleEdit = (client) => {
    setSelectedClient(client);
    setShowForm(true);
  };

  const handleDelete = async (clientId) => {
    if (!window.confirm("Are you sure you want to delete this client?")) return;

    try {
      const response = await fetch(`/api/clients/${clientId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete client");
      fetchClients();
      toast.success("Client deleted successfully");
    } catch (error) {
      console.error("Error deleting client:", error);
      toast.error("Error deleting client");
    }
  };

  const handleSave = (client) => {
    setShowForm(false);
    setSelectedClient(null);
    fetchClients();
    toast.success(
      selectedClient
        ? "Client updated successfully"
        : "Client added successfully",
    );
  };

  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const getCategoryColor = (category) => {
    const colors = {
      Regular: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      VIP: "bg-gold-100 text-gold-800 dark:bg-gold-900 dark:text-gold-200",
      "New Inquiry":
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    };
    return colors[category] || colors["New Inquiry"];
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="luxury-text-title mb-1">Clients</h1>
          <p className="text-sm text-charcoal-600">Manage your client database.</p>
        </div>
      </div>

      {loading ? (
        <p>Loading clients...</p>
      ) : clients.length === 0 ? (
        <div className="luxury-card text-center py-8">No clients yet.</div>
      ) : (
        <div className="grid gap-4">
          {clients.map((c) => (
            <div key={c._id} className="luxury-card flex justify-between">
              <div>
                <div className="font-playfair font-semibold">{c.name}</div>
                <div className="text-sm text-charcoal-600">{c.email}</div>
              </div>
              <div className="font-bold">₹{c.totalBilled || 0}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
