import { useMemo, useState } from "react";
import { Search, Flame, Sparkles, ArrowUpDown } from "lucide-react";

/* PREMIUM CATEGORY ICONS */
const categoryIcons = {
  Food: "🍔",
  Groceries: "🛒",
  Fuel: "⛽",
  Petrol: "⛽",
  Diesel: "⛽",
  Movie: "🎬",
  Entertainment: "🎮",
  Shopping: "🛍️",
  Travel: "✈️",
  Rent: "🏠",
  EMI: "🏦",
  Loan: "💳",
  Recharge: "📱",
  Electricity: "⚡",
  WaterBill: "🚰",
  Internet: "📶",
  Medical: "🩺",
  Hospital: "🏥",
  Education: "📚",
  WorkExpenses: "💼",
  Office: "🏢",
  Salary: "💰",
  Investment: "📈",
  Savings: "💎",
  Gift: "🎁",
  Insurance: "🛡️",
  Taxi: "🚕",
  Bike: "🏍️",
  Car: "🚗",
  Restaurant: "🍽️",
  Coffee: "☕",
  Snacks: "🍟",
  Clothes: "👕",
  Electronics: "💻",
  Repair: "🔧",
  Beauty: "💄",
  Gym: "🏋️",
  Subscription: "📺",
  Donation: "🤝",
  Other: "🧾",
  food: "🍔",
  groceries: "🛒",
  fuel: "⛽",
  petrol: "⛽",
  diesel: "⛽",
  movie: "🎬",
  entertainment: "🎮",
  shopping: "🛍️",
  travel: "✈️",
  rent: "🏠",
  emi: "🏦",
  loan: "💳",
  recharge: "📱",
  electricity: "⚡",
  waterbill: "🚰",
  internet: "📶",
  medical: "🩺",
  hospital: "🏥",
  education: "📚",
  workexpenses: "💼",
  office: "🏢",
  salary: "💰",
  investment: "📈",
  savings: "💎",
  gift: "🎁",
  insurance: "🛡️",
  taxi: "🚕",
  bike: "🏍️",
  car: "🚗",
  restaurant: "🍽️",
  coffee: "☕",
  snacks: "🍟",
  clothes: "👕",
  electronics: "💻",
  repair: "🔧",
  beauty: "💄",
  gym: "🏋️",
  subscription: "📺",
  donation: "🤝",
};

export default function CategoriesPage({ transactions = [] }) {
  const [search, setSearch] = useState("");
  const [division, setDivision] = useState("All");
  const [sortBy, setSortBy] = useState("high"); // high | low | name

  const { list, totalExpense } = useMemo(() => {
    const map = {};

    transactions.forEach((t) => {
      if (t.type === "expense") {
        if (division !== "All" && t.division !== division) return;

        const cat = t.category || "Other";
        map[cat] = (map[cat] || 0) + t.amount;
      }
    });

    const totalExpense = Object.values(map).reduce((a, b) => a + b, 0);

    let list = Object.entries(map).map(([name, amount]) => ({
      name,
      amount,
      percent: totalExpense > 0 ? (amount / totalExpense) * 100 : 0,
    }));

    // Search filter
    if (search.trim()) {
      list = list.filter((c) =>
        c.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Sorting
    if (sortBy === "high") list.sort((a, b) => b.amount - a.amount);
    if (sortBy === "low") list.sort((a, b) => a.amount - b.amount);
    if (sortBy === "name") list.sort((a, b) => a.name.localeCompare(b.name));

    return { list, totalExpense };
  }, [transactions, division, search, sortBy]);

  const topCategory = list.length > 0 ? list[0] : null;

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <p className="text-sm text-gray-500 dark:text-zinc-400">
            Smart spending breakdown
          </p>
          <h2 className="text-3xl font-semibold tracking-tight text-black dark:text-white">
            Categories
          </h2>
        </div>

        <div className="flex items-center gap-3">
          {/* Division Toggle */}
          <div className="flex items-center gap-2 bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-full px-3 py-2 shadow-sm">
            <button
              onClick={() => setDivision("All")}
              className={`px-3 py-1 rounded-full text-sm transition ${
                division === "All"
                  ? "bg-indigo-500 text-white"
                  : "text-gray-600 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-900"
              }`}
            >
              All
            </button>

            <button
              onClick={() => setDivision("Personal")}
              className={`px-3 py-1 rounded-full text-sm transition ${
                division === "Personal"
                  ? "bg-indigo-500 text-white"
                  : "text-gray-600 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-900"
              }`}
            >
              Personal
            </button>

            <button
              onClick={() => setDivision("Office")}
              className={`px-3 py-1 rounded-full text-sm transition ${
                division === "Office"
                  ? "bg-indigo-500 text-white"
                  : "text-gray-600 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-900"
              }`}
            >
              Office
            </button>
          </div>

          {/* Total */}
          <div className="px-5 py-2 rounded-full bg-gray-100 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 text-sm text-gray-700 dark:text-zinc-200 shadow-sm">
            Total Spent:{" "}
            <span className="font-semibold text-black dark:text-white">
              ₹{totalExpense.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* SEARCH + SORT BAR */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Search */}
        <div className="flex items-center gap-2 border border-gray-200 dark:border-zinc-800 rounded-full px-4 py-2 bg-white dark:bg-zinc-950 shadow-sm w-full md:w-[320px]">
          <Search size={16} className="text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search category..."
            className="bg-transparent outline-none text-sm w-full text-black dark:text-white"
          />
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2">
          <ArrowUpDown size={16} className="text-gray-400" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 rounded-full border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-sm text-black dark:text-white outline-none shadow-sm"
          >
            <option value="high">Highest spent</option>
            <option value="low">Lowest spent</option>
            <option value="name">A-Z</option>
          </select>
        </div>
      </div>

      {/* EMPTY STATE */}
      {list.length === 0 && (
        <div className="bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-3xl p-16 text-center shadow-sm">
          <p className="text-gray-500 dark:text-zinc-400 text-sm">
            No expenses found. Start spending irresponsibly 💸 (jk)
          </p>
        </div>
      )}

      {/* TOP CATEGORY */}
      {topCategory && (
        <div className="relative overflow-hidden rounded-3xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-sm p-8">
          {/* Gradient Glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 via-purple-500/15 to-pink-500/20 blur-3xl opacity-80" />

          <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
            {/* Left */}
            <div>
              <p className="text-xs uppercase tracking-widest text-gray-500 dark:text-zinc-400">
                Top Spending Category
              </p>

              <h3 className="text-3xl font-bold mt-2 flex items-center gap-3">
                <Flame className="text-orange-500" size={28} />
                <span className="text-4xl">
                  {categoryIcons[topCategory.name] || "✨"}
                </span>
                {topCategory.name}
                <Sparkles className="text-indigo-500" size={20} />
              </h3>

              <p className="text-sm text-gray-500 dark:text-zinc-400 mt-2">
                This is where your money disappears into the void 🕳️
              </p>
            </div>

            {/* Right */}
            <div className="flex items-center gap-6">
              <DonutChart percent={topCategory.percent} />

              <div className="text-right">
                <p className="text-sm text-gray-500 dark:text-zinc-400">
                  Total spent
                </p>
                <p className="text-3xl font-bold text-black dark:text-white mt-1">
                  ₹{topCategory.amount.toFixed(2)}
                </p>

                <p className="text-xs mt-2 text-indigo-600 dark:text-indigo-400 font-semibold">
                  {topCategory.percent.toFixed(1)}% of total expenses
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CATEGORY GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {list.map((cat, index) => (
          <div
            key={cat.name}
            className="group relative overflow-hidden rounded-3xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-sm p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
          >
            {/* Glow */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-gradient-to-r from-indigo-500/15 to-purple-500/15 blur-2xl" />

            <div className="relative flex justify-between items-start">
              {/* Left */}
              <div>
                <p className="text-xs text-gray-500 dark:text-zinc-400">
                  Rank #{index + 1}
                </p>

                <h3 className="text-xl font-semibold mt-2 flex items-center gap-2">
                  <span className="text-3xl">
                    {categoryIcons[cat.name] || "✨"}
                  </span>
                  {cat.name}
                  {index < 3 && (
                    <span className="text-xs ml-2 px-2 py-1 rounded-full bg-indigo-50 dark:bg-zinc-900 text-indigo-600 dark:text-indigo-400 font-semibold">
                      Trending
                    </span>
                  )}
                </h3>

                <p className="text-sm text-gray-500 dark:text-zinc-400 mt-2">
                  {cat.percent.toFixed(1)}% usage
                </p>
              </div>

              {/* Right */}
              <div className="flex flex-col items-end gap-2">
                <DonutChartMini percent={cat.percent} />
                <p className="text-lg font-bold text-red-500">
                  ₹{cat.amount.toFixed(2)}
                </p>
              </div>
            </div>

            {/* Progress */}
            <div className="relative mt-5 h-2 w-full rounded-full bg-gray-200 dark:bg-zinc-800 overflow-hidden">
              <div
                className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
                style={{ width: `${cat.percent}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* BIG DONUT */
function DonutChart({ percent }) {
  const radius = 42;
  const stroke = 10;
  const normalizedRadius = radius - stroke * 0.5;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset =
    circumference - (percent / 100) * circumference;

  return (
    <div className="relative w-28 h-28 flex items-center justify-center">
      <svg height={radius * 2} width={radius * 2} className="rotate-[-90deg]">
        <circle
          stroke="currentColor"
          className="text-gray-200 dark:text-zinc-800"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />

        <circle
          stroke="currentColor"
          className="text-indigo-500"
          fill="transparent"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${circumference} ${circumference}`}
          style={{
            strokeDashoffset,
            transition: "stroke-dashoffset 0.9s ease-in-out",
          }}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
      </svg>

      <div className="absolute text-center">
        <p className="text-base font-bold text-black dark:text-white">
          {percent.toFixed(0)}%
        </p>
        <p className="text-[10px] text-gray-500 dark:text-zinc-400">
          spent
        </p>
      </div>
    </div>
  );
}

/* MINI DONUT */
function DonutChartMini({ percent }) {
  const radius = 22;
  const stroke = 6;
  const normalizedRadius = radius - stroke * 0.5;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset =
    circumference - (percent / 100) * circumference;

  return (
    <div className="relative w-14 h-14 flex items-center justify-center">
      <svg height={radius * 2} width={radius * 2} className="rotate-[-90deg]">
        <circle
          stroke="currentColor"
          className="text-gray-200 dark:text-zinc-800"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />

        <circle
          stroke="currentColor"
          className="text-indigo-500"
          fill="transparent"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${circumference} ${circumference}`}
          style={{
            strokeDashoffset,
            transition: "stroke-dashoffset 0.9s ease-in-out",
          }}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
      </svg>

      <div className="absolute text-center">
        <p className="text-[11px] font-bold text-black dark:text-white">
          {percent.toFixed(0)}%
        </p>
      </div>
    </div>
  );
}
