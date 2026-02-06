import { useMemo, useState, useEffect } from "react";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  Flame,
  ArrowRightLeft,
  Plus,
} from "lucide-react";

import TransactionDrawer from "../components/TransactionDrawer";
import {
  addTransaction,
  updateTransaction,
  deleteTransaction,
} from "../services/api";

export default function Dashboard({ transactions = [], reload }) {
  const [mode, setMode] = useState("Monthly");

  // Drawer state
  const [openDrawer, setOpenDrawer] = useState(false);
  const [selectedTx, setSelectedTx] = useState(null);

  const filteredTx = useMemo(() => {
    const now = new Date();

    return transactions.filter((t) => {
      const d = new Date(t.date);

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
  }, [transactions, mode]);

  const summary = useMemo(() => {
    const income = filteredTx
      .filter((t) => t.type === "income")
      .reduce((a, b) => a + b.amount, 0);

    const expense = filteredTx
      .filter((t) => t.type === "expense")
      .reduce((a, b) => a + b.amount, 0);

    const transfer = filteredTx
      .filter((t) => t.type === "transfer")
      .reduce((a, b) => a + b.amount, 0);

    return {
      income,
      expense,
      transfer,
      balance: income - expense,
    };
  }, [filteredTx]);

  const history = useMemo(() => {
    return [...filteredTx]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 8);
  }, [filteredTx]);

  const topCategory = useMemo(() => {
    const map = {};

    filteredTx.forEach((t) => {
      if (t.type === "expense") {
        map[t.category] = (map[t.category] || 0) + t.amount;
      }
    });

    const sorted = Object.entries(map).sort((a, b) => b[1] - a[1]);
    if (!sorted.length) return { name: "Other", amount: 0 };

    return { name: sorted[0][0], amount: sorted[0][1] };
  }, [filteredTx]);

  // ✅ Animated values
  const [animatedIncome, setAnimatedIncome] = useState(0);
  const [animatedExpense, setAnimatedExpense] = useState(0);
  const [animatedBalance, setAnimatedBalance] = useState(0);
  const [animatedTopAmount, setAnimatedTopAmount] = useState(0);

  useEffect(() => {
    animateValue(summary.income, setAnimatedIncome);
    animateValue(summary.expense, setAnimatedExpense);
    animateValue(summary.balance, setAnimatedBalance);
    animateValue(topCategory.amount, setAnimatedTopAmount);
  }, [summary, topCategory]);

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

  return (
    <div className="relative min-h-screen overflow-hidden rounded-3xl">
      {/* Premium Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-pink-500/10 to-green-500/10 animate-gradientMove"></div>

        <div className="absolute top-[-180px] left-[-160px] w-[520px] h-[520px] bg-indigo-500/30 rounded-full blur-[160px] animate-blob1"></div>
        <div className="absolute bottom-[-220px] right-[-200px] w-[600px] h-[600px] bg-pink-500/25 rounded-full blur-[180px] animate-blob2"></div>
        <div className="absolute top-[30%] left-[45%] w-[420px] h-[420px] bg-green-500/20 rounded-full blur-[170px] animate-blob3"></div>

        <div className="absolute inset-0 opacity-[0.12] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
      </div>

      {/* Header */}
      <div className="flex justify-between items-center mb-10 animate-fadeUp">
        <div>
          <h2 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            Dashboard
          </h2>
          <p className="text-sm text-gray-600 dark:text-zinc-400 mt-2">
            Track your money like a CEO 🚀
          </p>
        </div>

        <select
          value={mode}
          onChange={(e) => setMode(e.target.value)}
          className="px-5 py-2.5 rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-950/60 backdrop-blur-xl text-sm font-semibold outline-none shadow-md hover:shadow-lg transition"
        >
          <option value="Weekly">Weekly</option>
          <option value="Monthly">Monthly</option>
          <option value="Yearly">Yearly</option>
        </select>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 animate-fadeUp delay-100">
        <PremiumCard
          title="Income"
          value={`₹${formatMoney(animatedIncome)}`}
          sub="Money received"
          icon={<TrendingUp size={20} />}
          accent="green"
        />

        <PremiumCard
          title="Expense"
          value={`₹${formatMoney(animatedExpense)}`}
          sub="Money spent"
          icon={<TrendingDown size={20} />}
          accent="red"
        />

        <PremiumCard
          title="Balance"
          value={`₹${formatMoney(animatedBalance)}`}
          sub="Available cash"
          icon={<Wallet size={20} />}
          accent="indigo"
        />

      <PremiumCard
  title="Top Category"
  value={`₹${formatMoney(animatedTopAmount)}`}
  sub={topCategory.name}
  icon={<Flame size={20} />}
  accent="orange"
/>



      </div>

      {/* History */}
      <div className="mt-12 bg-white/70 dark:bg-zinc-950/55 backdrop-blur-2xl border border-gray-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-xl animate-fadeUp delay-200">
        <div className="flex justify-between items-center px-6 py-5 border-b border-gray-200 dark:border-zinc-800">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Recent Activity
            </h3>
            <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1">
              Latest {history.length} transactions ({mode})
            </p>
          </div>

          <div className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 dark:bg-zinc-900 text-gray-600 dark:text-zinc-300">
            {mode} View
          </div>
        </div>

        {history.length === 0 ? (
          <div className="p-16 text-center">
            <p className="text-2xl font-extrabold text-gray-800 dark:text-white">
              No transactions yet 💸
            </p>
            <p className="text-sm text-gray-500 dark:text-zinc-400 mt-2">
              Add your first transaction and start tracking like a pro.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-zinc-800">
            {history.map((t) => (
              <div
                key={t._id}
                className="flex justify-between items-center px-6 py-4 hover:bg-white/50 dark:hover:bg-zinc-900/60 transition cursor-pointer"
                onClick={() => {
                  setSelectedTx(t);
                  setOpenDrawer(true);
                }}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-11 h-11 flex items-center justify-center rounded-2xl shadow-md ${
                      t.type === "income"
                        ? "bg-green-100 text-green-600 dark:bg-green-500/10"
                        : t.type === "expense"
                        ? "bg-red-100 text-red-500 dark:bg-red-500/10"
                        : "bg-indigo-100 text-indigo-600 dark:bg-indigo-500/10"
                    }`}
                  >
                    {t.type === "transfer" ? (
                      <ArrowRightLeft size={18} />
                    ) : t.type === "income" ? (
                      <TrendingUp size={18} />
                    ) : (
                      <TrendingDown size={18} />
                    )}
                  </div>

                  <div>
                    <p className="font-semibold text-sm text-gray-800 dark:text-white">
                      {t.type === "transfer"
                        ? `${t.accountFrom} → ${t.accountTo}`
                        : t.description}
                    </p>

                    <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1">
                      {t.category} • {t.division} •{" "}
                      {new Date(t.date).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p
                    className={`font-extrabold text-sm ${
                      t.type === "income"
                        ? "text-green-600"
                        : t.type === "expense"
                        ? "text-red-500"
                        : "text-indigo-600"
                    }`}
                  >
                    {t.type === "expense" ? "-" : "+"}₹{formatMoney(t.amount)}
                  </p>

                  <p className="text-xs text-gray-400 mt-1">{t.accountFrom}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Floating + Button */}
      <button
        onClick={() => {
          setSelectedTx(null);
          setOpenDrawer(true);
        }}
        className="fixed bottom-8 right-8 w-16 h-16 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center shadow-2xl transition transform hover:scale-110 active:scale-95 animate-floatBtn"
      >
        <Plus size={28} />
        <span className="absolute inset-0 rounded-full bg-white/20 blur-xl animate-pingSlow"></span>
      </button>

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

      {/* Animations */}
      <style>
        {`
          @keyframes blob1 {
            0%, 100% { transform: translate(0px, 0px) scale(1); }
            50% { transform: translate(80px, 60px) scale(1.2); }
          }

          @keyframes blob2 {
            0%, 100% { transform: translate(0px, 0px) scale(1); }
            50% { transform: translate(-90px, -70px) scale(1.25); }
          }

          @keyframes blob3 {
            0%, 100% { transform: translate(0px, 0px) scale(1); }
            50% { transform: translate(60px, -80px) scale(1.18); }
          }

          @keyframes gradientMove {
            0% { filter: hue-rotate(0deg); }
            50% { filter: hue-rotate(40deg); }
            100% { filter: hue-rotate(0deg); }
          }

          @keyframes fadeUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }

          @keyframes floatBtn {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-8px); }
          }

          @keyframes pingSlow {
            0% { transform: scale(1); opacity: 0.4; }
            100% { transform: scale(1.6); opacity: 0; }
          }

          .animate-blob1 { animation: blob1 12s ease-in-out infinite; }
          .animate-blob2 { animation: blob2 14s ease-in-out infinite; }
          .animate-blob3 { animation: blob3 11s ease-in-out infinite; }

          .animate-gradientMove { animation: gradientMove 10s ease-in-out infinite; }

          .animate-fadeUp { animation: fadeUp 0.9s ease-out both; }
          .delay-100 { animation-delay: 0.1s; }
          .delay-200 { animation-delay: 0.2s; }

          .animate-floatBtn { animation: floatBtn 2.8s ease-in-out infinite; }
          .animate-pingSlow { animation: pingSlow 2.5s ease-in-out infinite; }
        `}
      </style>
    </div>
  );
}

function PremiumCard({ title, value, sub, icon, accent }) {
  const accentStyles = {
    green:
      "from-green-500/25 to-green-500/5 border-green-500/20 hover:border-green-500/50",
    red: "from-red-500/25 to-red-500/5 border-red-500/20 hover:border-red-500/50",
    indigo:
      "from-indigo-500/25 to-indigo-500/5 border-indigo-500/20 hover:border-indigo-500/50",
    orange:
      "from-orange-500/25 to-orange-500/5 border-orange-500/20 hover:border-orange-500/50",
  };

  return (
    <div
      className={`relative overflow-hidden rounded-3xl border bg-gradient-to-br ${
        accentStyles[accent]
      } p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2`}
    >
      <div className="absolute top-[-60px] right-[-60px] w-44 h-44 rounded-full bg-white/30 blur-3xl"></div>

      <div className="flex justify-between items-center">
        <p className="text-sm font-semibold text-gray-700 dark:text-zinc-200">
          {title}
        </p>

        <div className="w-11 h-11 flex items-center justify-center rounded-2xl bg-white/40 dark:bg-zinc-900/60 shadow-md">
          {icon}
        </div>
      </div>

      <p className="text-2xl font-extrabold mt-5 tracking-tight text-gray-900 dark:text-white">
        {value}
      </p>

      <p className="text-xs text-gray-600 dark:text-zinc-400 mt-2">{sub}</p>
    </div>
  );
}
