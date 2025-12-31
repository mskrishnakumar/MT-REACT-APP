import { useEffect, useState } from "react";
import Header from "./components/Header.jsx";
import TodoInput from "./components/TodoInput.jsx";
import TodoList from "./components/TodoList.jsx";

export default function App() {
  // -----------------------------
  // Email-based "user identity"
  // -----------------------------
  const [email, setEmail] = useState(null);

  // Todos from Azure Table Storage
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);

  // ----------------------------------
  // Ask for email ONCE on app load
  // ----------------------------------
  useEffect(() => {
    let savedEmail = localStorage.getItem("userEmail");

    if (!savedEmail) {
      savedEmail = prompt("Enter your email to use the To-Do app:");
      if (savedEmail) {
        localStorage.setItem("userEmail", savedEmail);
      }
    }

    setEmail(savedEmail);
  }, []);

  // ----------------------------------
  // Fetch todos AFTER email is known
  // ----------------------------------
  useEffect(() => {
    if (!email) return;

    setLoading(true);

    fetch(`/api/todos?email=${encodeURIComponent(email)}`)
      .then(res => {
        if (!res.ok) {
          throw new Error("Failed to load todos");
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
  }, [email]);

  // -----------------------------
  // Todo actions
  // -----------------------------
  const addTodo = async (text) => {
    const todo = {
      id: Date.now().toString(),
      text,
      completed: false,
      email
    };

    const res = await fetch("/api/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(todo)
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

    const updated = {
      ...todo,
      completed: !todo.completed,
      email
    };

    const res = await fetch("/api/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated)
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
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, email })
    });

    if (!res.ok) {
      console.error("Delete todo failed");
      return;
    }

    setTodos(prev => prev.filter(t => t.id !== id));
  };

  // -----------------------------
  // Email not provided
  // -----------------------------
  if (!email) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <p className="text-slate-600">
          Please refresh and enter your email.
        </p>
      </div>
    );
  }

  // -----------------------------
  // Main app
  // -----------------------------
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <Header email={email} />

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
