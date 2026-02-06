import { useState } from "react";

export default function Filters({ transactions, setFiltered }) {
  const [type, setType] = useState("all");
  const [category, setCategory] = useState("");

  const applyFilters = () => {
    let data = [...transactions];

    if (type !== "all") {
      data = data.filter(t => t.type === type);
    }

    if (category) {
      data = data.filter(t =>
        t.category.toLowerCase().includes(category.toLowerCase())
      );
    }

    setFiltered(data);
  };

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-gray-200 dark:border-zinc-800 mb-10 flex flex-col md:flex-row gap-4">
      <select
        className="input"
        value={type}
        onChange={e => setType(e.target.value)}
      >
        <option value="all">All</option>
        <option value="income">Income</option>
        <option value="expense">Expense</option>
      </select>

      <input
        className="input"
        placeholder="Category"
        value={category}
        onChange={e => setCategory(e.target.value)}
      />

      <button
        onClick={applyFilters}
        className="px-6 py-2 rounded-full bg-black dark:bg-white text-white dark:text-black transition"
      >
        Apply
      </button>
    </div>
  );
}
