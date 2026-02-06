import { useState } from "react";

export default function Welcome({ onNext }) {
  const [name, setName] = useState("");

  const handleNext = () => {
    if (!name.trim()) return;
    localStorage.setItem("userName", name);
    onNext(name);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 flex items-center justify-center px-6">
      <div className="w-full max-w-5xl bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-gray-200 dark:border-zinc-800 overflow-hidden grid grid-cols-1 md:grid-cols-2">

        {/* Left side (Image Section) */}
        <div className="bg-emerald-400 flex items-center justify-center p-10">
          <div className="text-center">
            <div className="text-6xl mb-4">☕</div>
            <h1 className="text-4xl font-bold text-white tracking-tight">
              Money Manager
            </h1>
            <p className="text-white/90 mt-2 text-lg">
              Track income & expenses like a pro.
            </p>
          </div>
        </div>

        {/* Right side (Form Section) */}
        <div className="p-10 flex flex-col justify-center">
          <h2 className="text-3xl font-semibold mb-3">
            Let’s get started.
          </h2>

          <p className="text-gray-600 dark:text-zinc-400 mb-6">
            Enter your name to personalize your dashboard.
          </p>

          <label className="text-sm font-medium mb-2 text-gray-700 dark:text-zinc-300">
            Name
          </label>

          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your first name"
            className="input mb-6"
          />

          <button
            onClick={handleNext}
            className={`px-6 py-2 rounded-full w-fit transition 
              ${name.trim()
                ? "bg-black dark:bg-white text-white dark:text-black"
                : "bg-gray-300 dark:bg-zinc-700 text-gray-600 dark:text-zinc-400 cursor-not-allowed"
              }`}
            disabled={!name.trim()}
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}
