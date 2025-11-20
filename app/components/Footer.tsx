export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="fixed bottom-0 left-0 w-full bg-white border-t shadow-md z-50">
      <div className="max-w-4xl mx-auto p-4 text-sm text-slate-600 flex flex-col md:flex-row items-center justify-between h-16">
        <div>© {year} Aganitha </div>
        <div className="mt-1 md:mt-0">Powered by Drizzle • <a className="text-blue-600" href="https://neon.tech" target="_blank" rel="noopener noreferrer">Neon</a></div>
      </div>
    </footer>
  );
}
