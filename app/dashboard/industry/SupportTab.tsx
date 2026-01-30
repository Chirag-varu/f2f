'use client';
export default function SupportTab({ tickets, onToggle, onDelete }: any) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {tickets.map((t: any) => (
        <div key={t.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm relative">
          <span className={`absolute top-6 right-6 px-3 py-1 rounded-full text-[10px] font-black uppercase ${t.status === 'Open' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
            {t.status}
          </span>
          <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">{t.category}</p>
          <h4 className="font-bold text-slate-800 mb-4">{t.subject}</h4>
          <div className="flex gap-4">
            <button onClick={() => onToggle(t.id)} className="text-[10px] font-black text-emerald-600 uppercase">Toggle Status</button>
            <button onClick={() => onDelete(t.id)} className="text-[10px] font-black text-red-400 uppercase">Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}