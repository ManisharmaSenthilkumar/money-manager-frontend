import { useMemo, useState } from "react";
import { Search, Plus, Ban } from "lucide-react";
import NewCategoryModal from "./NewCategoryModal";


export default function CategoryDropdown({ value, onChange }) {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [exclude, setExclude] = useState(false);
    const [openModal, setOpenModal] = useState(false);


    const categories = [
        { name: "Other", icon: "🫧" },
        { name: "Work Expenses", icon: "💼" },
        { name: "Food", icon: "🍔" },
        { name: "Fuel", icon: "⛽" },
        { name: "Medical", icon: "🏥" },
        { name: "Shopping", icon: "🛍️" },
    ];

    const filtered = useMemo(() => {
        return categories.filter((c) =>
            c.name.toLowerCase().includes(query.toLowerCase())
        );
    }, [query]);

    return (
        <div className="relative">
            {/* Selected pill */}
            <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 dark:bg-zinc-800 text-indigo-600 dark:text-indigo-300 font-semibold text-xs hover:opacity-80 transition"
            >
                🫧 {value.toUpperCase()}
            </button>

            {/* Dropdown */}
            {open && (
                <div className="absolute right-0 z-50 mt-3 w-72 rounded-2xl bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 shadow-xl overflow-hidden">


                    {/* Search */}
                    <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-200 dark:border-zinc-800">
                        <Search size={16} className="text-gray-400" />
                        <input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search"
                            className="w-full bg-transparent outline-none text-sm text-gray-700 dark:text-zinc-200"
                        />
                    </div>

                    {/* Category list */}
                    <div className="max-h-56 overflow-y-auto scrollbar-hide">

                        {filtered.map((cat) => (
                            <button
                                key={cat.name}
                                onClick={() => {
                                    onChange(cat.name);
                                    setOpen(false);
                                }}
                                className="w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-gray-50 dark:hover:bg-zinc-900 transition"
                            >
                                <span className="text-lg">{cat.icon}</span>
                                <span className="font-medium">{cat.name}</span>
                            </button>
                        ))}

                        {/* New Category */}
                        <button
                            onClick={() => {
                                setOpenModal(true);
                            }}

                            className="w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-gray-50 dark:hover:bg-zinc-900 transition"
                        >
                            <Plus size={18} className="text-gray-400" />
                            <span className="font-medium">New category</span>
                        </button>
                    </div>

                    <NewCategoryModal
                        open={openModal}
                        onClose={() => setOpenModal(false)}
                        onSave={(newCat) => {
                            onChange(newCat);
                            setOpen(false);
                        }}
                    />

                    {/* Exclude */}
                    <div className="border-t border-gray-200 dark:border-zinc-800 p-3">
                        <button
                            onClick={() => setExclude(!exclude)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition ${exclude
                                ? "bg-gray-200 dark:bg-zinc-800"
                                : "hover:bg-gray-50 dark:hover:bg-zinc-900"
                                }`}
                        >
                            <Ban size={18} className="text-gray-400" />
                            <span className="font-medium">Exclude</span>
                        </button>
                    </div>
                </div>

            )}
        </div>
    );
}
