import {
  LayoutDashboard,
  ArrowLeftRight,
  Wallet,
  Layers,
  BarChart3,
  Settings,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  RotateCw,
} from "lucide-react";

import { useNavigate, useLocation } from "react-router-dom";

export default function Sidebar({ collapsed, setCollapsed, accounts = [] }) {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", path: "/", icon: <LayoutDashboard size={18} /> },
    { name: "Transactions", path: "/transactions", icon: <ArrowLeftRight size={18} /> },
    { name: "Accounts", path: "/accounts", icon: <Wallet size={18} /> },
    { name: "Categories", path: "/categories", icon: <Layers size={18} /> },
    { name: "Reports", path: "/reports", icon: <BarChart3 size={18} /> },
  ];

  return (
    <div
      className={`h-screen fixed left-0 top-0 bg-white dark:bg-zinc-950 border-r border-gray-200 dark:border-zinc-800 flex flex-col transition-all duration-300 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* TOP HEADER */}
      <div className="flex items-center justify-between px-3 py-3">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 dark:border-zinc-800 hover:bg-gray-100 dark:hover:bg-zinc-900 transition"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>

        {!collapsed && (
          <button className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-gray-100 dark:hover:bg-zinc-900 transition">
            <RotateCw size={18} />
          </button>
        )}
      </div>

      {/* MENU */}
      <div className="flex flex-col gap-1 px-3 mt-2">
        {menuItems.map((item) => (
          <button
            key={item.name}
            onClick={() => navigate(item.path)}
            className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition
              ${
                location.pathname === item.path
                  ? "bg-indigo-50 dark:bg-zinc-900 text-indigo-600 dark:text-indigo-400"
                  : "text-gray-700 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-900"
              }
            `}
          >
            <span className="text-gray-500 dark:text-zinc-400">{item.icon}</span>
            {!collapsed && <span>{item.name}</span>}
          </button>
        ))}
      </div>

      {/* ACCOUNTS DASHBOARD */}
      {!collapsed && (
        <div className="px-4 mt-6">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
              Accounts
            </h3>
            <span className="text-xs text-gray-500">{accounts.length}</span>
          </div>

          <div className="bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-3 space-y-2 shadow-sm">
            {accounts.length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-3">
                No accounts yet
              </p>
            ) : (
              accounts.map((acc) => (
                <div
                  key={acc._id}
                  className="flex justify-between items-center px-3 py-2 rounded-xl hover:bg-white dark:hover:bg-zinc-950 transition"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <p className="text-sm font-medium text-gray-700 dark:text-zinc-200">
                      {acc.name}
                    </p>
                  </div>

                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    ₹{acc.balance.toFixed(2)}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Bottom links */}
      <div className="mt-auto flex flex-col gap-2 px-4 pb-6 text-sm">
        <button className="flex items-center gap-2 text-gray-600 dark:text-zinc-400 hover:underline">
          <HelpCircle size={18} />
          {!collapsed && "Get Help"}
        </button>

        <button className="flex items-center gap-2 text-gray-600 dark:text-zinc-400 hover:underline">
          <Settings size={18} />
          {!collapsed && "Settings"}
        </button>
      </div>
    </div>
  );
}
