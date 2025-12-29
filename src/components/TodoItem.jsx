export default function TodoItem({ todo, onToggle, onDelete }) {
  return (
    <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow">
      <div
        onClick={() => onToggle(todo.id)}
        className={`cursor-pointer flex-1 ${
          todo.completed ? "line-through text-slate-400" : ""
        }`}
      >
        {todo.text}
      </div>

      <button
        onClick={() => onDelete(todo.id)}
        className="ml-4 text-red-500 hover:text-red-700"
      >
        ✕
      </button>
    </div>
  );
}
