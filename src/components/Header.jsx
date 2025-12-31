export default function Header({ email }) {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-xl mx-auto p-4 flex justify-between items-center">
        <h1 className="text-xl font-semibold">
          To-Do App
        </h1>

        <span className="text-sm text-slate-600">
          Using as: <strong>{email}</strong>
        </span>
      </div>
    </header>
  );
}

