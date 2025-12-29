export default function Header({ authUser }) {
  return (
    <header className="bg-slate-900 text-white p-6 flex justify-between items-center">
      <div>
        <h1 className="text-2xl font-bold">To-Do List</h1>
        <p className="text-slate-300 text-sm">
          {authUser.userDetails} ({authUser.identityProvider})
        </p>
      </div>

      <a
        href="/.auth/logout"
        className="underline text-slate-300"
      >
        Logout
      </a>
    </header>
  );
}
