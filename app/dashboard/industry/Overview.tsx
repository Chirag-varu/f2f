'use client';

// --- TYPES ---
interface Transaction {
  amount: number;
}

interface SupportTicket {
  status: 'Open' | 'Resolved';
}

interface OverviewProps {
  history: Transaction[];
  tickets: SupportTicket[];
}

export default function OverviewTab({ history, tickets }: OverviewProps) {
  
  // Calculate Summary Data
  const totalSpend = history.reduce((acc, curr) => acc + curr.amount, 0);
  const openTickets = tickets.filter(t => t.status === 'Open').length;
  const resolvedTickets = tickets.filter(t => t.status === 'Resolved').length;

  return (
    <div className="space-y-8 animate-in fade-in duration-700 slide-in-from-bottom-4">
      
      {/* --- KPI STAT CARDS --- */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col justify-between h-48">
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Total Procurement</p>
            <h3 className="text-4xl font-black text-slate-900">₹{totalSpend.toLocaleString()}</h3>
          </div>
          <div className="flex items-center gap-2 text-emerald-500 text-xs font-bold">
            <span>↑ 12%</span>
            <span className="text-slate-300 font-medium">vs last month</span>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col justify-between h-48">
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Support Load</p>
            <h3 className="text-4xl font-black text-amber-500">{openTickets}</h3>
          </div>
          <p className="text-xs text-slate-400 font-medium">Active issues requiring attention</p>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col justify-between h-48">
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">ESG Score</p>
            <h3 className="text-4xl font-black text-emerald-600">A+</h3>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div className="bg-emerald-500 h-full w-[92%]"></div>
          </div>
        </div>
      </section>

      {/* --- QUICK ACTIONS & STATUS --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Support Breakdown */}
        <div className="bg-[#0F172A] p-8 rounded-[2.5rem] text-white">
          <h4 className="font-black text-xs uppercase tracking-widest text-emerald-400 mb-6">Support Efficiency</h4>
          <div className="flex items-end gap-4 h-32">
            <div className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full bg-slate-800 rounded-t-xl" style={{ height: `${(openTickets / (tickets.length || 1)) * 100}%` }}></div>
              <span className="text-[10px] font-bold text-slate-500 uppercase">Open</span>
            </div>
            <div className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full bg-emerald-500 rounded-t-xl" style={{ height: `${(resolvedTickets / (tickets.length || 1)) * 100}%` }}></div>
              <span className="text-[10px] font-bold text-slate-500 uppercase">Resolved</span>
            </div>
          </div>
        </div>

        {/* System Health */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <h4 className="font-black text-xs uppercase tracking-widest text-slate-400 mb-6">System Health</h4>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-slate-50">
              <span className="text-sm font-bold text-slate-600">Local Database (JSON)</span>
              <span className="text-[10px] font-black text-emerald-500 uppercase">Connected</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-50">
              <span className="text-sm font-bold text-slate-600">Inventory Feed</span>
              <span className="text-[10px] font-black text-emerald-500 uppercase">Live</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm font-bold text-slate-600">Logistics API</span>
              <span className="text-[10px] font-black text-amber-500 uppercase">Standby</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}