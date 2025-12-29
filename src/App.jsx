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

  // Fetch Azure auth user on app load
  useEffect(() => {
    fetch("/.auth/me")
      .then(res => res.json())
      .then(data => {
        setAuthUser(data.clientPrincipal || null);
      })
      .catch(() => setAuthUser(null));
  }, []);

  // Fetch todos from Azure after login
  useEffect(() => {
    if (!authUser) return;

    setLoading(true);

    fetch("/api/todos")
      .then(res => res.json())
      .then(data => {
        setTodos(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load todos", err);
        setLoading(false);
      });
  }, [authUser]);

  // ---- Todo actions ----
  const addTodo = async (text) => {
    const todo = {
      id: crypto.randomUUID(),
      text,
      completed: false,
    };

    try {
      await fetch("/api/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(todo),
      });

      // optimistic update
      setTodos(prev => [todo, ...prev]);
    } catch (err) {
      console.error("Add todo failed", err);
    }
  };

  const toggleTodo = async (id) => {
    const todo = todos.find(t => t.id === id);
    if (!todo) return;

    const updated = { ...todo, completed: !todo.completed };

    try {
      await fetch("/api/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });

      setTodos(prev =>
        prev.map(t => (t.id === id ? updated : t))
      );
    } catch (err) {
      console.error("Toggle todo failed", err);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await fetch("/api/todos", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      setTodos(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      console.error("Delete todo failed", err);
    }
  };

  // ---- NOT LOGGED IN ----
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

  // ---- LOGGED IN ----
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
