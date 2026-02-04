import { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';
import { WashingMachineCard } from './lib/WashingMachineCard';
import { Loader2 } from 'lucide-react';

function App() {
  const [machines, setMachines] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMachines();
    const channel = supabase
      .channel('washing_machines_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'washing_machines',
        },
        fetchMachines
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchMachines = async () => {
    const { data, error } = await supabase
      .from('washing_machines')
      .select('*')
      .order('id');

    if (!error && data) setMachines(data);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-white animate-spin" />
      </div>
    );
  }

  // return (
  //   <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
  //     <div className="max-w-7xl mx-auto">
  //       <header className="text-center mb-12">
  //         <h1 className="text-5xl font-bold text-white mb-3 tracking-tight">
  //           Laundry Monitor
  //         </h1>
  //         <p className="text-slate-400 text-lg">
  //           Real-time washing machine availability
  //         </p>
  //       </header>

  //       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
  //         {machines.map((machine) => (
  //           <WashingMachineCard key={machine.id} machine={machine} />
  //         ))}
  //       </div>

  //       <footer className="mt-12 text-center text-slate-500 text-sm">
  //         <p>Updates automatically in real-time</p>
  //       </footer>
  //     </div>
  //   </div>
  // );
  return (
    <div className="min-h-screen p-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {machines.map((m) => (
          <WashingMachineCard key={m.id} machine={m} />
        ))}
      </div>
    </div>
  );
}

export default App;
