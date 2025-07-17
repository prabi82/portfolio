import Dashboard from '@/components/Dashboard';
import AddHoldingForm from '@/components/AddHoldingForm';

export default function Home() {
  return (
    <main>
      <Dashboard />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <AddHoldingForm />
      </div>
    </main>
  );
}
