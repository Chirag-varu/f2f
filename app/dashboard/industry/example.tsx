'use client';

import { useState, useEffect } from 'react';

// --- TYPES & INTERFACES ---
interface Transaction {
  id: string;
  amount: number;
  transaction_type: string;
  refernce: string; 
  created_at: string;
}

interface SupportTicket {
  id: string;
  subject: string;
  category: 'Technical' | 'Billing' | 'Supply' | 'General';
  status: 'Open' | 'Resolved';
  created_at: string;
}

interface NavItemProps {
  name: string;
  icon: string;
}

export default function IndustryDashboard() {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [history, setHistory] = useState<Transaction[]>([]);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  
  // Form States
  const [newAmount, setNewAmount] = useState('');
  const [newRef, setNewRef] = useState('');
  const [newType, setNewType] = useState('Purchase');
  
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketCategory, setTicketCategory] = useState<'Technical' | 'Billing' | 'Supply' | 'General'>('General');

  // --- LOCAL STORAGE LOGIC ---
  useEffect(() => {
    // Load Transactions
    const savedTxns = localStorage.getItem('local_transactions');
    if (savedTxns) setHistory(JSON.parse(savedTxns));
    else {
      const dummy = [
        { id: '1', amount: 42500, transaction_type: 'Purchase', refernce: 'REF-AGRI-9921', created_at: new Date().toISOString() },
      ];
      saveTxns(dummy);
    }

    // Load Support Tickets
    const savedTickets = localStorage.getItem('local_tickets');
    if (savedTickets) setTickets(JSON.parse(savedTickets));
    else {
      const dummyTickets: SupportTicket[] = [
        { id: 'TKT-101', subject: 'Inbound shipment delay SH-7821', category: 'Supply', status: 'Open', created_at: new Date().toISOString() }
      ];
      saveTickets(dummyTickets);
    }
  }, []);

  const saveTxns = (data: Transaction[]) => {
    setHistory(data);
    localStorage.setItem('local_transactions', JSON.stringify(data));
  };

  const saveTickets = (data: SupportTicket[]) => {
    setTickets(data);
    localStorage.setItem('local_tickets', JSON.stringify(data));
  };

  // --- CRUD ACTIONS ---
  const handleAddTxn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAmount) return;
    const newItem: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      amount: Number(newAmount),
      transaction_type: newType,
      refernce: newRef || `REF-${Math.floor(Math.random() * 10000)}`,
      created_at: new Date().toISOString()
    };
    saveTxns([newItem, ...history]);
    setNewAmount(''); setNewRef('');
  };

  const handleAddTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject) return;
    const newTicket: SupportTicket = {
      id: `TKT-${Math.floor(Math.random() * 900) + 100}`,
      subject: ticketSubject,
      category: ticketCategory,
      status: 'Open',
      created_at: new Date().toISOString()
    };
    saveTickets([newTicket, ...tickets]);
    setTicketSubject('');
  };

 const toggleTicketStatus = (id: string) => {
  const updated: SupportTicket[] = tickets.map(t => 
    t.id === id 
      ? { ...t, status: (t.status === 'Open' ? 'Resolved' : 'Open') as 'Open' | 'Resolved' } 
      : t
  );
  saveTickets(updated);
};

  const deleteTicket = (id: string) => {
    saveTickets(tickets.filter(t => t.id !== id));
  };

  // --- SUB-COMPONENTS ---
  const NavItem = ({ name, icon }: NavItemProps) => {
    const isActive = activeTab === name.toLowerCase();
    return (
      <button
        onClick={() => setActiveTab(name.toLowerCase())}
        className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-200 ${
          isActive ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
        }`}
      >
        <span className="text-xl">{icon}</span>
        <span className="font-bold text-sm tracking-wide">{name}</span>
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans text-slate-900">
      
      {/* --- SIDEBAR --- */}
      <aside className="w-72 bg-[#0F172A] text-white flex flex-col sticky top-0 h-screen hidden lg:flex">
        <div className="p-8 mb-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-2xl shadow-lg">🌱</div>
          <span className="text-xl font-black tracking-tighter uppercase">AgriCircular</span>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          <NavItem name="Overview" icon="📊" />
          <NavItem name="Marketplace" icon="🛒" />
          <NavItem name="History" icon="🕒" />
          <NavItem name="Support" icon="🎧" />
        </nav>
      </aside>

      <main className="flex-1 flex flex-col max-h-screen overflow-y-auto">
        <header className="h-24 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-10 sticky top-0 z-10">
          <h2 className="text-2xl font-black tracking-tight capitalize">{activeTab}</h2>
        </header>

        <div className="p-10 space-y-8">
          
          {/* HISTORY TAB */}
          {activeTab === 'history' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <form onSubmit={handleAddTxn} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <input value={newRef} onChange={(e) => setNewRef(e.target.value)} placeholder="Ref ID" className="px-4 py-3 rounded-xl bg-slate-50 border-none text-sm" />
                <input type="number" value={newAmount} onChange={(e) => setNewAmount(e.target.value)} placeholder="Amount ₹" className="px-4 py-3 rounded-xl bg-slate-50 border-none text-sm" />
                <select value={newType} onChange={(e) => setNewType(e.target.value)} className="px-4 py-3 rounded-xl bg-slate-50 border-none text-sm">
                  <option>Purchase</option><option>Logistics</option><option>Inventory</option>
                </select>
                <button type="submit" className="bg-emerald-600 text-white h-[48px] rounded-xl font-bold text-sm">Add Transaction</button>
              </form>

              <section className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-slate-50/50">
                    <tr>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase">Reference</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase">Type</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase">Amount</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {history.map((txn) => (
                      <tr key={txn.id} className="hover:bg-slate-50/50 group">
                        <td className="px-8 py-6 font-bold text-sm text-slate-700">{txn.refernce}</td>
                        <td className="px-8 py-6"><span className="px-3 py-1 bg-slate-100 rounded-full text-[10px] font-black uppercase">{txn.transaction_type}</span></td>
                        <td className="px-8 py-6 text-sm font-black text-slate-900">₹{txn.amount.toLocaleString()}</td>
                        <td className="px-8 py-6 text-right">
                          <button onClick={() => saveTxns(history.filter(t => t.id !== txn.id))} className="text-red-400 text-[10px] font-black uppercase opacity-0 group-hover:opacity-100">Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>
            </div>
          )}

          {/* SUPPORT TAB */}
          {activeTab === 'support' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <form onSubmit={handleAddTicket} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex gap-4 items-end">
                <div className="flex-1 space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Issue Subject</label>
                  <input value={ticketSubject} onChange={(e) => setTicketSubject(e.target.value)} placeholder="What do you need help with?" className="w-full px-4 py-3 rounded-xl bg-slate-50 border-none text-sm focus:ring-2 ring-emerald-500" />
                </div>
                <div className="w-48 space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Category</label>
                  <select value={ticketCategory} onChange={(e) => setTicketCategory(e.target.value as any)} className="w-full px-4 py-3 rounded-xl bg-slate-50 border-none text-sm appearance-none">
                    <option>General</option><option>Technical</option><option>Billing</option><option>Supply</option>
                  </select>
                </div>
                <button type="submit" className="bg-slate-900 text-white h-[48px] px-8 rounded-xl font-bold text-sm hover:bg-slate-800 transition-all shadow-md">Create Ticket</button>
              </form>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {tickets.map((t) => (
                  <div key={t.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col justify-between group">
                    <div className="flex justify-between items-start mb-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${t.status === 'Open' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                        {t.status}
                      </span>
                      <span className="text-[10px] font-bold text-slate-300 uppercase tracking-tighter">{t.id}</span>
                    </div>
                    <h4 className="font-bold text-slate-800 mb-1">{t.subject}</h4>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">{t.category}</p>
                    <div className="flex justify-between items-center pt-4 border-t border-slate-50">
                      <button onClick={() => toggleTicketStatus(t.id)} className="text-[10px] font-black uppercase tracking-widest text-emerald-600 hover:text-emerald-700">
                        {t.status === 'Open' ? 'Mark as Resolved' : 'Reopen Ticket'}
                      </button>
                      <button onClick={() => deleteTicket(t.id)} className="text-[10px] font-black uppercase tracking-widest text-red-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'overview' && (
             <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-[2.5rem] text-slate-400">
                <span className="text-4xl mb-4">📊</span>
                <p className="font-black text-xs uppercase tracking-widest">Select History or Support to manage data</p>
             </div>
          )}
        </div>
      </main>
    </div>
  );
}