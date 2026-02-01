import React, { useMemo, useState } from "react";

const defaultProfile = {
  name: "Aarohi Kulkarni",
  role: "Lead Photographer",
  location: "Pune, India",
  bio: "Story-driven photographer crafting soulful wedding experiences across India.",
  email: "aarohi@lumina.studio",
  phone: "+91 98765 12345",
  socials: {
    instagram: "@aarohishoots",
    behance: "behance.net/aarohi",
    website: "lumina.studio",
  },
  stats: {
    shoots: 142,
    avgRating: 4.9,
    turnaroundDays: 7,
  },
  focus: ["Wedding", "Editorial", "Documentary"],
  gear: {
    cameras: ["Sony A1", "Sony A7SIII"],
    lenses: ["24-70 GM", "50mm 1.2 GM", "70-200 GM"],
    lighting: ["Profoto B10", "Nanlite Pavotube"],
  },
  payoutMethod: "HDFC Bank •••• 8123",
  backupPayout: "UPI • aarohi@ibl",
};

const activityLog = [
  { id: 1, title: "Updated custom preset pack", timestamp: "Today • 09:24", type: "preset" },
  { id: 2, title: "Uploaded Aditi & Neel prewedding selects", timestamp: "Yesterday • 21:10", type: "upload" },
  { id: 3, title: "Signed Studio Samarth NDA", timestamp: "Jan 06 • 18:52", type: "contract" },
  { id: 4, title: "Synced lighting checklist", timestamp: "Jan 04 • 07:35", type: "gear" },
];

export default function UserProfile() {
  const [profile, setProfile] = useState(defaultProfile);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [preferences, setPreferences] = useState({
    notifications: {
      briefs: true,
      payouts: true,
      reminders: false,
    },
    security: {
      mfa: true,
      biometric: false,
      deviceAlerts: true,
    },
  });

  const shootsPerFocus = useMemo(() => {
    return profile.focus.map((focusArea, index) => ({
      label: focusArea,
      value: [42, 31, 24][index] || 12,
    }));
  }, [profile.focus]);

  function togglePref(section, key) {
    setPreferences((prev) => ({
      ...prev,
      [section]: { ...prev[section], [key]: !prev[section][key] },
    }));
  }

  function handleBioChange(e) {
    setProfile((prev) => ({ ...prev, bio: e.target.value }));
  }

  return (
    <section className="page-shell mt-4">
      <header className="rounded-4xl border border-[#e6eaf2] bg-gradient-to-br from-white via-[#fdfefe] to-[#f5f7fb] p-6 text-charcoal-900 shadow-[0_25px_80px_rgba(15,23,42,0.08)]">
        <div className="flex flex-wrap items-center gap-6">
          <div className="h-20 w-20 rounded-2xl bg-amber-50 p-1">
            <div className="flex h-full items-center justify-center rounded-2xl bg-white text-3xl font-semibold text-amber-700">
              {profile.name
                .split(" ")
                .map((part) => part[0])
                .join("")}
            </div>
          </div>
          <div className="flex-1 min-w-[200px]">
            <h1 className="text-3xl font-semibold text-charcoal-900">{profile.name}</h1>
            <p className="text-sm text-slate-600">
              {profile.role} • {profile.location}
            </p>
            <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-600">
              {profile.focus.map((item) => (
                <span key={item} className="rounded-full border border-slate-200 bg-white px-3 py-1">
                  {item}
                </span>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap gap-3 text-sm text-slate-600">
            <InfoChip label="Email" value={profile.email} />
            <InfoChip label="WhatsApp" value={profile.phone} />
            <InfoChip label="Site" value={profile.socials.website} />
          </div>
        </div>
        <dl className="mt-6 grid gap-4 text-center sm:grid-cols-3">
          <Metric label="Shoots delivered" value={profile.stats.shoots} />
          <Metric label="Average rating" value={`${profile.stats.avgRating}★`} />
          <Metric label="Turnaround" value={`${profile.stats.turnaroundDays} days`} />
        </dl>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1.8fr,1fr]">
        <div className="mt-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-charcoal-900">About & Bio</h2>
                <p className="text-xs text-slate-500">Public profile copy used in proposals.</p>
              </div>
              <button className="text-sm font-semibold text-gold-600">Share profile</button>
            </div>
            <textarea
              value={profile.bio}
              onChange={handleBioChange}
              className="mt-4 w-full rounded-xl border border-slate-200 px-3 py-3 text-sm text-charcoal-900 shadow-inner focus:border-gold-500 focus:ring-1 focus:ring-gold-500"
              rows={4}
            />
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div>
                <h3 className="text-xs uppercase tracking-[0.35em] text-slate-500">Primary Platforms</h3>
                <div className="mt-3 space-y-2 text-sm text-charcoal-900">
                  <p>Instagram — {profile.socials.instagram}</p>
                  <p>Behance — {profile.socials.behance}</p>
                  <p>Website — {profile.socials.website}</p>
                </div>
              </div>
              <div>
                <h3 className="text-xs uppercase tracking-[0.35em] text-slate-500">Speciality Breakdown</h3>
                <ul className="mt-3 space-y-2 text-sm text-charcoal-900">
                  {shootsPerFocus.map((item) => (
                    <li key={item.label} className="flex items-center justify-between">
                      <span>{item.label}</span>
                      <span>{item.value} shoots</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-charcoal-900">Camera & Lighting Loadout</h2>
              <button className="text-sm font-semibold text-slate-600">Export checklist</button>
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-3 text-sm text-charcoal-900">
              <div>
                <h3 className="text-xs uppercase tracking-[0.35em] text-slate-500">Bodies</h3>
                <ul className="mt-2 space-y-1">
                  {profile.gear.cameras.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-xs uppercase tracking-[0.35em] text-slate-500">Glass</h3>
                <ul className="mt-2 space-y-1">
                  {profile.gear.lenses.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-xs uppercase tracking-[0.35em] text-slate-500">Lighting</h3>
                <ul className="mt-2 space-y-1">
                  {profile.gear.lighting.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-charcoal-900">Payout Preferences</h2>
              <button className="text-sm font-semibold text-slate-600">Update banking</button>
            </div>
            <div className="mt-4 grid gap-4 text-sm text-charcoal-900 md:grid-cols-2">
              <div className="rounded-xl border border-slate-100 p-4">
                <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Primary</p>
                <p className="mt-2 font-semibold">{profile.payoutMethod}</p>
                <p className="text-xs text-slate-500">Weekly settlements • Instant alerts</p>
              </div>
              <div className="rounded-xl border border-slate-100 p-4">
                <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Backup</p>
                <p className="mt-2 font-semibold">{profile.backupPayout}</p>
                <p className="text-xs text-slate-500">Used when bank is offline</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-charcoal-900">Activity Timeline</h2>
            <ul className="mt-4 space-y-3 text-sm text-slate-600">
              {activityLog.map((item) => (
                <li key={item.id} className="rounded-xl bg-slate-50 p-3">
                  <p className="font-semibold text-charcoal-900">{item.title}</p>
                  <p className="text-xs text-slate-500">{item.timestamp}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-charcoal-900">Notifications</h2>
            <div className="mt-4 space-y-3 text-sm text-charcoal-900">
              <ToggleRow
                label="New brief alerts"
                helper="Instant ping when a project matches your style"
                active={preferences.notifications.briefs}
                onToggle={() => togglePref("notifications", "briefs")}
              />
              <ToggleRow
                label="Payout confirmations"
                helper="Status texts for every settlement"
                active={preferences.notifications.payouts}
                onToggle={() => togglePref("notifications", "payouts")}
              />
              <ToggleRow
                label="Shoot reminders"
                helper="Get pre-call prep reminders"
                active={preferences.notifications.reminders}
                onToggle={() => togglePref("notifications", "reminders")}
              />
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-charcoal-900">Security</h2>

            <button
              onClick={() => setPasswordModalOpen(true)}
              className="mt-4 w-full rounded-lg bg-gold-500 py-2.5 text-sm font-semibold text-white transition hover:bg-gold-600 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:ring-offset-2"
            >
              Change Password
            </button>

            <div className="mt-4 space-y-3 text-sm text-charcoal-900 border-t border-slate-100 pt-4">
              <ToggleRow
                label="Multi-factor sign-in"
                helper="Verify logins with OTP + device push"
                active={preferences.security.mfa}
                onToggle={() => togglePref("security", "mfa")}
              />
              <ToggleRow
                label="Face ID on mobile"
                helper="Use biometric unlock inside the app"
                active={preferences.security.biometric}
                onToggle={() => togglePref("security", "biometric")}
              />
              <ToggleRow
                label="New device alerts"
                helper="Get notified whenever a fresh device signs in"
                active={preferences.security.deviceAlerts}
                onToggle={() => togglePref("security", "deviceAlerts")}
              />
            </div>
          </div>
        </div>
      </div>
      <ChangePasswordModal isOpen={passwordModalOpen} onClose={() => setPasswordModalOpen(false)} />
    </section>
  );
}

function Metric({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
      <dt className="text-xs uppercase tracking-[0.35em] text-slate-500">{label}</dt>
      <dd className="mt-1 text-2xl font-semibold text-charcoal-900">{value}</dd>
    </div>
  );
}

function InfoChip({ label, value }) {
  return (
    <div className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs uppercase tracking-[0.35em] text-slate-500">
      <span className="text-slate-500">{label}: </span>
      <span className="tracking-normal text-charcoal-900">{value}</span>
    </div>
  );
}

function ToggleRow({ label, helper, active, onToggle }) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-xl border border-slate-100 p-3">
      <div>
        <p className="font-semibold text-charcoal-900">{label}</p>
        <p className="text-xs text-slate-500">{helper}</p>
      </div>
      <button
        type="button"
        onClick={onToggle}
        className={`relative flex h-6 w-12 items-center rounded-full transition ${active ? "bg-gold-500" : "bg-slate-200"
          }`}
      >
        <span
          className={`h-5 w-5 transform rounded-full bg-white shadow transition ${active ? "translate-x-6" : "translate-x-1"}`}
        />
      </button>
    </div>
  );
}

function ChangePasswordModal({ isOpen, onClose }) {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get user ID from local storage
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  if (!isOpen) return null;

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    if (newPassword.length < 4) {
      setError("Password must be at least 4 characters.");
      return;
    }

    setLoading(true);

    try {
      // NOTE: We are using a direct update.
      // In a real app, you should verify 'oldPassword' on the server.
      const res = await fetch(`/api/users/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ password: newPassword })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to update password");
      }

      alert("Password updated successfully!");
      onClose();
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <h2 className="text-xl font-semibold text-charcoal-900">Change Password</h2>
        <p className="text-sm text-slate-500 mb-6">Enter your details to set a new password.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">Current Password</label>
            <input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-gold-500 focus:outline-none focus:ring-1 focus:ring-gold-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-gold-500 focus:outline-none focus:ring-1 focus:ring-gold-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-gold-500 focus:outline-none focus:ring-1 focus:ring-gold-500"
              required
            />
          </div>

          {error && <p className="text-sm text-red-600 font-medium">{error}</p>}

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 transition"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-gold-500 px-4 py-2 text-sm font-medium text-white hover:bg-gold-600 transition disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
