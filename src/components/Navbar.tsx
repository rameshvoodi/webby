import { ModeToggle } from "./modeToggle";

export function Navbar() {
  return (
    <nav className="flex items-center justify-between w-full max-w-4xl px-4 py-8 mx-auto">
      <div>
        <a className="text-xl font-bold">Home</a>
      </div>
      <div>
        <ModeToggle />
      </div>
    </nav>
  );
}
