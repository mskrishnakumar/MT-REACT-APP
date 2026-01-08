import { useState } from "react";

export default function TodoInput({ onAdd, disabled }) {
  const [text, setText] = useState("");

  const submit = (e) => {
    e?.preventDefault();
    if (!text.trim() || disabled) return;
    onAdd(text.trim());
    setText("");
  };

  return (
    <form onSubmit={submit} className="mb-8">
      <div className="flex gap-3">
        <div className="relative flex-1">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="What needs to be done?"
            disabled={disabled}
            className="w-full bg-white border-2 border-slate-200 rounded-xl px-4 py-3.5 text-slate-800 placeholder-slate-400 transition-all duration-200 outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-100 disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>
        <button
          type="submit"
          disabled={!text.trim() || disabled}
          className="bg-gradient-to-r from-teal-500 to-emerald-600 text-white px-6 rounded-xl font-semibold hover:from-teal-600 hover:to-emerald-700 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-md flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span className="hidden sm:inline">Add Task</span>
        </button>
      </div>
    </form>
  );
}
