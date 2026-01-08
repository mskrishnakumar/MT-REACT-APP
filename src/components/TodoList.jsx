import TodoItem from "./TodoItem";

export default function TodoList({ todos, onToggle, onDelete, disabled }) {
  if (todos.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-slate-600 mb-1">No tasks yet</h3>
        <p className="text-slate-400">Add a task above to get started</p>
      </div>
    );
  }

  const completedCount = todos.filter(t => t.completed).length;
  const totalCount = todos.length;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-medium text-slate-500 uppercase tracking-wide">
          Your Tasks
        </h2>
        <span className="text-sm text-slate-400">
          {completedCount} of {totalCount} completed
        </span>
      </div>

      <div className="space-y-3">
        {todos.map(todo => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={onToggle}
            onDelete={onDelete}
            disabled={disabled}
          />
        ))}
      </div>
    </div>
  );
}
