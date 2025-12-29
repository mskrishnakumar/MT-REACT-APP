import { useState } from "react";

export default function UsernameModal({ onSubmit }) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    const trimmed = name.trim();
    if (!trimmed) {
      setError("Name cannot be empty");
      return;
    }

    const users = JSON.parse(localStorage.getItem("users") || "[]");
    if (!users.includes(trimmed)) {
      localStorage.setItem("users", JSON.stringify([...users, trimmed]));
    }

    onSubmit(trimmed);
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-xl">
        <h2 className="text-xl font-bold mb-2">Welcome 👋</h2>
        <p className="text-slate-600 mb-4">Enter your name</p>

        <input
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setError("");
          }}
          placeholder="Your name"
          className="w-full border rounded-lg px-4 py-2 mb-2 focus:ring-2 focus:ring-slate-800"
        />

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        <button
          onClick={handleSubmit}
          className="w-full bg-slate-900 text-white py-2 rounded-lg hover:bg-slate-800"
        >
          Continue
        </button>
      </div>
    </div>
  );
}

