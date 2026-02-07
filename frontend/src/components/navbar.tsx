export function Navbar() {
  return (
    <div className="navbar bg-base-100 shadow-sm px-4">
      <div className="flex-1">
        <a href="/">
          <h1 className="font-semibold text-xl">Arch Leaderboard</h1>
        </a>
      </div>
      <div className="flex-none flex gap-4">
        <a className="link" href="/login">Login</a>
        <a className="link" href="/sign-up">Sign up</a>
      </div>
    </div>
  );
}
