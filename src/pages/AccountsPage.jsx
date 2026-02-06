import { useEffect, useMemo, useState } from "react";
import {
  Wallet,
  ArrowDownLeft,
  ArrowUpRight,
  Repeat2,
  Landmark,
} from "lucide-react";

import { getAccounts, getTransactions } from "../services/api";

export default function AccountsPage() {
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [activeAccount, setActiveAccount] = useState(null);

  // Animated Total Money
  const [animatedTotal, setAnimatedTotal] = useState(0);

  // Animated balances per account
  const [animatedBalances, setAnimatedBalances] = useState({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const accRes = await getAccounts();
    const txRes = await getTransactions();

    const accData = accRes.data || [];
    const txData = txRes.data || [];

    setAccounts(accData);
    setTransactions(txData);

    if (accData.length > 0) {
      setActiveAccount(accData[0]);
    }
  };

  // Total Balance
  const totalBalance = useMemo(() => {
    return accounts.reduce((sum, acc) => sum + acc.balance, 0);
  }, [accounts]);

  // Animate Total Money
  useEffect(() => {
    animateValue(totalBalance, setAnimatedTotal);
  }, [totalBalance]);

  // Animate each account balance
  useEffect(() => {
    const newBalances = {};

    accounts.forEach((acc) => {
      animateValue(acc.balance, (val) => {
        newBalances[acc._id] = val;
        setAnimatedBalances((prev) => ({
          ...prev,
          [acc._id]: val,
        }));
      });
    });
  }, [accounts]);

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
    return new Intl.NumberFormat("en-IN").format(num || 0);
  };

  // Filter account wise transactions
  const accountTx = useMemo(() => {
    if (!activeAccount) return [];

    return transactions
      .filter((t) => {
        if (t.type === "transfer") {
          return (
            t.accountFrom === activeAccount.name ||
            t.accountTo === activeAccount.name
          );
        }
        return t.accountFrom === activeAccount.name;
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [transactions, activeAccount]);

  const getTxIcon = (type) => {
    if (type === "income")
      return <ArrowDownLeft size={18} className="text-green-500" />;

    if (type === "expense")
      return <ArrowUpRight size={18} className="text-red-500" />;

    if (type === "transfer")
      return <Repeat2 size={18} className="text-indigo-500" />;

    return <Wallet size={18} className="text-gray-500" />;
  };

  return (
    <div className="relative min-h-screen">
      {/* Animated Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-140px] left-[-140px] w-[650px] h-[650px] bg-indigo-500/25 rounded-full blur-[230px] animate-liquid1"></div>
        <div className="absolute bottom-[-200px] right-[-160px] w-[700px] h-[700px] bg-green-500/15 rounded-full blur-[250px] animate-liquid2"></div>
        <div className="absolute top-[40%] left-[35%] w-[500px] h-[500px] bg-pink-500/15 rounded-full blur-[220px] animate-liquid3"></div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-10 animate-fadeUp">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight flex items-center gap-2">
            <Landmark size={26} className="text-indigo-500" />
            Accounts
          </h2>
          <p className="text-sm text-gray-500 dark:text-zinc-400 mt-2">
            Your personal finance vault 💳
          </p>
        </div>
      </div>

      {/* Total Money Card */}
      <div className="mb-10 animate-fadeUp delay-100">
        <div
          className="relative overflow-hidden rounded-3xl border border-gray-200 dark:border-zinc-800 
          bg-gradient-to-br from-indigo-50 via-white to-indigo-100
          dark:from-indigo-500/15 dark:via-zinc-950 dark:to-indigo-500/5
          backdrop-blur-xl p-7 shadow-lg hover:shadow-2xl transition-all duration-300"
        >
          <div className="absolute top-[-70px] right-[-70px] w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl"></div>

          <p className="text-sm font-semibold text-gray-500 dark:text-zinc-400">
            Total Money You Have
          </p>

          <p className="text-4xl font-extrabold mt-4 tracking-tight text-gray-900 dark:text-white">
            ₹{formatMoney(animatedTotal)}
          </p>

          <p className="text-xs text-gray-500 dark:text-zinc-500 mt-2">
            All accounts combined
          </p>
        </div>
      </div>

      {/* Accounts Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-10 animate-fadeUp delay-200">
        {accounts.length === 0 ? (
          <div className="col-span-full text-center py-16">
            <p className="text-xl font-bold text-gray-800 dark:text-white">
              No accounts yet 💳
            </p>
            <p className="text-sm text-gray-500 dark:text-zinc-400 mt-2">
              Accounts will appear here once data is loaded.
            </p>
          </div>
        ) : (
          accounts.map((acc) => (
            <button
              key={acc._id}
              onClick={() => setActiveAccount(acc)}
              className={`relative text-left overflow-hidden rounded-3xl border backdrop-blur-xl p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl
              ${
                activeAccount?.name === acc.name
                  ? "border-indigo-500 bg-gradient-to-br from-indigo-100 via-white to-indigo-200 dark:from-indigo-500/25 dark:via-zinc-950 dark:to-indigo-500/10"
                  : "border-gray-200 dark:border-zinc-800 bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-zinc-950 dark:via-zinc-950 dark:to-zinc-900"
              }`}
            >
              <div className="absolute top-[-50px] right-[-50px] w-48 h-48 bg-white/30 rounded-full blur-3xl"></div>

              <div className="flex justify-between items-center">
                <p className="text-sm font-bold text-gray-800 dark:text-white">
                  {acc.name}
                </p>

                <div className="w-11 h-11 flex items-center justify-center rounded-2xl bg-white/60 dark:bg-zinc-900/60 shadow-sm">
                  <Wallet size={18} className="text-indigo-500" />
                </div>
              </div>

              <p className="text-2xl font-extrabold mt-5 text-gray-900 dark:text-white">
                ₹{formatMoney(animatedBalances[acc._id] || 0)}
              </p>

              <p className="text-xs text-gray-500 dark:text-zinc-400 mt-2">
                Current balance
              </p>
            </button>
          ))
        )}
      </div>

      {/* Account Transaction History */}
      <div className="animate-fadeUp delay-300">
        <div
          className="relative overflow-hidden rounded-3xl border border-gray-200 dark:border-zinc-800
          bg-gradient-to-br from-gray-50 via-white to-gray-100
          dark:from-zinc-950 dark:via-zinc-950 dark:to-zinc-900
          backdrop-blur-xl shadow-lg"
        >
          <div className="absolute top-[-90px] right-[-90px] w-72 h-72 bg-green-500/10 rounded-full blur-3xl"></div>

          <div className="px-6 py-5 border-b border-gray-200 dark:border-zinc-800 flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                {activeAccount ? `${activeAccount.name} History` : "History"}
              </h3>
              <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1">
                Latest transactions for this account
              </p>
            </div>
          </div>

          {accountTx.length === 0 ? (
            <div className="p-14 text-center">
              <p className="text-xl font-bold text-gray-800 dark:text-white">
                No transactions yet 🚀
              </p>
              <p className="text-sm text-gray-500 dark:text-zinc-400 mt-2">
                Once you add transactions, they’ll show here.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-zinc-800">
              {accountTx.slice(0, 12).map((t) => (
                <div
                  key={t._id}
                  className="flex justify-between items-center px-6 py-4 hover:bg-gray-50/70 dark:hover:bg-zinc-900/50 transition"
                >
                  {/* LEFT */}
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-11 h-11 flex items-center justify-center rounded-2xl shadow-sm border 
                      ${
                        t.type === "income"
                          ? "bg-green-500/10 border-green-500/20"
                          : t.type === "expense"
                          ? "bg-red-500/10 border-red-500/20"
                          : "bg-indigo-500/10 border-indigo-500/20"
                      }`}
                    >
                      {getTxIcon(t.type)}
                    </div>

                    <div>
                      <p className="font-semibold text-sm text-gray-900 dark:text-white">
                        {t.type === "transfer"
                          ? `${t.accountFrom} → ${t.accountTo}`
                          : t.description || t.category}
                      </p>

                      <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1">
                        {t.category} • {t.division} •{" "}
                        {new Date(t.date).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* RIGHT */}
                  <div className="text-right">
                    <p
                      className={`font-extrabold text-sm ${
                        t.type === "income"
                          ? "text-green-500"
                          : t.type === "expense"
                          ? "text-red-500"
                          : "text-indigo-500"
                      }`}
                    >
                      {t.type === "expense" ? "-" : "+"}₹{formatMoney(t.amount)}
                    </p>

                    <p className="text-xs text-gray-400 mt-1">
                      {t.type === "transfer" ? "Transfer" : t.accountFrom}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
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
            50% { transform: translate(-110px,-80px) scale(1.35); }
          }
          @keyframes liquid3 {
            0%,100% { transform: translate(0px,0px) scale(1); }
            50% { transform: translate(70px,-90px) scale(1.2); }
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
