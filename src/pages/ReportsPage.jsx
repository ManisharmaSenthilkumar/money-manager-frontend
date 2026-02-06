import { useMemo, useState, useEffect } from "react";
import { BarChart3, Calendar } from "lucide-react";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

export default function ReportsPage({ transactions = [] }) {
  const [mode, setMode] = useState("Monthly");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const filteredTx = useMemo(() => {
    const now = new Date();

    return transactions.filter((t) => {
      const d = new Date(t.date);

      if (fromDate && d < new Date(fromDate)) return false;
      if (toDate && d > new Date(toDate)) return false;

      if (mode === "Weekly") {
        const diffDays = (now - d) / (1000 * 60 * 60 * 24);
        return diffDays <= 7;
      }

      if (mode === "Monthly") {
        return (
          d.getMonth() === now.getMonth() &&
          d.getFullYear() === now.getFullYear()
        );
      }

      if (mode === "Yearly") {
        return d.getFullYear() === now.getFullYear();
      }

      return true;
    });
  }, [transactions, mode, fromDate, toDate]);

  const summary = useMemo(() => {
    const income = filteredTx
      .filter((t) => t.type === "income")
      .reduce((a, b) => a + b.amount, 0);

    const expense = filteredTx
      .filter((t) => t.type === "expense")
      .reduce((a, b) => a + b.amount, 0);

    return { income, expense, balance: income - expense };
  }, [filteredTx]);

  // Smooth animated numbers
  const [animatedIncome, setAnimatedIncome] = useState(0);
  const [animatedExpense, setAnimatedExpense] = useState(0);
  const [animatedBalance, setAnimatedBalance] = useState(0);

  useEffect(() => {
    animateValue(summary.income, setAnimatedIncome);
    animateValue(summary.expense, setAnimatedExpense);
    animateValue(summary.balance, setAnimatedBalance);
  }, [summary]);

  function animateValue(target, setter) {
    let start = 0;
    const duration = 900;
    const stepTime = 16;
    const steps = duration / stepTime;
    const increment = target / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setter(target);
        clearInterval(timer);
      } else {
        setter(start);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }

  const formatMoney = (num) => {
    return new Intl.NumberFormat("en-IN").format(num);
  };

  // Modern Category Donut Data
  const categorySummary = useMemo(() => {
    const map = {};

    filteredTx.forEach((t) => {
      if (t.type === "expense") {
        const key = (t.category || "Other").trim();
        map[key] = (map[key] || 0) + t.amount;
      }
    });

    return Object.entries(map)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6); // top 6 for premium look
  }, [filteredTx]);

  // Modern Trend Data
  const trendChart = useMemo(() => {
    const map = {};

    filteredTx.forEach((t) => {
      const d = new Date(t.date).toLocaleDateString("en-IN");

      if (!map[d]) map[d] = { date: d, income: 0, expense: 0 };

      if (t.type === "income") map[d].income += t.amount;
      if (t.type === "expense") map[d].expense += t.amount;
    });

    return Object.values(map).sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );
  }, [filteredTx]);

  const donutColors = ["#6366F1", "#22C55E", "#F43F5E", "#F59E0B", "#06B6D4", "#A855F7"];

  // Balance progress ring %
  const balancePercent = useMemo(() => {
    if (summary.income === 0) return 0;
    let percent = (summary.balance / summary.income) * 100;
    if (percent < 0) percent = 0;
    if (percent > 100) percent = 100;
    return percent;
  }, [summary]);

  return (
    <div className="relative min-h-screen">
      {/* Ultra Modern Animated Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-140px] left-[-120px] w-[600px] h-[600px] bg-indigo-500/25 rounded-full blur-[200px] animate-liquid1"></div>
        <div className="absolute bottom-[-200px] right-[-160px] w-[650px] h-[650px] bg-pink-500/20 rounded-full blur-[230px] animate-liquid2"></div>
        <div className="absolute top-[40%] left-[40%] w-[450px] h-[450px] bg-green-500/15 rounded-full blur-[200px] animate-liquid3"></div>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-10 animate-fadeUp">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight flex items-center gap-2">
            <BarChart3 className="text-indigo-500" size={26} />
            Reports
          </h2>
          <p className="text-sm text-gray-500 dark:text-zinc-400 mt-2">
            Premium analytics for your money 💎
          </p>
        </div>

        <select
          value={mode}
          onChange={(e) => setMode(e.target.value)}
          className="px-5 py-3 rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-xl text-sm font-semibold outline-none shadow-md hover:shadow-xl transition"
        >
          <option value="Weekly">Weekly</option>
          <option value="Monthly">Monthly</option>
          <option value="Yearly">Yearly</option>
        </select>
      </div>

      {/* Date Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-10 animate-fadeUp delay-100">
        <DateBox value={fromDate} setValue={setFromDate} />
        <DateBox value={toDate} setValue={setToDate} />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-7 mb-10 animate-fadeUp delay-200">
        <StatCard title="Income" value={`₹${formatMoney(animatedIncome)}`} accent="green" />
        <StatCard title="Expense" value={`₹${formatMoney(animatedExpense)}`} accent="red" />
        <StatCard title="Balance" value={`₹${formatMoney(animatedBalance)}`} accent="indigo" />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 animate-fadeUp delay-300">

        {/* Trend Graph */}
        <GlassCard title="Cashflow Trend (Smooth)">
          {trendChart.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendChart}>
                  <defs>
                    <linearGradient id="incomeFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#22C55E" stopOpacity={0.8} />
                      <stop offset="100%" stopColor="#22C55E" stopOpacity={0.02} />
                    </linearGradient>

                    <linearGradient id="expenseFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#F43F5E" stopOpacity={0.8} />
                      <stop offset="100%" stopColor="#F43F5E" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>

                  <CartesianGrid strokeDasharray="3 3" opacity={0.08} />
                  <XAxis dataKey="date" tick={{ fill: "#9CA3AF", fontSize: 11 }} />
                  <YAxis tick={{ fill: "#9CA3AF", fontSize: 11 }} />
                  <Tooltip content={<PremiumTooltip />} />

                  <Area
                    type="monotone"
                    dataKey="income"
                    stroke="#22C55E"
                    strokeWidth={3}
                    fill="url(#incomeFill)"
                    animationDuration={1200}
                  />

                  <Area
                    type="monotone"
                    dataKey="expense"
                    stroke="#F43F5E"
                    strokeWidth={3}
                    fill="url(#expenseFill)"
                    animationDuration={1200}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </GlassCard>

        {/* Modern Donut */}
        {/* Modern Donut */}
<GlassCard title="Top Spending Categories">
  {categorySummary.length === 0 ? (
    <EmptyState />
  ) : (
    <div className="flex flex-col items-center justify-center">

      {/* Donut Chart */}
      <div className="relative h-[320px] w-full flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <defs>
              <filter id="glow">
                <feDropShadow
                  dx="0"
                  dy="0"
                  stdDeviation="12"
                  floodColor="#6366F1"
                  floodOpacity="0.35"
                />
              </filter>
            </defs>

            <Pie
              data={categorySummary}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={105}
              outerRadius={150}
              paddingAngle={7}
              stroke="transparent"
              filter="url(#glow)"
              animationDuration={1400}
            >
              {categorySummary.map((_, index) => (
                <Cell
                  key={index}
                  fill={donutColors[index % donutColors.length]}
                />
              ))}
            </Pie>

            <Tooltip content={<PremiumTooltip />} />
          </PieChart>
        </ResponsiveContainer>

        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <p className="text-xs tracking-wide uppercase text-gray-400 dark:text-zinc-500">
            Total Expense
          </p>

          <p className="text-3xl font-extrabold text-red-500 drop-shadow-lg mt-1">
            ₹{formatMoney(summary.expense)}
          </p>

          <p className="text-xs text-gray-500 dark:text-zinc-400 mt-2">
            Top {categorySummary.length} categories
          </p>
        </div>
      </div>

      {/* Premium Legend (Aligned Grid) */}
      <div className="w-full mt-6 grid grid-cols-2 gap-3 px-4">
        {categorySummary.map((c, i) => (
          <div
            key={c.name}
            className="flex items-center justify-between px-4 py-2 rounded-2xl bg-white/60 dark:bg-zinc-950/50 border border-gray-200 dark:border-zinc-800 backdrop-blur-xl shadow-sm hover:shadow-md transition"
          >
            <div className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full"
                style={{
                  backgroundColor: donutColors[i % donutColors.length],
                }}
              ></span>

              <p className="text-sm font-semibold text-gray-700 dark:text-zinc-200 truncate max-w-[90px]">
                {c.name}
              </p>
            </div>

            <p className="text-xs font-bold text-gray-600 dark:text-zinc-300">
              ₹{formatMoney(c.value)}
            </p>
          </div>
        ))}
      </div>
    </div>
  )}
</GlassCard>


        {/* Balance Ring */}
        <GlassCard title="Balance Health (Ring)">
          <div className="flex flex-col items-center justify-center py-6">
            <div className="relative w-[220px] h-[220px]">
              <svg className="w-full h-full rotate-[-90deg]">
                <circle
                  cx="110"
                  cy="110"
                  r="95"
                  stroke="rgba(148,163,184,0.2)"
                  strokeWidth="18"
                  fill="transparent"
                />
                <circle
                  cx="110"
                  cy="110"
                  r="95"
                  stroke="url(#gradRing)"
                  strokeWidth="18"
                  fill="transparent"
                  strokeDasharray={2 * Math.PI * 95}
                  strokeDashoffset={
                    2 * Math.PI * 95 -
                    (balancePercent / 100) * (2 * Math.PI * 95)
                  }
                  strokeLinecap="round"
                  style={{ transition: "stroke-dashoffset 1s ease-in-out" }}
                />
                <defs>
                  <linearGradient id="gradRing" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#6366F1" />
                    <stop offset="50%" stopColor="#22C55E" />
                    <stop offset="100%" stopColor="#F59E0B" />
                  </linearGradient>
                </defs>
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-sm text-gray-500 dark:text-zinc-400">
                  Balance %
                </p>
                <p className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">
                  {balancePercent.toFixed(0)}%
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  of income remaining
                </p>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Mini Premium Breakdown */}
        <GlassCard title="Quick Breakdown">
          <div className="space-y-4">
            <BreakRow label="Income" value={summary.income} color="green" />
            <BreakRow label="Expense" value={summary.expense} color="red" />
            <BreakRow label="Balance" value={summary.balance} color="indigo" />
          </div>
        </GlassCard>
      </div>

      {/* Animations */}
      <style>
        {`
          @keyframes liquid1 {
            0%,100% { transform: translate(0px,0px) scale(1); }
            50% { transform: translate(90px,60px) scale(1.25); }
          }
          @keyframes liquid2 {
            0%,100% { transform: translate(0px,0px) scale(1); }
            50% { transform: translate(-100px,-80px) scale(1.3); }
          }
          @keyframes liquid3 {
            0%,100% { transform: translate(0px,0px) scale(1); }
            50% { transform: translate(60px,-70px) scale(1.2); }
          }

          @keyframes fadeUp {
            from { opacity: 0; transform: translateY(25px); }
            to { opacity: 1; transform: translateY(0); }
          }

          .animate-liquid1 { animation: liquid1 12s ease-in-out infinite; }
          .animate-liquid2 { animation: liquid2 14s ease-in-out infinite; }
          .animate-liquid3 { animation: liquid3 10s ease-in-out infinite; }

          .animate-fadeUp { animation: fadeUp 0.9s ease-out both; }
          .delay-100 { animation-delay: 0.1s; }
          .delay-200 { animation-delay: 0.2s; }
          .delay-300 { animation-delay: 0.3s; }
        `}
      </style>
    </div>
  );
}

/* ---------------- COMPONENTS ---------------- */

function DateBox({ value, setValue }) {
  return (
    <div className="flex items-center gap-2 px-4 py-3 rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-950/60 backdrop-blur-xl shadow-sm">
      <Calendar size={16} className="text-gray-400" />
      <input
        type="date"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="bg-transparent outline-none text-black dark:text-white text-sm"
      />
    </div>
  );
}

function GlassCard({ title, children }) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-gray-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-950/60 backdrop-blur-xl p-6 shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
      <div className="absolute top-[-80px] right-[-80px] w-64 h-64 bg-indigo-500/15 rounded-full blur-3xl"></div>

      <h3 className="font-bold text-gray-900 dark:text-white mb-5 text-lg tracking-tight">
        {title}
      </h3>

      {children}
    </div>
  );
}

function StatCard({ title, value, accent }) {
  const accentMap = {
    green: "from-green-500/25 to-green-500/5 border-green-500/20",
    red: "from-red-500/25 to-red-500/5 border-red-500/20",
    indigo: "from-indigo-500/25 to-indigo-500/5 border-indigo-500/20",
  };

  return (
    <div
      className={`relative overflow-hidden rounded-3xl border bg-gradient-to-br ${accentMap[accent]} p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}
    >
      <div className="absolute top-[-50px] right-[-50px] w-44 h-44 bg-white/30 blur-3xl rounded-full"></div>

      <p className="text-sm font-semibold text-gray-600 dark:text-zinc-400">
        {title}
      </p>

      <p className="text-3xl font-extrabold mt-4 tracking-tight text-gray-900 dark:text-white">
        {value}
      </p>

      <p className="text-xs text-gray-500 dark:text-zinc-500 mt-2">
        Auto calculated
      </p>
    </div>
  );
}

function BreakRow({ label, value, color }) {
  const colorMap = {
    green: "bg-green-500",
    red: "bg-red-500",
    indigo: "bg-indigo-500",
  };

  return (
    <div className="flex justify-between items-center px-4 py-3 rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-950/40 backdrop-blur-xl shadow-sm">
      <div className="flex items-center gap-3">
        <span className={`w-2.5 h-2.5 rounded-full ${colorMap[color]}`}></span>
        <p className="font-semibold text-sm">{label}</p>
      </div>
      <p className="font-extrabold text-sm">₹{new Intl.NumberFormat("en-IN").format(value)}</p>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="py-14 text-center">
      <p className="text-lg font-bold text-gray-700 dark:text-white">
        No report data yet 🚀
      </p>
      <p className="text-sm text-gray-500 dark:text-zinc-400 mt-2">
        Add transactions to unlock premium insights.
      </p>
    </div>
  );
}

function PremiumTooltip({ active, payload }) {
  if (active && payload && payload.length) {
    return (
      <div className="px-4 py-3 rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-xl shadow-xl">
        <p className="text-sm font-bold text-gray-900 dark:text-white">
          {payload[0].name}
        </p>
        <p className="text-sm text-gray-600 dark:text-zinc-300 mt-1">
          ₹{new Intl.NumberFormat("en-IN").format(payload[0].value)}
        </p>
      </div>
    );
  }
  return null;
}
