import React, { useState, useEffect } from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Save, Plus, Trash2, Upload, Link as LinkIcon, Globe, Mail, MapPin, Phone } from "lucide-react";
import { useSettings } from "../hooks/useSettings";
import PageHeader from "../components/PageHeader";

const PLATFORMS = ['WhatsApp', 'Instagram', 'Facebook', 'YouTube', 'Twitter', 'LinkedIn', 'Other'];

// Validation patterns
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const URL_REGEX = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
const PHONE_REGEX = /^[\d\s\+\-\(\)]+$/;
const MOBILE_REGEX = /^[0-9]{10}$/;

// Validation functions
const validateEmail = (email) => {
    if (!email) return true; // Optional field
    return EMAIL_REGEX.test(email);
};

const validateUrl = (url) => {
    if (!url) return true; // Optional field
    return URL_REGEX.test(url);
};

const validatePhone = (phone) => {
    if (!phone) return true; // Optional field
    return PHONE_REGEX.test(phone) && phone.replace(/\D/g, '').length >= 10;
};

const validateMobileNumber = (mobile) => {
    if (!mobile) return true; // Optional field
    // Allow + at start, then digits, spaces, dashes. Minimal length 10.
    const clean = mobile.replace(/[^0-9+]/g, '');
    return clean.length >= 10 && clean.length <= 15;
};

export default function AdminSettings() {
    const queryClient = useQueryClient();
    const { data: settings, isLoading } = useSettings();

    const [formData, setFormData] = useState({
        businessName: "",
        primaryLogo: "",
        secondaryLogo: "",
        backgroundImage: "",
        websiteUrl: "",
        contactEmail: "",
        primaryMobileNumber: "",
        secondaryMobileNumber: "",
        address: "",
        socialLinks: []
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (settings) {
            setFormData({
                businessName: settings.businessName || "",
                primaryLogo: settings.primaryLogo || "",
                secondaryLogo: settings.secondaryLogo || "",
                backgroundImage: settings.backgroundImage || "",
                websiteUrl: settings.websiteUrl || "",
                contactEmail: settings.contactEmail || "",
                primaryMobileNumber: settings.primaryMobileNumber || "",
                secondaryMobileNumber: settings.secondaryMobileNumber || "",
                address: settings.address || "",
                socialLinks: settings.socialLinks || []
            });
        }
    }, [settings]);

    const mutation = useMutation({
        mutationFn: async (data) => {
            const res = await fetch("/api/settings", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error("Failed to update settings");
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["settings"] });
            toast.success("Settings updated successfully");
        },
        onError: (err) => toast.error(err.message),
    });

    const handleImageUpload = (field, e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, [field]: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSocialChange = (index, field, value) => {
        const newLinks = [...formData.socialLinks];
        newLinks[index][field] = value;
        setFormData({ ...formData, socialLinks: newLinks });
    };

    const addSocialLink = () => {
        setFormData({
            ...formData,
            socialLinks: [...formData.socialLinks, { platform: 'Instagram', url: '', active: true }]
        });
    };

    const removeSocialLink = (index) => {
        const newLinks = formData.socialLinks.filter((_, i) => i !== index);
        setFormData({ ...formData, socialLinks: newLinks });
    };

    const validateForm = () => {
        const newErrors = {};

        if (formData.businessName.trim().length === 0) {
            newErrors.businessName = "Business name is required";
        }

        if (formData.contactEmail && !validateEmail(formData.contactEmail)) {
            newErrors.contactEmail = "Please enter a valid email address";
        }

        if (formData.websiteUrl && !validateUrl(formData.websiteUrl)) {
            newErrors.websiteUrl = "Please enter a valid URL (e.g., https://example.com)";
        }

        if (formData.primaryMobileNumber && !validateMobileNumber(formData.primaryMobileNumber)) {
            newErrors.primaryMobileNumber = "Please enter a valid 10-digit mobile number";
        }

        if (formData.secondaryMobileNumber && !validateMobileNumber(formData.secondaryMobileNumber)) {
            newErrors.secondaryMobileNumber = "Please enter a valid mobile number (10-15 digits)";
        }

        // Validate social links URLs
        formData.socialLinks.forEach((link, index) => {
            if (link.url && !validateUrl(link.url)) {
                newErrors[`social_${index}`] = "Please enter a valid URL";
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleMobileNumberInput = (field, value) => {
        // Allow +, numbers, space, dash
        const cleanValue = value.replace(/[^0-9+\s-]/g, '');
        setFormData(prev => ({ ...prev, [field]: cleanValue }));

        // Simple length check for error clearing
        if (cleanValue.replace(/\D/g, '').length >= 10) {
            setErrors(prev => ({ ...prev, [field]: "" }));
        }
    };

    const handlePhoneInput = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear error on change
        if (value) {
            setErrors(prev => ({ ...prev, [field]: "" }));
        }
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear error on change
        if (value) {
            setErrors(prev => ({ ...prev, [field]: "" }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            mutation.mutate(formData);
        } else {
            toast.error("Please fix the validation errors below");
        }
    };

    if (isLoading) return <div className="p-8 text-center text-slate-500">Loading settings...</div>;

    return (
        <div className="container mx-auto p-4 mt-4 animate-in fade-in duration-500">
            <PageHeader
                title="Global Settings"
                description="Manage branding, logos, and connections"
                action={
                    <button
                        onClick={handleSubmit}
                        disabled={mutation.isPending}
                        className="bg-gray-900 text-white px-6 py-2.5 rounded-lg flex items-center gap-2 hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl disabled:opacity-70"
                    >
                        {mutation.isPending ? "Saving..." : <><Save size={18} /> Save Changes</>}
                    </button>
                }
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Col: Branding & Logos */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Business Info Card */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Globe size={18} className="text-gold-500" /> Business Identity
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Business Name / Shop Name <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    value={formData.businessName}
                                    onChange={(e) => handleInputChange('businessName', e.target.value)}
                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 outline-none transition-all ${errors.businessName ? 'border-red-500' : 'border-gray-200'}`}
                                    placeholder="e.g. The Patil Photography"
                                />
                                {errors.businessName && <p className="text-red-500 text-xs mt-1">{errors.businessName}</p>}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Primary Mobile Number</label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-2.5 text-gray-400 h-4 w-4" />
                                        <input
                                            type="text"
                                            value={formData.primaryMobileNumber}
                                            onChange={(e) => handleMobileNumberInput('primaryMobileNumber', e.target.value)}
                                            maxLength={10}
                                            className={`w-full pl-9 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold-500/20 outline-none transition-all ${errors.primaryMobileNumber ? 'border-red-500' : 'border-gray-200'}`}
                                            placeholder="9876543210"
                                        />
                                    </div>
                                    {errors.primaryMobileNumber && <p className="text-red-500 text-xs mt-1">{errors.primaryMobileNumber}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Secondary Mobile Number</label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-2.5 text-gray-400 h-4 w-4" />
                                        <input
                                            type="text"
                                            value={formData.secondaryMobileNumber}
                                            onChange={(e) => handleMobileNumberInput('secondaryMobileNumber', e.target.value)}
                                            maxLength={10}
                                            className={`w-full pl-9 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold-500/20 outline-none transition-all ${errors.secondaryMobileNumber ? 'border-red-500' : 'border-gray-200'}`}
                                            placeholder="9876543210"
                                        />
                                    </div>
                                    {errors.secondaryMobileNumber && <p className="text-red-500 text-xs mt-1">{errors.secondaryMobileNumber}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Website URL</label>
                                    <div className="relative">
                                        <Globe className="absolute left-3 top-2.5 text-gray-400 h-4 w-4" />
                                        <input
                                            type="url"
                                            value={formData.websiteUrl}
                                            onChange={(e) => handleInputChange('websiteUrl', e.target.value)}
                                            className={`w-full pl-9 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold-500/20 outline-none transition-all ${errors.websiteUrl ? 'border-red-500' : 'border-gray-200'}`}
                                            placeholder="https://..."
                                        />
                                    </div>
                                    {errors.websiteUrl && <p className="text-red-500 text-xs mt-1">{errors.websiteUrl}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-2.5 text-gray-400 h-4 w-4" />
                                        <input
                                            type="email"
                                            value={formData.contactEmail}
                                            onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                                            className={`w-full pl-9 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold-500/20 outline-none transition-all ${errors.contactEmail ? 'border-red-500' : 'border-gray-200'}`}
                                            placeholder="hello@studio.com"
                                        />
                                    </div>
                                    {errors.contactEmail && <p className="text-red-500 text-xs mt-1">{errors.contactEmail}</p>}
                                </div>
                            </div>




                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-3 text-gray-400 h-4 w-4" />
                                    <textarea
                                        value={formData.address}
                                        onChange={(e) => handleInputChange('address', e.target.value)}
                                        rows="3"
                                        className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold-500/20 outline-none"
                                        placeholder="Studio address..."
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Logos Card */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Upload size={18} className="text-gold-500" /> Logos
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Primary Logo */}
                            <div className="space-y-3">
                                <label className="block text-sm font-medium text-gray-700">Primary Logo (Light Mode)</label>
                                <div className="relative group border-2 border-dashed border-gray-200 rounded-xl p-4 flex flex-col items-center justify-center bg-gray-50 min-h-[160px] hover:bg-gray-100 transition-colors">
                                    {formData.primaryLogo ? (
                                        <div className="relative w-full h-32 flex items-center justify-center">
                                            <img src={formData.primaryLogo} alt="Primary Logo" className="max-h-full max-w-full object-contain" />
                                            <button
                                                onClick={() => setFormData(prev => ({ ...prev, primaryLogo: "" }))}
                                                className="absolute -top-2 -right-2 bg-white text-red-500 p-1.5 rounded-full shadow-md border hover:bg-red-50"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="text-center text-gray-400">
                                            <Upload className="mx-auto h-8 w-8 mb-2 opacity-50" />
                                            <span className="text-xs">Click to upload</span>
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleImageUpload('primaryLogo', e)}
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                    />
                                </div>
                                <p className="text-xs text-gray-500 text-center">Used in Header, Invoices & White backgrounds</p>
                            </div>

                            {/* Secondary Logo */}
                            <div className="space-y-3">
                                <label className="block text-sm font-medium text-gray-700">Secondary Logo (Dark/Footer)</label>
                                <div className="relative group border-2 border-dashed border-gray-200 rounded-xl p-4 flex flex-col items-center justify-center bg-gray-900 min-h-[160px] hover:bg-gray-800 transition-colors">
                                    {formData.secondaryLogo ? (
                                        <div className="relative w-full h-32 flex items-center justify-center">
                                            <img src={formData.secondaryLogo} alt="Secondary Logo" className="max-h-full max-w-full object-contain" />
                                            <button
                                                onClick={() => setFormData(prev => ({ ...prev, secondaryLogo: "" }))}
                                                className="absolute -top-2 -right-2 bg-white text-red-500 p-1.5 rounded-full shadow-md border hover:bg-red-50"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="text-center text-gray-500">
                                            <Upload className="mx-auto h-8 w-8 mb-2 opacity-30" />
                                            <span className="text-xs">Click to upload</span>
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleImageUpload('secondaryLogo', e)}
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                    />
                                </div>
                                <p className="text-xs text-gray-500 text-center">Used in Footer & Dark backgrounds</p>
                            </div>
                        </div>
                    </div>

                    {/* Login / Hero Background */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mt-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Upload size={18} className="text-gold-500" /> Login / Hero Background
                        </h2>

                        <div className="relative group border-2 border-dashed border-gray-200 rounded-xl p-4 flex items-center justify-center bg-gray-50 min-h-[160px]">
                            {formData.backgroundImage ? (
                                <div className="relative w-full h-40 flex items-center justify-center">
                                    <img src={formData.backgroundImage} alt="Background preview" className="w-full h-full object-cover rounded-md" />
                                    <button
                                        onClick={() => setFormData(prev => ({ ...prev, backgroundImage: "" }))}
                                        className="absolute -top-2 -right-2 bg-white text-red-500 p-1.5 rounded-full shadow-md border hover:bg-red-50"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            ) : (
                                <div className="text-center text-gray-400">
                                    <Upload className="mx-auto h-8 w-8 mb-2 opacity-50" />
                                    <span className="text-xs">Click to upload (recommended 1200x800)</span>
                                </div>
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleImageUpload('backgroundImage', e)}
                                className="absolute inset-0 opacity-0 cursor-pointer"
                            />
                        </div>
                        <p className="text-xs text-gray-500 mt-2">Used on the login/hero panel for branding.</p>
                    </div>
                </div>

                {/* Right Col: Social Media */}
                <div className="space-y-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-full">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                <LinkIcon size={18} className="text-gold-500" /> Social Links
                            </h2>
                            <button onClick={addSocialLink} className="text-xs bg-gold-50 text-gold-600 px-3 py-1.5 rounded-full font-medium hover:bg-gold-100 transition-colors">
                                + Add Link
                            </button>
                        </div>

                        <div className="space-y-4 max-h-[600px] overflow-y-auto px-1 -mx-1 custom-scrollbar">
                            {formData.socialLinks.length === 0 && (
                                <div className="text-center py-8 text-gray-400 text-sm italic">
                                    No social links added yet.
                                </div>
                            )}

                            {formData.socialLinks.map((link, index) => (
                                <div key={index} className="bg-gray-50 rounded-xl p-3 border border-gray-100 group animate-in slide-in-from-right-2 duration-300">
                                    <div className="flex justify-between items-start mb-2">
                                        <select
                                            value={link.platform}
                                            onChange={(e) => handleSocialChange(index, "platform", e.target.value)}
                                            className="bg-white border text-sm font-medium border-gray-200 rounded-md px-2 py-1 text-gray-700 outline-none focus:border-gold-500"
                                        >
                                            {PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
                                        </select>
                                        <div className="flex items-center gap-2">
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input type="checkbox" checked={link.active} onChange={(e) => handleSocialChange(index, "active", e.target.checked)} className="sr-only peer" />
                                                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-500"></div>
                                            </label>
                                            <button onClick={() => removeSocialLink(index)} className="text-gray-400 hover:text-red-500 transition-colors">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                    <input
                                        type="text"
                                        value={link.url}
                                        onChange={(e) => handleSocialChange(index, "url", e.target.value)}
                                        placeholder={`https://${link.platform.toLowerCase()}.com/...`}
                                        className={`w-full text-xs px-3 py-2 bg-white border rounded-md outline-none focus:border-gold-500 transition-all ${errors[`social_${index}`] ? 'border-red-500' : 'border-gray-200'}`}
                                    />
                                    {errors[`social_${index}`] && <p className="text-red-500 text-xs mt-1">{errors[`social_${index}`]}</p>}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
