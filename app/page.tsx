import Header from './components/Header';
import LinkForm from './components/LinkForm';
import LinksTable from './components/LinksTable';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-100">
      <Header />
      <main className="max-w-4xl mx-auto p-4">
        <h1 className="text-2xl font-semibold mb-4">Take-Home Assignment:</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-1">
            <LinkForm />
          </div>
          <div className="md:col-span-2">
            <LinksTable />
          </div>
        </div>
      </main>
    </div>
  );
}
