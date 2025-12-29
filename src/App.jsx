import { useState } from "react";
import "./App.css";

export default function App() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center text-3xl font-bold">
      Tailwind v3 is WORKING ✅
    </div>
  );
}



// function App() {
//   const [tasks, setTasks] = useState([
//     { id: 1, title: "Learn React basics", done: false },
//     { id: 2, title: "Build sample UI", done: true },
//     { id: 3, title: "Deploy to Azure", done: false },
//   ]);

//   const toggleTask = (id) => {
//     setTasks(
//       tasks.map((task) =>
//         task.id === id ? { ...task, done: !task.done } : task
//       )
//     );
//   };

//   return (
//     <div className="app">
//       <aside className="sidebar">
//         <h2>React Dashboard</h2>
//         <nav>
//           <a>Home</a>
//           <a>Tasks</a>
//           <a>Settings</a>
//         </nav>
//       </aside>

//       <main className="content">
//         <header className="header">
//           <h1>Welcome 👋</h1>
//           <p>Your local React test UI</p>
//         </header>

//         <section className="cards">
//           <div className="card">
//             <h3>Total Tasks</h3>
//             <span>{tasks.length}</span>
//           </div>
//           <div className="card">
//             <h3>Completed</h3>
//             <span>{tasks.filter(t => t.done).length}</span>
//           </div>
//           <div className="card">
//             <h3>Pending</h3>
//             <span>{tasks.filter(t => !t.done).length}</span>
//           </div>
//         </section>

//         <section className="task-list">
//           <h2>Task List</h2>
//           {tasks.map((task) => (
//             <div
//               key={task.id}
//               className={`task ${task.done ? "done" : ""}`}
//               onClick={() => toggleTask(task.id)}
//             >
//               {task.title}
//             </div>
//           ))}
//         </section>
//       </main>
//     </div>
//   );
// }

// export default App