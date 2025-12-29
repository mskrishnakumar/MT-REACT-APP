import { useEffect, useState } from "react";
import Header from "./components/Header.jsx";
import TodoInput from "./components/TodoInput.jsx";
import TodoList from "./components/TodoList.jsx";

export default function App() {
  const [todos, setTodos] = useState([]);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("todos");
    if (saved) setTodos(JSON.parse(saved));
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

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

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <Header />
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



// import { useState } from "react";
// import "./App.css";

// export default function App() {
//   return (
//     <div className="min-h-screen bg-black text-white flex items-center justify-center text-3xl font-bold">
//       Tailwind v3 is WORKING ✅
//     </div>
//   );
// }

