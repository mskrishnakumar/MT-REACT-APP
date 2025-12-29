export default function Header({ user, onSwitchUser }) {
  return (
    <header className="bg-slate-900 text-white p-6 flex justify-between items-center">
      <div>
        <h1 className="text-2xl font-bold">To-Do List</h1>
        <p className="text-slate-300">User: {user}</p>
      </div>
      <button
        onClick={onSwitchUser}
        className="bg-slate-700 px-4 py-2 rounded hover:bg-slate-600"
      >
        Switch User
      </button>
    </header>
  );
}
