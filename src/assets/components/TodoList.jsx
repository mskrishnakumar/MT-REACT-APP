import TodoItem from "./TodoItem";
export default function TodoList({ todos, onToggle, onDelete }) {
  if (todos.length === 0) {
    return (
      <p className="text-center text-slate-500">
        No tasks yet. Add one 👆
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
