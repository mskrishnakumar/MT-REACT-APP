import { useEffect, useState } from "react";
import Header from "./components/Header.jsx";
import TodoInput from "./components/TodoInput.jsx";
import TodoList from "./components/TodoList.jsx";

export default function App() {
  // Azure-authenticated user
  const [authUser, setAuthUser] = useState(null);

  // Todos (will come from API next)
  const [todos, setTodos] = useState([]);

  // Fetch Azure auth user on app load
  useEffect(() => {
    fetch("/.auth/me")
      .then(res => res.json())
      .then(data => {
        setAuthUser(data.clientPrincipal || null);
      })
      .catch(() => setAuthUser(null));
  }, []);

 /*  // TEMP: localStorage fallback (remove when API is live)
  useEffect(() => {
    if (!authUser) return;
    const saved = localStorage.getItem(`todos_${authUser.userId}`);
    setTodos(saved ? JSON.parse(saved) : []);
  }, [authUser]);

  // TEMP: localStorage persistence (remove when API is live)
  useEffect(() => {
    if (!authUser) return;
    localStorage.setItem(
      `todos_${authUser.userId}`,
      JSON.stringify(todos)
    );
  }, [todos, authUser]); */

  // ---- Todo actions ----
  const addTodo = (text) => {
    setTodos([
      { id: Date.now().toString(), text, completed: false },
      ...todos,
    ]);
  };

  const toggleTodo = (id) => {
    setTodos(
      todos.map(t =>
        t.id === id ? { ...t, completed: !t.completed } : t
      )
    );
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(t => t.id !== id));
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
        <TodoList
          todos={todos}
          onToggle={toggleTodo}
          onDelete={deleteTodo}
        />
      </main>
    </div>
  );
}