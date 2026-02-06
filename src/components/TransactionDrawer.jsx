import { X } from "lucide-react";
import CategoryDropdown from "./CategoryDropdown";
import { useEffect, useState } from "react";

export default function TransactionDrawer({
  open,
  onClose,
  onSubmit,
  transaction,
  onDelete,
}) {
  const [form, setForm] = useState({
    type: "expense",
    description: "",
    amount: "",
    category: "Other",
    division: "Personal",
    accountFrom: "Manual account",
    accountTo: "",
    note: "",
  });

  const [editExpired, setEditExpired] = useState(false);

  useEffect(() => {
    if (transaction) {
      setForm({
        type: transaction.type,
        description: transaction.description,
        amount: transaction.amount,
        category: transaction.category,
        division: transaction.division || "Personal",
        accountFrom: transaction.accountFrom || "Manual account",
        accountTo: transaction.accountTo || "",
        note: transaction.note || "",
      });

      // 12 hour edit restriction UI
      const diffHours =
        (Date.now() - new Date(transaction.createdAt).getTime()) /
        (1000 * 60 * 60);

      setEditExpired(diffHours > 12);
    } else {
      setEditExpired(false);
      setForm({
        type: "expense",
        description: "",
        amount: "",
        category: "Other",
        division: "Personal",
        accountFrom: "Manual account",
        accountTo: "",
        note: "",
      });
    }
  }, [transaction]);

  const handleSubmit = () => {
    const amount = Number(form.amount);

    if (!form.description.trim()) return;
    if (!amount || amount <= 0) return;

    if (form.type === "transfer" && !form.accountTo.trim()) {
      alert("Please select account to transfer!");
      return;
    }

    onSubmit({
      type: form.type,
      description: form.description,
      amount,
      category: form.category,
      division: form.division,
      accountFrom: form.accountFrom,
      accountTo: form.type === "transfer" ? form.accountTo : null,
      note: form.note,
      date: new Date().toISOString(),
    });

    setForm({
      type: "expense",
      description: "",
      amount: "",
      category: "Other",
      division: "Personal",
      accountFrom: "Manual account",
      accountTo: "",
      note: "",
    });

    onClose();
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-transparent transition-opacity ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 z-50 h-screen w-[420px] bg-white dark:bg-zinc-950 border-l border-gray-200 dark:border-zinc-800 shadow-xl transform transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-gray-200 dark:border-zinc-800">
          <div className="font-semibold">
            {transaction ? "Edit transaction" : "New transaction"}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSubmit}
              disabled={editExpired}
              className={`px-4 py-2 rounded-xl font-medium transition ${
                editExpired
                  ? "bg-gray-300 dark:bg-zinc-700 text-gray-600 dark:text-zinc-400 cursor-not-allowed"
                  : "bg-indigo-500 text-white hover:bg-indigo-600"
              }`}
            >
              {transaction ? "✓ Update" : "✓ Create"}
            </button>

            {transaction && (
              <button
                onClick={() => onDelete(transaction._id)}
                className="px-4 py-2 rounded-xl bg-red-500 text-white font-medium hover:bg-red-600 transition"
              >
                Delete
              </button>
            )}

            <button
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-gray-100 dark:hover:bg-zinc-900 transition"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6">
          {/* Warning */}
          {editExpired && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-300 text-sm border border-red-200 dark:border-red-900">
              Editing is restricted after 12 hours.
            </div>
          )}

          {/* Date + Type */}
          <div className="flex justify-between items-center text-sm text-gray-500 dark:text-zinc-400 mb-6">
            <p>{new Date().toDateString()}</p>

            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              className="bg-white dark:bg-zinc-900 text-black dark:text-white 
              border border-gray-200 dark:border-zinc-700 rounded-xl px-3 py-1 text-sm outline-none"
            >
              <option
                className="bg-white dark:bg-zinc-900 text-black dark:text-white"
                value="expense"
              >
                Expense
              </option>
              <option
                className="bg-white dark:bg-zinc-900 text-black dark:text-white"
                value="income"
              >
                Income
              </option>
              <option
                className="bg-white dark:bg-zinc-900 text-black dark:text-white"
                value="transfer"
              >
                Transfer
              </option>
            </select>
          </div>

          {/* Name + Amount */}
          <div className="flex justify-between items-start border-b border-gray-200 dark:border-zinc-800 pb-6">
            <div className="flex-1">
              <p className="text-xs text-gray-500 dark:text-zinc-400 mb-2">
                Description
              </p>

              <input
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                placeholder="Eg: Lunch, Salary, Rent"
                className="text-xl font-semibold w-full bg-transparent outline-none placeholder-gray-400 dark:placeholder-zinc-600"
              />

              <div className="flex items-center gap-2 mt-3 text-gray-500 dark:text-zinc-400 text-sm">
                <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                {form.accountFrom}
              </div>
            </div>

            <div className="text-right">
              <p className="text-xs text-gray-500 dark:text-zinc-400 mb-2">
                Amount
              </p>
              <input
                type="number"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                placeholder="0"
                className="text-3xl font-semibold w-28 text-right bg-transparent outline-none no-spinner"
              />
            </div>
          </div>

          {/* Division */}
          <div className="py-5 border-b border-gray-200 dark:border-zinc-800 flex justify-between items-center">
            <p className="text-gray-600 dark:text-zinc-400 font-medium">
              Division
            </p>

            <select
              value={form.division}
              onChange={(e) => setForm({ ...form, division: e.target.value })}
              className="bg-white dark:bg-zinc-900 text-black dark:text-white 
              border border-gray-200 dark:border-zinc-700 rounded-xl px-3 py-2 text-sm outline-none"
            >
              <option
                className="bg-white dark:bg-zinc-900 text-black dark:text-white"
                value="Personal"
              >
                Personal
              </option>
              <option
                className="bg-white dark:bg-zinc-900 text-black dark:text-white"
                value="Office"
              >
                Office
              </option>
            </select>
          </div>

          {/* Accounts */}
          <div className="py-5 border-b border-gray-200 dark:border-zinc-800 space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-gray-600 dark:text-zinc-400 font-medium">
                Account From
              </p>

              <select
                value={form.accountFrom}
                onChange={(e) =>
                  setForm({ ...form, accountFrom: e.target.value })
                }
                className="bg-white dark:bg-zinc-900 text-black dark:text-white 
                border border-gray-200 dark:border-zinc-700 rounded-xl px-3 py-2 text-sm outline-none"
              >
                <option
                  className="bg-white dark:bg-zinc-900 text-black dark:text-white"
                  value="Manual account"
                >
                  Manual account
                </option>
                <option
                  className="bg-white dark:bg-zinc-900 text-black dark:text-white"
                  value="Cash"
                >
                  Cash
                </option>
                <option
                  className="bg-white dark:bg-zinc-900 text-black dark:text-white"
                  value="Bank"
                >
                  Bank
                </option>
                <option
                  className="bg-white dark:bg-zinc-900 text-black dark:text-white"
                  value="UPI"
                >
                  UPI
                </option>
              </select>
            </div>

            {form.type === "transfer" && (
              <div className="flex justify-between items-center">
                <p className="text-gray-600 dark:text-zinc-400 font-medium">
                  Account To
                </p>

                <select
                  value={form.accountTo}
                  onChange={(e) =>
                    setForm({ ...form, accountTo: e.target.value })
                  }
                  className="bg-white dark:bg-zinc-900 text-black dark:text-white 
                  border border-gray-200 dark:border-zinc-700 rounded-xl px-3 py-2 text-sm outline-none"
                >
                  <option
                    className="bg-white dark:bg-zinc-900 text-black dark:text-white"
                    value=""
                  >
                    Select
                  </option>
                  <option
                    className="bg-white dark:bg-zinc-900 text-black dark:text-white"
                    value="Cash"
                  >
                    Cash
                  </option>
                  <option
                    className="bg-white dark:bg-zinc-900 text-black dark:text-white"
                    value="Bank"
                  >
                    Bank
                  </option>
                  <option
                    className="bg-white dark:bg-zinc-900 text-black dark:text-white"
                    value="UPI"
                  >
                    UPI
                  </option>
                </select>
              </div>
            )}
          </div>

          {/* Category */}
          <div className="py-5 border-b border-gray-200 dark:border-zinc-800 flex justify-between items-center">
            <p className="text-gray-600 dark:text-zinc-400 font-medium">
              Category
            </p>

            <CategoryDropdown
              value={form.category}
              onChange={(cat) => setForm({ ...form, category: cat })}
            />
          </div>

          {/* Note */}
          <div className="py-6">
            <textarea
              value={form.note}
              onChange={(e) => setForm({ ...form, note: e.target.value })}
              placeholder="Add a note..."
              className="w-full bg-transparent outline-none resize-none text-gray-700 dark:text-zinc-200 placeholder-gray-400 dark:placeholder-zinc-600"
              rows={5}
            />
          </div>
        </div>
      </div>
    </>
  );
}
