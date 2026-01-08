import { useCallback, useEffect, useState } from "react";
import Header from "./components/Header.jsx";
import TodoInput from "./components/TodoInput.jsx";
import TodoList from "./components/TodoList.jsx";
import UsernameModal from "./components/UsernameModal.jsx";
import Toast from "./components/Toast.jsx";

const API_BASE = "/api/todos";

export default function App() {
  // Email-based user identity
  const [email, setEmail] = useState(null);
  const [showEmailModal, setShowEmailModal] = useState(false);

  // Todos from Azure Table Storage
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Toast notifications
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = "error") => {
    setToast({ message, type });
  }, []);

  const hideToast = useCallback(() => {
    setToast(null);
  }, []);

  // Check for saved email on mount
  useEffect(() => {
    const savedEmail = localStorage.getItem("userEmail");
    if (savedEmail) {
      setEmail(savedEmail);
    } else {
      setShowEmailModal(true);
      setLoading(false);
    }
  }, []);

  // Handle email submission from modal
  const handleEmailSubmit = (submittedEmail) => {
    localStorage.setItem("userEmail", submittedEmail);
    setEmail(submittedEmail);
    setShowEmailModal(false);
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("userEmail");
    setEmail(null);
    setTodos([]);
    setShowEmailModal(true);
  };

  // Fetch todos when email is set
  useEffect(() => {
    if (!email) return;

    setLoading(true);

    fetch(`${API_BASE}?email=${encodeURIComponent(email)}`)
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
        showToast("Failed to load your tasks. Please try again.");
        setLoading(false);
      });
  }, [email, showToast]);

  // Add todo
  const addTodo = async (text) => {
    const todo = {
      id: Date.now().toString(),
      text,
      completed: false,
      email
    };

    setActionLoading(true);

    try {
      const res = await fetch(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(todo)
      });

      if (!res.ok) {
        throw new Error("Failed to add todo");
      }

      setTodos(prev => [todo, ...prev]);
      showToast("Task added successfully!", "success");
    } catch (err) {
      console.error("Add todo failed", err);
      showToast("Failed to add task. Please try again.");
    } finally {
      setActionLoading(false);
    }
  };

  // Toggle todo completion
  const toggleTodo = async (id) => {
    const todo = todos.find(t => t.id === id);
    if (!todo) return;

    const updated = {
      ...todo,
      completed: !todo.completed,
      email
    };

    // Optimistic update
    setTodos(prev => prev.map(t => (t.id === id ? updated : t)));

    try {
      const res = await fetch(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated)
      });

      if (!res.ok) {
        throw new Error("Failed to update todo");
      }
    } catch (err) {
      console.error("Toggle todo failed", err);
      // Revert on error
      setTodos(prev => prev.map(t => (t.id === id ? todo : t)));
      showToast("Failed to update task. Please try again.");
    }
  };

  // Delete todo
  const deleteTodo = async (id) => {
    const todoToDelete = todos.find(t => t.id === id);
    if (!todoToDelete) return;

    // Optimistic update
    setTodos(prev => prev.filter(t => t.id !== id));

    try {
      const res = await fetch(API_BASE, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, email })
      });

      if (!res.ok) {
        throw new Error("Failed to delete todo");
      }
    } catch (err) {
      console.error("Delete todo failed", err);
      // Revert on error
      setTodos(prev => [todoToDelete, ...prev]);
      showToast("Failed to delete task. Please try again.");
    }
  };

  // Show email modal
  if (showEmailModal) {
    return (
      <>
        <UsernameModal onSubmit={handleEmailSubmit} />
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={hideToast}
          />
        )}
      </>
    );
  }

  // Main app
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Header email={email} onLogout={handleLogout} />

      <main className="max-w-2xl mx-auto px-4 py-8">
        <TodoInput onAdd={addTodo} disabled={actionLoading} />

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-10 h-10 border-4 border-teal-200 border-t-teal-500 rounded-full animate-spin mb-4"></div>
            <p className="text-slate-500">Loading your tasks...</p>
          </div>
        ) : (
          <TodoList
            todos={todos}
            onToggle={toggleTodo}
            onDelete={deleteTodo}
            disabled={actionLoading}
          />
        )}
      </main>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={hideToast}
        />
      )}
    </div>
  );
}
