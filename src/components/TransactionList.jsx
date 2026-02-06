import { useState } from "react";
import { updateTransaction } from "../services/api";
import EditModal from "./EditModal";

export default function TransactionList({ transactions, reload }) {
  const [editing, setEditing] = useState(null);

  const saveEdit = async (amount) => {
    await updateTransaction(editing._id, { amount });
    setEditing(null);
    reload();
  };

  const openEdit = (t) => {
    const hours =
      (Date.now() - new Date(t.createdAt)) / (1000 * 60 * 60);

    if (hours > 12) {
      alert("Edit window expired");
      return;
    }

    setEditing(t);
  };

  return (
    <>
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-zinc-800">
            <tr>
              <th className="p-4 text-left">Type</th>
              <th>Amount</th>
              <th>Category</th>
              <th>Description</th>
              <th>Date</th>
              <th>Edit</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t) => (
              <tr key={t._id} className="border-t dark:border-zinc-800">
                <td className="p-4 capitalize">{t.type}</td>
                <td>₹ {t.amount}</td>
                <td>{t.category}</td>
                <td>{t.description || "-"}</td>
                <td className="text-gray-500">
                  {new Date(t.date).toLocaleDateString()}
                </td>
                <td>
                  <button
                    onClick={() => openEdit(t)}
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && (
        <EditModal
          transaction={editing}
          onClose={() => setEditing(null)}
          onSave={saveEdit}
        />
      )}
    </>
  );
}
