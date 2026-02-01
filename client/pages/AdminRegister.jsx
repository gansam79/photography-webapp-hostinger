import React, { useState } from "react";

const roles = [
  { value: "Producer", description: "Plans shoots, books freelancers, and owns run sheets." },
  { value: "Post Manager", description: "Handles editing vendors, QC, and delivery cadence." },
  { value: "Finance", description: "Controls invoices, payouts, and budgets." },
  { value: "Super Admin", description: "Full-stack control for studio owners." },
];

const permissions = [
  { group: "Production", items: ["Calendar", "Shotlists", "Crew Assignments"] },
  { group: "Media", items: ["Gallery", "Client Deliveries", "Cloud Sync"] },
  { group: "Finance", items: ["Invoices", "Quotations", "Payouts"] },
  { group: "CRM", items: ["Clients", "Reminders", "Campaigns"] },
];

const starterProfile = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  role: "Producer",
  timezone: "Asia/Kolkata",
  backupEmail: "",
  notes: "",
};

export default function AdminRegister() {
  const [profile, setProfile] = useState(starterProfile);
  const [selectedPermissions, setSelectedPermissions] = useState(["Calendar", "Invoices", "Clients"]);
  const [sendInvite, setSendInvite] = useState(true);
  const [requireMfa, setRequireMfa] = useState(true);

  const togglePermission = (item) => {
    setSelectedPermissions((prev) =>
      prev.includes(item) ? prev.filter((perm) => perm !== item) : [...prev, item]
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <section className="page-shell mt-4">
      <header className="rounded-4xl border border-[#e6eaf2] bg-gradient-to-br from-white via-[#fdfefe] to-[#f5f7fb] p-6 text-charcoal-900 shadow-[0_25px_80px_rgba(15,23,42,0.08)]">
        <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Onboard</p>
        <h1 className="mt-2 text-3xl font-semibold text-charcoal-900">Invite a Core Admin</h1>
        <p className="mt-2 text-sm text-slate-600">
          Add producers, post managers, finance partners, or co-founders with tailored permissions.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          {roles.map((role) => (
            <button
              key={role.value}
              className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                profile.role === role.value
                  ? "border-amber-200 bg-amber-50 text-amber-700"
                  : "border-slate-200 text-slate-600 hover:border-slate-300"
              }`}
              onClick={() => setProfile((prev) => ({ ...prev, role: role.value }))}
              type="button"
            >
              {role.value}
            </button>
          ))}
        </div>
      </header>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-charcoal-900">Admin Details</h2>
        <p className="text-xs text-slate-500">Primary contact info used for invites and approvals.</p>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Field label="First Name" required>
            <input name="firstName" value={profile.firstName} onChange={handleChange} className="input" />
          </Field>
          <Field label="Last Name" required>
            <input name="lastName" value={profile.lastName} onChange={handleChange} className="input" />
          </Field>
          <Field label="Email" required>
            <input name="email" type="email" value={profile.email} onChange={handleChange} className="input" />
          </Field>
          <Field label="WhatsApp">
            <input name="phone" value={profile.phone} onChange={handleChange} className="input" />
          </Field>
          <Field label="Timezone">
            <select name="timezone" value={profile.timezone} onChange={handleChange} className="input">
              <option>Asia/Kolkata (IST)</option>
              <option>Asia/Dubai (GST)</option>
              <option>Europe/London (GMT)</option>
              <option>America/New_York (EST)</option>
            </select>
          </Field>
          <Field label="Backup email">
            <input name="backupEmail" value={profile.backupEmail} onChange={handleChange} className="input" />
          </Field>
        </div>
        <Field label="Welcome note" helper="Optional note shared in the invite email" className="mt-4">
          <textarea name="notes" value={profile.notes} onChange={handleChange} className="input" rows={3} />
        </Field>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-charcoal-900">Role Description</h2>
          <p className="text-xs text-slate-500">Define what this admin handles daily.</p>
          <div className="mt-4 space-y-4 text-sm text-charcoal-900">
            {roles
              .filter((role) => role.value === profile.role)
              .map((role) => (
                <div key={role.value} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                  <p className="font-semibold">{role.value}</p>
                  <p className="text-xs text-slate-500">{role.description}</p>
                </div>
              ))}
            <ul className="list-disc space-y-2 pl-5 text-xs text-slate-600">
              <li>Seen in workflow tables + approvals</li>
              <li>Gets weekly pulse emails</li>
              <li>Can be assigned to shoots & deliverables</li>
            </ul>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-charcoal-900">Permissions</h2>
          <p className="text-xs text-slate-500">Pick or remove modules for this admin.</p>
          <div className="mt-4 space-y-4">
            {permissions.map((group) => (
              <div key={group.group} className="rounded-2xl border border-slate-100 p-4">
                <p className="text-xs uppercase tracking-[0.35em] text-slate-500">{group.group}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => togglePermission(item)}
                      className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
                        selectedPermissions.includes(item)
                          ? "border-gold-500 bg-gold-50 text-gold-600"
                          : "border-slate-200 text-slate-500"
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-charcoal-900">Security Policies</h2>
          <div className="mt-4 space-y-3 text-sm text-charcoal-900">
            <ToggleRow
              label="Send invite email"
              helper="Deliver studio welcome kit + onboarding"
              active={sendInvite}
              onToggle={() => setSendInvite((prev) => !prev)}
            />
            <ToggleRow
              label="Require MFA"
              helper="Access gated by OTP + Face ID"
              active={requireMfa}
              onToggle={() => setRequireMfa((prev) => !prev)}
            />
            <div className="rounded-xl border border-amber-100 bg-amber-50 p-3 text-xs text-amber-700">
              <p className="font-semibold">Tip</p>
              <p>
                Enable MFA for finance admins to protect payouts, host env creds, and client assets.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-charcoal-900">Summary</h2>
          <div className="mt-4 space-y-3 text-sm text-charcoal-900">
            <SummaryRow label="Role" value={profile.role} />
            <SummaryRow label="Modules" value={`${selectedPermissions.length} selected`} />
            <SummaryRow label="Notifications" value={sendInvite ? "Invite + weekly pulse" : "Manual onboarding"} />
            <SummaryRow label="Security" value={requireMfa ? "MFA mandatory" : "Password only"} />
          </div>
          <button className="mt-6 w-full rounded-xl bg-gold-500 py-3 text-sm font-semibold text-white shadow hover:bg-gold-600">
            Generate Invite Link
          </button>
          <p className="mt-2 text-center text-xs text-slate-500">
            Link expires in 72 hours. You can resend later.
          </p>
        </div>
      </div>
    </section>
  );
}

function Field({ label, children, required, helper, className = "" }) {
  return (
    <label className={`block text-sm font-medium text-slate-700 ${className}`}>
      {label}
      {required && <span className="text-rose-500"> *</span>}
      {helper && <p className="text-xs text-slate-500">{helper}</p>}
      <div className="mt-1">{children}</div>
    </label>
  );
}

function ToggleRow({ label, helper, active, onToggle }) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-xl border border-slate-100 p-3">
      <div>
        <p className="font-semibold text-charcoal-900">{label}</p>
        <p className="text-xs text-slate-500">{helper}</p>
      </div>
      <button type="button" onClick={onToggle} className={`relative flex h-6 w-12 items-center rounded-full transition ${active ? "bg-gold-500" : "bg-slate-200"}`}>
        <span className={`h-5 w-5 transform rounded-full bg-white shadow transition ${active ? "translate-x-6" : "translate-x-1"}`} />
      </button>
    </div>
  );
}

function SummaryRow({ label, value }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <p className="text-slate-500">{label}</p>
      <p className="font-semibold text-charcoal-900">{value}</p>
    </div>
  );
}
