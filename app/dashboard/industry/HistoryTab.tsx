'use client';
import { useState } from 'react';

export default function HistoryTab({ data, onUpdate, onDelete, onAdd }: any) {
  const [newAmount, setNewAmount] = useState('');
  const [newRef, setNewRef] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({ amount: Number(newAmount), refernce: newRef, transaction_type: 'Purchase' });
    setNewAmount(''); setNewRef('');
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-[2rem] shadow-sm flex gap-4 items-end border border-slate-100">
        <input value={newRef} onChange={(e) => setNewRef(e.target.value)} placeholder="Ref ID" className="flex-1 px-4 py-3 rounded-xl bg-slate-50 text-sm" />
        <input type="number" value={newAmount} onChange={(e) => setNewAmount(e.target.value)} placeholder="Amount" className="flex-1 px-4 py-3 rounded-xl bg-slate-50 text-sm" />
        <button className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold text-sm">Add</button>
      </form>
      <div className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-8 py-4 text-[10px] font-black uppercase text-slate-400">Ref</th>
              <th className="px-8 py-4 text-[10px] font-black uppercase text-slate-400">Amount</th>
              <th className="px-8 py-4 text-[10px] font-black uppercase text-slate-400 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {data.map((txn: any) => (
              <tr key={txn.id} className="group hover:bg-slate-50/50">
                <td className="px-8 py-4 font-bold text-sm">{txn.refernce}</td>
                <td className="px-8 py-4 text-emerald-600 font-black">₹{txn.amount}</td>
                <td className="px-8 py-4 text-right">
                  <button onClick={() => onDelete(txn.id)} className="text-red-400 text-[10px] font-black uppercase">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}