import { NavLink, useLocation } from "react-router-dom";
import { useSettings } from "../hooks/useSettings";
import { LogOut } from "lucide-react";

const items = [
  // Operations & Management
  { to: "/admin-dashboard", label: "Dashboard" },
  { to: "/admin-calendar", label: "Calendar" },
  { to: "/admin-quotations", label: "Quotations" },
  { to: "/admin-orders", label: "Orders" },
  { to: "/admin-invoices", label: "Invoices" },
  { to: "/admin-clients", label: "Clients" },

  // Website Content
  { to: "/admin-gallery", label: "Portfolio" },
  { to: "/admin-films", label: "Films" },
  { to: "/admin-love-stories", label: "Love Stories" },
  { to: "/admin-slider", label: "Slider" },
  { to: "/admin-popup", label: "Popup Manager" },
  { to: "/admin-testimonials", label: "Testimonials" },
  { to: "/admin-team", label: "Team Management" },

  // Incoming Interactions
  { to: "/admin-enquiries", label: "Enquiries" },
  { to: "/admin-contact-messages", label: "Contact Messages" },

  // System Administration
  { to: "/admin-users", label: "Users" },
  { to: "/admin-accessories", label: "Accessories" },
  { to: "/admin-common-types", label: "Common Types" },
  { to: "/admin-settings", label: "Global Settings" },
];

export default function Navigation({ isMobileOpen = false, isOpen = true, onClose = () => { }, onLogout }) {
  return (
    <>
      <aside
        aria-label="Main navigation"
        className="hidden flex-shrink-0 lg:flex h-screen sticky top-0 transition-all duration-300 ease-in-out"
        style={{ width: isOpen ? 240 : 0, opacity: isOpen ? 1 : 0 }}
      >
        <div className="flex flex-col h-full border-r border-gold-200 bg-white p-4 dark:border-charcoal-800 dark:bg-charcoal-900 overflow-hidden">
          <BrandHeader />
          <div className="flex-1 overflow-y-auto overflow-x-hidden -mr-2 pr-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            <NavList />
          </div>
          {/* Logout Section at the bottom */}
          <div className="pt-4 mt-auto border-t border-gray-100 dark:border-charcoal-800">
            <button
              onClick={onLogout}
              className="flex items-center w-full px-3 py-2 text-sm font-medium text-red-600 transition rounded hover:bg-red-50 dark:hover:bg-red-900/10"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {isMobileOpen && <div className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={onClose} />}

      <aside
        aria-label="Mobile navigation"
        className={`fixed inset-y-0 left-0 z-50 w-72 transform bg-white shadow-2xl transition-transform duration-300 dark:bg-charcoal-900 lg:hidden ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex h-full flex-col border-r border-gold-200 dark:border-charcoal-800 overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 dark:border-charcoal-800 flex-shrink-0">
            <BrandHeader compact />
            <button
              type="button"
              aria-label="Close navigation"
              className="rounded-md border border-slate-200 px-3 py-1 text-sm font-semibold text-charcoal-700 hover:bg-slate-100 dark:border-charcoal-700 dark:text-white"
              onClick={onClose}
            >
              ✕
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 flex flex-col">
            <NavList onNavigate={onClose} />
            <div className="pt-4 mt-auto border-t border-gray-100 dark:border-charcoal-800">
              <button
                onClick={() => {
                  onClose();
                  if (onLogout) onLogout();
                }}
                className="flex items-center w-full px-3 py-2 text-sm font-medium text-red-600 transition rounded hover:bg-red-50 dark:hover:bg-red-900/10"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

function BrandHeader({ compact = false }) {
  const { data: settings } = useSettings();
  const businessName = settings?.businessName || "The Patil Photography";

  return (
    <div className={`flex items-center gap-2 ${compact ? "" : "mb-4"}`}>
      {settings?.primaryLogo ? (
        <img src={settings.primaryLogo} alt="Logo" className="h-10 w-10 object-contain rounded-lg bg-gradient-to-br from-gold-500 to-gold-600 p-1" />
      ) : (
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-gold-500 to-gold-600">
          <span className="font-playfair text-lg font-bold text-white">P</span>
        </div>
      )}
      <div>
        <h1 className="font-playfair text-sm font-bold text-charcoal-900 dark:text-white leading-tight">{businessName}</h1>
      </div>
    </div>
  );
}

function NavList({ onNavigate }) {
  const handleClick = onNavigate ? () => onNavigate() : undefined;
  return (
    <nav className="flex-1">
      <ul className="space-y-2">
        {items.map((it) => (
          <li key={it.to}>
            <NavLink
              to={it.to}
              onClick={handleClick}
              className={({ isActive }) =>
                `block rounded px-3 py-2 text-sm font-medium transition ${isActive ? "bg-gold-500 text-white" : "text-charcoal-700 hover:bg-gold-50 dark:text-charcoal-200"}`
              }
            >
              {it.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
