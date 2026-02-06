import TransactionDrawer from "../components/TransactionDrawer";
import {
  addTransaction,
  updateTransaction,
  deleteTransaction,
} from "../services/api";

import { useMemo, useState } from "react";
import {
  Plus,
  Download,
  Search,
  Pencil,
  Filter,
  X,
  ArrowDownLeft,
  ArrowUpRight,
  Repeat2,
} from "lucide-react";

export default function TransactionsPage({ transactions = [], reload }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [openDrawer, setOpenDrawer] = useState(false);
  const [selectedTx, setSelectedTx] = useState(null);

  // Show/Hide Filters
  const [showFilters, setShowFilters] = useState(false);

  // Filters
  const [division, setDivision] = useState("All");
  const [type, setType] = useState("All");
  const [category, setCategory] = useState("All");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const exportCSV = () => {
  if (!filtered.length) return;

  const headers = [
    "Type",
    "Amount",
    "Description",
    "Category",
    "Division",
    "Account From",
    "Account To",
    "Date",
  ];

  const rows = filtered.map((t) => [
    t.type,
    t.amount,
    t.description,
    t.category,
    t.division,
    t.accountFrom,
    t.accountTo || "",
    new Date(t.date).toLocaleString(),
  ]);

  const csvContent =
    "data:text/csv;charset=utf-8," +
    [headers, ...rows].map((e) => e.join(",")).join("\n");

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "transactions.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

  // Unique categories
  const categories = useMemo(() => {
    const cats = new Set();
    transactions.forEach((t) => {
      if (t.category) cats.add(t.category);
    });
    return ["All", ...Array.from(cats)];
  }, [transactions]);

  // Icon function
  const getTxIcon = (txType) => {
    if (txType === "income")
      return <ArrowDownLeft size={18} className="text-green-600" />;

    if (txType === "expense")
      return <ArrowUpRight size={18} className="text-red-500" />;

    if (txType === "transfer")
      return <Repeat2 size={18} className="text-indigo-500" />;

    return null;
  };

  // Apply filters
  const filtered = useMemo(() => {
    return (transactions || []).filter((t) => {
      const descMatch = (t.description || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const divisionMatch = division === "All" ? true : t.division === division;
      const typeMatch = type === "All" ? true : t.type === type;
      const categoryMatch = category === "All" ? true : t.category === category;

      // Date filter
      const txDate = new Date(t.date);

      const fromMatch = fromDate ? txDate >= new Date(fromDate) : true;
      const toMatch = toDate ? txDate <= new Date(toDate) : true;

      return (
        descMatch &&
        divisionMatch &&
        typeMatch &&
        categoryMatch &&
        fromMatch &&
        toMatch
      );
    });
  }, [transactions, searchTerm, division, type, category, fromDate, toDate]);

  // Group by date
  const grouped = useMemo(() => {
    const groups = {};

    filtered.forEach((t) => {
      const d = new Date(t.date);
      const today = new Date();
      const yesterday = new Date();
      yesterday.setDate(today.getDate() - 1);

      let label = d.toDateString();

      if (d.toDateString() === today.toDateString()) label = "Today";
      else if (d.toDateString() === yesterday.toDateString())
        label = "Yesterday";

      if (!groups[label]) groups[label] = [];
      groups[label].push(t);
    });

    return groups;
  }, [filtered]);

  const clearFilters = () => {
    setDivision("All");
    setType("All");
    setCategory("All");
    setFromDate("");
    setToDate("");
    setSearchTerm("");
  };

  return (
    <div className="bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200 dark:border-zinc-800">
        <h2 className="font-semibold text-lg">Transactions</h2>

        <div className="flex items-center gap-4">
          {/* Download */}
          <button
  onClick={exportCSV}
  className="text-gray-500 hover:text-black dark:hover:text-white"
>
  <Download size={18} />
</button>


          {/* Search */}
          <div className="flex items-center gap-2 border border-gray-200 dark:border-zinc-800 rounded-full px-4 py-2 bg-gray-50 dark:bg-zinc-900">
            <Search size={16} className="text-gray-400" />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search"
              className="bg-transparent outline-none text-sm w-44 text-black dark:text-white"
            />
          </div>

          {/* Add */}
          <button
            onClick={() => {
              setSelectedTx(null);
              setOpenDrawer(true);
            }}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition"
          >
            <Plus size={18} />
          </button>

          {/* Filters */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`w-9 h-9 flex items-center justify-center rounded-full border transition ${
              showFilters
                ? "bg-indigo-50 border-indigo-400 text-indigo-600 dark:bg-zinc-900 dark:border-indigo-500"
                : "border-gray-200 dark:border-zinc-800 text-gray-500 hover:text-black dark:hover:text-white"
            }`}
          >
            <Filter size={18} />
          </button>
        </div>
      </div>

      {/* FILTER SECTION */}
      <div className="border-b border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900">
        <div
          className={`transition-all duration-300 ease-in-out overflow-hidden ${
            showFilters ? "max-h-[250px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="px-6 py-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold text-gray-700 dark:text-zinc-200">
                Filters
              </p>

              <button
                onClick={clearFilters}
                className="text-xs flex items-center gap-1 text-gray-500 hover:text-black dark:hover:text-white transition"
              >
                <X size={14} /> Clear
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              {/* Division */}
              <select
                value={division}
                onChange={(e) => setDivision(e.target.value)}
                className="px-3 py-2 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-sm outline-none text-black dark:text-white"
              >
                <option value="All">All Divisions</option>
                <option value="Personal">Personal</option>
                <option value="Office">Office</option>
              </select>

              {/* Type */}
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="px-3 py-2 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-sm outline-none text-black dark:text-white"
              >
                <option value="All">All Types</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
                <option value="transfer">Transfer</option>
              </select>

              {/* Category */}
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="px-3 py-2 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-sm outline-none text-black dark:text-white"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>

              {/* From Date */}
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="px-3 py-2 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-sm outline-none text-black dark:text-white"
              />

              {/* To Date */}
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="px-3 py-2 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-sm outline-none text-black dark:text-white"
              />
            </div>
          </div>
        </div>
      </div>

      {/* LIST */}
      <div className="divide-y divide-gray-200 dark:divide-zinc-800">
        {Object.keys(grouped).length === 0 && (
  <div className="p-16 text-center">
    <p className="text-2xl font-extrabold text-gray-900 dark:text-white">
      No transactions yet 💸
    </p>

    <p className="text-sm text-gray-500 dark:text-zinc-400 mt-2 max-w-md mx-auto">
      Start tracking your income & expenses. Add your first transaction and make
      your money behave.
    </p>

    <button
      onClick={() => {
        setSelectedTx(null);
        setOpenDrawer(true);
      }}
      className="mt-6 px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-lg transition"
    >
      + Add Transaction
    </button>
  </div>
)}


        {Object.entries(grouped).map(([label, items]) => (
          <div key={label}>
            <div className="px-6 py-3 text-xs font-semibold text-gray-500 dark:text-zinc-400 bg-gray-50 dark:bg-zinc-900">
              {label}
            </div>

            {items.map((t) => (
              <div
                key={t._id}
                className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 dark:hover:bg-zinc-900 transition"
              >
                {/* LEFT */}
                <div className="flex items-center gap-4 w-[70%]">
                  {/* Icon */}
                  <div
                    className={`w-10 h-10 flex items-center justify-center rounded-xl border 
                    ${
                      t.type === "income"
                        ? "bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-900"
                        : t.type === "expense"
                        ? "bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-900"
                        : "bg-indigo-50 border-indigo-200 dark:bg-indigo-950 dark:border-indigo-900"
                    }`}
                  >
                    {getTxIcon(t.type)}
                  </div>

                  {/* Description */}
                  <div>
                    <p className="font-medium text-sm">
                      {t.description || t.category}
                    </p>

                    {/* Transfer account display */}
                    {t.type === "transfer" ? (
                      <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1">
                        {t.accountFrom} → {t.accountTo}
                      </p>
                    ) : (
                      <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1">
                        {t.accountFrom || "Manual account"}
                      </p>
                    )}

                    <p className="text-xs text-gray-400 mt-1">
                      {t.division} • {new Date(t.date).toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* RIGHT */}
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => {
                      setSelectedTx(t);
                      setOpenDrawer(true);
                    }}
                    className="text-gray-400 hover:text-gray-700 dark:hover:text-white transition"
                  >
                    <Pencil size={16} />
                  </button>

                  <span className="text-xs px-3 py-1 rounded-full bg-indigo-50 dark:bg-zinc-800 text-indigo-600 dark:text-indigo-300 font-semibold">
                    {t.category?.toUpperCase() || "OTHER"}
                  </span>

                  <p
                    className={`w-28 text-right font-semibold ${
                      t.type === "expense"
                        ? "text-red-500"
                        : t.type === "income"
                        ? "text-green-600"
                        : "text-indigo-500"
                    }`}
                  >
                    {t.type === "expense" ? "-" : "+"}₹{t.amount.toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Drawer */}
      <TransactionDrawer
        open={openDrawer}
        onClose={() => {
          setOpenDrawer(false);
          setSelectedTx(null);
        }}
        transaction={selectedTx}
        onSubmit={async (data) => {
          if (selectedTx) {
            await updateTransaction(selectedTx._id, data);
          } else {
            await addTransaction(data);
          }

          await reload();
          setOpenDrawer(false);
          setSelectedTx(null);
        }}
        onDelete={async (id) => {
          await deleteTransaction(id);
          await reload();
          setOpenDrawer(false);
          setSelectedTx(null);
        }}
      />
    </div>
  );
}
