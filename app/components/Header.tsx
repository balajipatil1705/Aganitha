import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-slate-800 text-white p-4">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <Link href="/" className="font-semibold text-xl">Aganitha</Link>
        <nav className="space-x-4">
          <Link href="/">Dashboard</Link>
        </nav>
      </div>
    </header>
  );
}
