import { useState } from "react";

export default function EditModal({ transaction, onClose, onSave }) {
  const [amount, setAmount] = useState(transaction.amount);

  const save = () => {
    if (!amount) return;
    onSave(Number(amount));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-gray-200 dark:border-zinc-800 w-full max-w-sm p-6 animate-fadeIn">
        <h2 className="text-lg font-semibold mb-4">
          Edit Transaction
        </h2>

      <input
  type="number"
  min="0"
  value={amount}
  onChange={(e) => setAmount(e.target.value)}
  className="input no-spinner w-full mb-6"
/>


        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-full border border-gray-300 dark:border-zinc-700 hover:bg-gray-100 dark:hover:bg-zinc-800 transition"
          >
            Cancel
          </button>

          <button
            onClick={save}
            className="px-4 py-2 rounded-full bg-black dark:bg-white text-white dark:text-black transition"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
