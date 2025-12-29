import { useEffect, useState } from "react";
import Header from "./components/Header.jsx";
import TodoInput from "./components/TodoInput.jsx";
import TodoList from "./components/TodoList.jsx";

export default function App() {
  const [user, setUser] = useState("");
  const [todos, setTodos] = useState([]);

  // Ask for username on first load
  useEffect(() => {
    const savedUser = localStorage.getItem("currentUser");
    if (savedUser) {
      setUser(savedUser);
    } else {
      const name = prompt("Enter your name:");
      if (name) {
        localStorage.setItem("currentUser", name);
        setUser(name);
      }
    }
  }, []);

  // Load todos for user
  useEffect(() => {
    if (!user) return;
    const savedTodos = localStorage.getItem(`todos_${user}`);
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos));
    } else {
      setTodos([]);
    }
  }, [user]);

  // Save todos for user
  useEffect(() => {
    if (!user) return;
    localStorage.setItem(`todos_${user}`, JSON.stringify(todos));
  }, [todos, user]);

  const addTodo = (text) => {
    setTodos([
      { id: Date.now(), text, completed: false },
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

  const switchUser = () => {
    localStorage.removeItem("currentUser");
    window.location.reload();
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <Header user={user} onSwitchUser={switchUser} />
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
