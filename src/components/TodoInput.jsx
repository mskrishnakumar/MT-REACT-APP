import { useState } from "react";

export default function TodoInput({ onAdd }) {
  const [text, setText] = useState("");

  const submit = () => {
    if (!text.trim()) return;
    onAdd(text);
    setText("");
  };

  return (
    <div className="flex gap-2 mb-6">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Add a new task..."
        className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-800"
      />
      <button
        onClick={submit}
        className="bg-slate-900 text-white px-5 rounded-lg hover:bg-slate-800"
      >
        Add
      </button>
    </div>
  );
}
