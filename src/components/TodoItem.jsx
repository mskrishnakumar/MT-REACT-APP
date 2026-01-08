export default function TodoItem({ todo, onToggle, onDelete, disabled }) {
  return (
    <div className={`group flex items-center gap-4 bg-white p-4 rounded-xl border-2 transition-all duration-200 ${
      todo.completed
        ? "border-slate-100 bg-slate-50"
        : "border-slate-200 hover:border-teal-200 hover:shadow-md"
    }`}>
      <button
        onClick={() => onToggle(todo.id)}
        disabled={disabled}
        className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
          todo.completed
            ? "bg-green-500 border-green-500 text-white"
            : "border-slate-300 hover:border-teal-500 hover:bg-teal-50"
        } disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {todo.completed && (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        )}
      </button>

      <span
        onClick={() => !disabled && onToggle(todo.id)}
        className={`flex-1 cursor-pointer select-none transition-all duration-200 ${
          todo.completed
            ? "line-through text-slate-400"
            : "text-slate-700"
        } ${disabled ? "cursor-not-allowed" : ""}`}
      >
        {todo.text}
      </span>

      <button
        onClick={() => onDelete(todo.id)}
        disabled={disabled}
        className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        title="Delete task"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
  );
}
