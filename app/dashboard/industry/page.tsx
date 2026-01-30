'use client';
import { useState, useEffect } from 'react';
import Overview from './Overview';
import HistoryTab from './HistoryTab';
import SupportTab from './SupportTab';
// ... import other tabs similarly

export default function IndustryDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [history, setHistory] = useState([]);
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    setHistory(JSON.parse(localStorage.getItem('local_transactions') || '[]'));
    setTickets(JSON.parse(localStorage.getItem('local_tickets') || '[]'));
  }, []);

  // CRUD Wrapper Functions
  const addTxn = (txn: any) => {
    const updated = [{ ...txn, id: Date.now().toString(), created_at: new Date().toISOString() }, ...history];
    setHistory(updated as any);
    localStorage.setItem('local_transactions', JSON.stringify(updated));
  };

  const deleteTxn = (id: string) => {
    const updated = history.filter((t: any) => t.id !== id);
    setHistory(updated);
    localStorage.setItem('local_transactions', JSON.stringify(updated));
  };

  const toggleTicket = (id: string) => {
    const updated = tickets.map((t: any) => 
      t.id === id ? { ...t, status: t.status === 'Open' ? 'Resolved' : 'Open' } : t
    );
    setTickets(updated as any);
    localStorage.setItem('local_tickets', JSON.stringify(updated));
  };

  const renderContent = () => {
    switch(activeTab) {
      case 'overview': return <Overview history={history} tickets={tickets} />;
      case 'history':  return <HistoryTab data={history} onDelete={deleteTxn} onAdd={addTxn} />;
      case 'support':  return <SupportTab tickets={tickets} onToggle={toggleTicket} onDelete={(id:any) => {}} />;
      default: return <div className="p-20 text-center font-black uppercase text-slate-300 italic">{activeTab} Coming Soon</div>;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex">
      <aside className="w-72 bg-[#0F172A] text-white p-6 space-y-2">
        {['Overview', 'History', 'Support', 'Marketplace', 'Logistics'].map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab.toLowerCase())}
            className={`w-full text-left px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest ${activeTab === tab.toLowerCase() ? 'bg-emerald-600' : 'text-slate-400 hover:bg-slate-800'}`}
          >
            {tab}
          </button>
        ))}
      </aside>
      <main className="flex-1 p-10">
        <h2 className="text-3xl font-black mb-8 capitalize">{activeTab}</h2>
        {renderContent()}
      </main>
    </div>
  );
}