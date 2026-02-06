import { useState } from "react";
import { addTransaction } from "../services/api";

export default function TransactionForm({ onAdd, transactions }) {
  const [form, setForm] = useState({
    type: "income",
    amount: "",
    category: "",
    description: ""
  });

  const income = transactions
    .filter(t => t.type === "income")
    .reduce((a, b) => a + b.amount, 0);

  const expense = transactions
    .filter(t => t.type === "expense")
    .reduce((a, b) => a + b.amount, 0);

  const balance = income - expense;

  const submit = async () => {
    const amount = Number(form.amount);

    // ❌ invalid or negative
    if (!amount || amount <= 0) {
      alert("Amount must be greater than zero");
      return;
    }

    // ❌ expense exceeds balance
    if (form.type === "expense" && amount > balance) {
      alert("Insufficient balance");
      return;
    }

    // ❌ missing category
    if (!form.category.trim()) {
      alert("Category is required");
      return;
    }

    await addTransaction({
      ...form,
      amount
    });

    onAdd();
    setForm({ type: "income", amount: "", category: "", description: "" });
  };

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-gray-200 dark:border-zinc-800 mb-10">
      <h2 className="text-lg font-medium mb-4">Add Transaction</h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <select
          className="input"
          value={form.type}
          onChange={e => setForm({ ...form, type: e.target.value })}
        >
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>

        <input
          type="number"
          min="0"
          className="input no-spinner"
          placeholder="Amount"
          value={form.amount}
          onChange={e => setForm({ ...form, amount: e.target.value })}
        />

        <input
          className="input"
          placeholder="Category"
          value={form.category}
          onChange={e => setForm({ ...form, category: e.target.value })}
        />

        <input
          className="input"
          placeholder="Description"
          value={form.description}
          onChange={e => setForm({ ...form, description: e.target.value })}
        />
      </div>

      <p className="text-sm text-gray-500 dark:text-zinc-400 mt-3">
        Available balance: ₹ {balance}
      </p>

      <button
        onClick={submit}
        className="mt-5 px-6 py-2 rounded-full bg-black dark:bg-white text-white dark:text-black transition"
      >
        Save
      </button>
    </div>
  );
}
