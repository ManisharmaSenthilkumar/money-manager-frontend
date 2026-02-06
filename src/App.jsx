import { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import TransactionsPage from "./pages/TransactionsPage";
import AccountsPage from "./pages/AccountsPage";
import CategoriesPage from "./pages/CategoriesPage";
import ReportsPage from "./pages/ReportsPage";
import Welcome from "./components/Welcome";

import { getTransactions, getAccounts } from "./services/api";

import { Routes, Route, useLocation } from "react-router-dom";

export default function App() {
  const [transactions, setTransactions] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [dark, setDark] = useState(false);
  const [userName, setUserName] = useState(localStorage.getItem("userName"));
  const [collapsed, setCollapsed] = useState(false);

  const [accounts, setAccounts] = useState([]);

  const location = useLocation();

  const loadAccounts = async () => {
    const res = await getAccounts();
    setAccounts(res.data);
  };

  const loadData = async () => {
    const res = await getTransactions();
    setTransactions(res.data);
    setFiltered(res.data);
  };

  useEffect(() => {
    loadData();
    loadAccounts();
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  // Welcome Page
  if (!userName) {
    return <Welcome onNext={(name) => setUserName(name)} />;
  }

  const pageTitleMap = {
    "/": "Dashboard",
    "/transactions": "Transactions",
    "/accounts": "Accounts",
    "/categories": "Categories",
    "/reports": "Reports",
  };

  const activePage = pageTitleMap[location.pathname] || "Dashboard";

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-zinc-950 text-gray-900 dark:text-zinc-100 transition-colors">
      {/* Sidebar */}
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        accounts={accounts}
      />

      {/* Main Wrapper */}
      <div
        className={`flex-1 bg-gray-50 dark:bg-zinc-950 transition-all duration-300 ${
          collapsed ? "ml-20" : "ml-64"
        }`}
      >
        {/* TOP BAR FIXED */}
        <div
          className="h-16 fixed top-0 right-0 z-50 flex items-center justify-between px-8 border-b border-gray-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl transition-all duration-300"
          style={{ left: collapsed ? "5rem" : "16rem" }}
        >
          <div>
            <h2 className="text-lg font-semibold">{activePage}</h2>
            <p className="text-sm text-gray-500 dark:text-zinc-400">
              Hello, {userName} 👋
            </p>
          </div>

          <button
            onClick={() => setDark(!dark)}
            className="px-4 py-2 rounded-full border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:bg-gray-100 dark:hover:bg-zinc-800 transition"
          >
            {dark ? "☀️ Light" : "🌙 Dark"}
          </button>
        </div>

        {/* SCROLLABLE CONTENT AREA */}
        <div className="h-screen overflow-y-auto pt-20">
          <div className="max-w-6xl mx-auto px-8 pb-12">
            <Routes>
              <Route
                path="/"
                element={<Dashboard transactions={filtered} reload={loadData} />}
              />

              <Route
                path="/transactions"
                element={
                  <TransactionsPage
                    transactions={filtered || []}
                    reload={async () => {
                      await loadData();
                      await loadAccounts();
                    }}
                  />
                }
              />

              <Route path="/accounts" element={<AccountsPage />} />

              <Route
                path="/categories"
                element={<CategoriesPage transactions={filtered || []} />}
              />

              <Route
                path="/reports"
                element={<ReportsPage transactions={filtered || []} />}
              />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
}
