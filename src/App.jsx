import { useEffect, useState } from "react";
import Header from "./components/Header.jsx";
import TodoInput from "./components/TodoInput.jsx";
import TodoList from "./components/TodoList.jsx";

export default function App() {
  // Azure-authenticated user
  const [authUser, setAuthUser] = useState(null);

  // Todos from Azure Table Storage
  const [todos, setTodos] = useState([]);

  const [loading, setLoading] = useState(true);

  // -----------------------------
  // Fetch Azure auth user on load
  // -----------------------------
  useEffect(() => {
    fetch("/.auth/me", { credentials: "include" })
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        setAuthUser(data?.clientPrincipal || null);
      })
      .catch(() => setAuthUser(null));
  }, []);

  // ----------------------------------
  // Fetch todos AFTER user is logged in
  // ----------------------------------
  useEffect(() => {
    if (!authUser) return;

    setLoading(true);

    fetch("/api/todos", {
      credentials: "include"
    })
      .then(async res => {
        if (res.status === 401) {
          // Auth not ready yet – safe fallback
          return [];
        }
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || "Failed to load todos");
        }
        return res.json();
      })
      .then(data => {
        setTodos(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load todos", err);
        setLoading(false);
      });
  }, [authUser]);

  // -----------------------------
  // Todo actions
  // -----------------------------
  const addTodo = async (text) => {
    const todo = {
      id: Date.now().toString(), // browser-safe ID
      text,
      completed: false,
    };

    const res = await fetch("/api/todos", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(todo),
    });

    if (!res.ok) {
      console.error("Add todo failed");
      return;
    }

    setTodos(prev => [todo, ...prev]);
  };

  const toggleTodo = async (id) => {
    const todo = todos.find(t => t.id === id);
    if (!todo) return;

    const updated = { ...todo, completed: !todo.completed };

    const res = await fetch("/api/todos", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    });

    if (!res.ok) {
      console.error("Toggle todo failed");
      return;
    }

    setTodos(prev =>
      prev.map(t => (t.id === id ? updated : t))
    );
  };

  const deleteTodo = async (id) => {
    const res = await fetch("/api/todos", {
      method: "DELETE",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    if (!res.ok) {
      console.error("Delete todo failed");
      return;
    }

    setTodos(prev => prev.filter(t => t.id !== id));
  };

  // -----------------------------
  // NOT LOGGED IN
  // -----------------------------
  if (!authUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <a
          href="/.auth/login/github"
          className="bg-slate-900 text-white px-6 py-3 rounded-lg text-lg hover:bg-slate-800"
        >
          Login with GitHub
        </a>
      </div>
    );
  }

  // -----------------------------
  // LOGGED IN
  // -----------------------------
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <Header authUser={authUser} />

      <main className="max-w-xl mx-auto p-6">
        <TodoInput onAdd={addTodo} />

        {loading ? (
          <p className="text-center text-slate-500 mt-6">
            Loading todos…
          </p>
        ) : (
          <TodoList
            todos={todos}
            onToggle={toggleTodo}
            onDelete={deleteTodo}
          />
        )}
      </main>
    </div>
  );
}
