import { useState, useEffect } from "react";
import { useSettings } from "../hooks/useSettings";
import { X, Plus, Trash2, Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

export default function QuotationForm({ quotation, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    clientId: "",
    clientName: "",
    email: "",
    whatsapp_no: "",
    eventType: "",
    eventDate: "",
    location: "",
    validityDate: "",
    services: [],
    discountPercentage: 0,
    paymentTerms: "50% advance, 50% on event date",
    notes: "",
    thankYouMessage: "",
  });

  const { data: settings } = useSettings();

  useEffect(() => {
    if (settings && !quotation) {
      setFormData(prev => ({
        ...prev,
        thankYouMessage: `Thank you for choosing ${settings.businessName || "The Patil Photography"}. We look forward to capturing your special moments!`
      }));
    } else if (!quotation) {
      // Fallback if settings not loaded yet or empty, though effect will re-run
      setFormData(prev => ({
        ...prev,
        thankYouMessage: "Thank you for choosing The Patil Photography & Film's. We look forward to capturing your special moments!"
      }));
    }
  }, [settings, quotation]);

  const [isSaving, setIsSaving] = useState(false);

  const [predefinedServices, setPredefinedServices] = useState([]);
  const [open, setOpen] = useState(false);

  // Modals state
  const [isEventTypeModalOpen, setIsEventTypeModalOpen] = useState(false);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [newEventType, setNewEventType] = useState("");
  const [newService, setNewService] = useState({ name: "", rate: 0 });

  const [totals, setTotals] = useState({
    subtotal: 0,
    discountAmount: 0,
    grandTotal: 0,
  });

  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    if (quotation) {
      setFormData({
        ...quotation,
        clientId: quotation.clientId?._id || "",
        clientName: quotation.clientName || quotation.clientId?.name || "",
        email: quotation.email || quotation.clientId?.email || "",
        whatsapp_no: quotation.whatsapp_no || quotation.clientId?.phone || "",
        services: quotation.services || [],
        discountPercentage: quotation.discountType === 'percentage' ? quotation.discount : 0,
        eventDate: quotation.eventDate ? quotation.eventDate.split('T')[0] : "",
        validityDate: quotation.validityDate ? quotation.validityDate.split('T')[0] : "",
      });
    }
  }, [quotation]);

  useEffect(() => {
    calculateTotals();
  }, [formData.services, formData.discountPercentage]);



  const fetchServices = async () => {
    try {
      const response = await fetch("/api/services");
      if (!response.ok) throw new Error("Failed to fetch services");
      const data = await response.json();
      setPredefinedServices(data);
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };

  const calculateTotals = () => {
    let subtotal = 0;
    formData.services.forEach((item) => {
      subtotal += item.total || 0;
    });

    let discountVal = parseFloat(formData.discountPercentage) || 0;
    if (discountVal > 100) discountVal = 100;
    if (discountVal < 0) discountVal = 0;

    const discountAmount = (subtotal * discountVal) / 100;
    const grandTotal = subtotal - discountAmount;

    setTotals({
      subtotal,
      discountAmount: Math.round(discountAmount),
      grandTotal: Math.round(grandTotal),
    });

    setFormData((prev) => ({
      ...prev,
      subtotal,
      discount: discountVal, // Storing as percentage value in discount field
      discountType: 'percentage',
      tax: 0,
      grandTotal: Math.round(grandTotal),
    }));
  };

  const handleAddService = () => {
    setFormData((prev) => ({
      ...prev,
      services: [
        ...prev.services,
        {
          serviceName: "",
          quantity: 1,
          days: 1,
          ratePerDay: 0,
          total: 0,
        },
      ],
    }));
  };

  const handleServiceChange = (index, field, value) => {
    const updatedServices = [...formData.services];
    updatedServices[index][field] = value;

    if (field === "serviceName") {
      const match = predefinedServices.find(s => s.name.toLowerCase() === value.toLowerCase());
      if (match) {
        updatedServices[index].ratePerDay = match.ratePerDay || updatedServices[index].ratePerDay;
      }
    }

    if (["quantity", "days", "ratePerDay"].includes(field)) {
      const qty = parseInt(updatedServices[index].quantity) || 0;
      const days = parseInt(updatedServices[index].days) || 0;
      const rate = parseFloat(updatedServices[index].ratePerDay) || 0;
      updatedServices[index].total = qty * days * rate;
    }

    setFormData((prev) => ({
      ...prev,
      services: updatedServices,
    }));
  };

  const handleRemoveService = (index) => {
    setFormData((prev) => ({
      ...prev,
      services: prev.services.filter((_, i) => i !== index),
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.clientName?.trim()) { alert("Client Name is required"); return; }
    if (!formData.whatsapp_no?.trim()) { alert("Mobile Number is required"); return; }

    if (formData.services.length === 0) {
      alert("Please add at least one service");
      return;
    }
    const invalidService = formData.services.find(s => !s.serviceName?.trim());
    if (invalidService) {
      alert("All services must have a name");
      return;
    }

    if (!formData.eventDate) { alert("Event Date is required"); return; }

    setIsSaving(true);
    try {
      const method = quotation ? "PUT" : "POST";
      const url = quotation
        ? `/api/quotations/${quotation._id}`
        : "/api/quotations";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save quotation");
      }
      const savedQuotation = await response.json();
      onSave(savedQuotation);
    } catch (error) {
      console.error("Error saving quotation:", error);
      alert(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveEventType = () => {
    if (newEventType.trim()) {
      // Add to event types list (using state? or just select it?)
      // Since eventType input is text with datalist, setting formData.eventType is enough to "select" it
      setFormData(prev => ({ ...prev, eventType: newEventType }));
      setIsEventTypeModalOpen(false);
      setNewEventType("");
    }
  };

  const handleSaveService = () => {
    if (newService.name.trim()) {
      // Add to predefined services locally
      const newSvc = {
        _id: `temp-${Date.now()}`,
        name: newService.name,
        ratePerDay: parseFloat(newService.rate) || 0
      };
      setPredefinedServices(prev => [...prev, newSvc]);

      // If triggered from a specific row (optional feature), populate it
      // But typically "Add New" adds to options. 
      // Let's just reset
      setIsServiceModalOpen(false);
      setNewService({ name: "", rate: 0 });
    }
  };



  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onCancel}>
      <div className="bg-white dark:bg-charcoal-800 rounded-lg shadow-xl max-w-5xl w-full mx-4 max-h-[95vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gold-200 dark:border-charcoal-700 sticky top-0 bg-white dark:bg-charcoal-800 z-10">
          <h2 className="font-playfair text-2xl font-bold text-charcoal-900 dark:text-white">
            {quotation ? "Edit Quotation" : "Create New Quotation"}
          </h2>
          <button
            onClick={onCancel}
            className="p-1 hover:bg-gold-50 dark:hover:bg-charcoal-700 rounded transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-8">

          {/* Client Information */}
          <section>
            <h3 className="font-montserrat font-semibold text-lg text-gold-600 dark:text-gold-400 mb-4 border-b pb-2 border-gold-100">
              Client Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Client Name *</label>
                <input
                  type="text"
                  name="clientName"
                  value={formData.clientName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border rounded-md dark:bg-charcoal-700 dark:border-gray-600"
                  placeholder="Enter Client Name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Email ID</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md dark:bg-charcoal-700 dark:border-gray-600"
                  placeholder="client@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Mobile Number *</label>
                <input
                  type="text"
                  name="whatsapp_no"
                  value={formData.whatsapp_no}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border rounded-md dark:bg-charcoal-700 dark:border-gray-600"
                  placeholder="9876543210"
                />
              </div>
            </div>
          </section>

          {/* Event Information */}
          <section>
            <h3 className="font-montserrat font-semibold text-lg text-gold-600 dark:text-gold-400 mb-4 border-b pb-2 border-gold-100">
              Event Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Event Type *</label>
                <div className="flex gap-2">
                  <input
                    list="eventTypes"
                    name="eventType"
                    value={formData.eventType}
                    onChange={handleChange}
                    className="flex-1 px-4 py-2 border rounded-md dark:bg-charcoal-700 dark:border-gray-600"
                    placeholder="Select or Type (e.g. Wedding)"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="px-3"
                    onClick={() => setIsEventTypeModalOpen(true)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <datalist id="eventTypes">
                  <option value="Wedding" />
                  <option value="Pre-Wedding" />
                  <option value="Engagement" />
                  <option value="Birthday" />
                  <option value="Anniversary" />
                  <option value="Baby Shower" />
                </datalist>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Event Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md dark:bg-charcoal-700 dark:border-gray-600"
                  placeholder="Venue / City"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Event Date *</label>
                <input
                  type="date"
                  name="eventDate"
                  value={formData.eventDate ? formData.eventDate.split('T')[0] : ''}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border rounded-md dark:bg-charcoal-700 dark:border-gray-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Quotation Validity</label>
                <input
                  type="date"
                  name="validityDate"
                  value={formData.validityDate ? formData.validityDate.split('T')[0] : ''}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border rounded-md dark:bg-charcoal-700 dark:border-gray-600"
                />
              </div>
            </div>
          </section>

          {/* Services */}
          <section>
            <div className="flex justify-between items-center mb-4 border-b pb-2 border-gold-100">
              <h3 className="font-montserrat font-semibold text-lg text-gold-600 dark:text-gold-400">Services</h3>
              <Button type="button" onClick={handleAddService} size="sm" className="bg-gold-500 hover:bg-gold-600 text-white">
                <Plus className="w-4 h-4 mr-1" /> Add Service
              </Button>
            </div>

            <div className="space-y-4">
              {formData.services.map((service, index) => (
                <div key={index} className="flex flex-wrap md:flex-nowrap gap-3 items-end p-4 bg-gray-50 dark:bg-charcoal-900 rounded-md border border-gray-100 dark:border-gray-700">
                  <div className="flex-grow w-full md:w-auto">
                    <label className="block text-xs text-gray-500 mb-1">Service Name *</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={service.serviceName}
                        onChange={(e) => handleServiceChange(index, "serviceName", e.target.value)}
                        placeholder="Photography, Drone, etc."
                        className="flex-1 px-3 py-2 border rounded text-sm dark:bg-charcoal-700 dark:border-gray-600"
                        list={`serviceSuggestions-${index}`}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="h-9 w-9 shrink-0"
                        onClick={() => setIsServiceModalOpen(true)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <datalist id={`serviceSuggestions-${index}`}>
                      {predefinedServices.map(s => <option key={s._id} value={s.name} />)}
                    </datalist>
                  </div>

                  <div className="w-24">
                    <label className="block text-xs text-gray-500 mb-1">Quantity</label>
                    <input
                      type="number"
                      min="1"
                      value={service.quantity}
                      onChange={(e) => handleServiceChange(index, "quantity", e.target.value)}
                      className="w-full px-3 py-2 border rounded text-sm dark:bg-charcoal-700 dark:border-gray-600"
                    />
                  </div>
                  <div className="w-24">
                    <label className="block text-xs text-gray-500 mb-1">Days</label>
                    <input
                      type="number"
                      min="1"
                      value={service.days}
                      onChange={(e) => handleServiceChange(index, "days", e.target.value)}
                      className="w-full px-3 py-2 border rounded text-sm dark:bg-charcoal-700 dark:border-gray-600"
                    />
                  </div>
                  <div className="w-32">
                    <label className="block text-xs text-gray-500 mb-1">Rate</label>
                    <input
                      type="number"
                      min="0"
                      value={service.ratePerDay}
                      onChange={(e) => handleServiceChange(index, "ratePerDay", e.target.value)}
                      className="w-full px-3 py-2 border rounded text-sm dark:bg-charcoal-700 dark:border-gray-600"
                    />
                  </div>
                  <div className="w-32 text-right pb-2 font-semibold">
                    ₹{(service.total || 0).toLocaleString()}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveService(index)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Pricing & Notes */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Notes</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-2 border rounded-md dark:bg-charcoal-700 dark:border-gray-600"
                placeholder="Additional details..."
              />
            </div>
            <div className="bg-gold-50 dark:bg-charcoal-700 p-4 rounded-lg space-y-3 h-fit">
              <div className="flex justify-between text-gray-600 dark:text-gray-300">
                <span>Subtotal</span>
                <span>₹{totals.subtotal.toLocaleString()}</span>
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1">Discount (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.discountPercentage}
                  onChange={(e) => setFormData(prev => ({ ...prev, discountPercentage: e.target.value }))}
                  className="w-full px-2 py-1 border rounded text-right dark:bg-charcoal-600"
                />
              </div>

              <div className="flex justify-between text-sm text-red-500">
                <span>- Discount Amount</span>
                <span>₹{totals.discountAmount.toLocaleString()}</span>
              </div>

              <div className="border-t border-gray-300 dark:border-gray-600 pt-3 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-gold-600">₹{totals.grandTotal.toLocaleString()}</span>
              </div>
            </div>
          </section>

          {/* Actions */}
          <div className="flex gap-4 pt-4 border-t border-gray-100">
            <Button
              type="submit"
              disabled={isSaving}
              className="flex-1 bg-gold-500 hover:bg-gold-600 text-white h-12 text-lg flex items-center justify-center gap-2"
            >
              {isSaving ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                quotation ? "Update Quotation" : "Create Quotation"
              )}
            </Button>
            <Button type="button" onClick={onCancel} variant="outline" className="flex-1 h-12 text-lg">
              Cancel
            </Button>
          </div>
        </form>
      </div>

      {/* Event Type Modal */}
      <Dialog open={isEventTypeModalOpen} onOpenChange={setIsEventTypeModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Event Type</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <label className="block text-sm font-medium mb-2">Event Type Name</label>
            <input
              type="text"
              value={newEventType}
              onChange={(e) => setNewEventType(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="e.g. Corporate Event"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEventTypeModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveEventType}>Add</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Service Modal */}
      <Dialog open={isServiceModalOpen} onOpenChange={setIsServiceModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Service</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Service Name</label>
              <input
                type="text"
                value={newService.name}
                onChange={(e) => setNewService(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="e.g. Candid Photography"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Default Rate (Per Day)</label>
              <input
                type="number"
                value={newService.rate}
                onChange={(e) => setNewService(prev => ({ ...prev, rate: e.target.value }))}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="0"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsServiceModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveService}>Add Service</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}
