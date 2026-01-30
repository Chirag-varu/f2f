'use client';

import { useState, useEffect } from 'react';
import MarketplaceCard from "@/components/MarketplaceCard";

// --- TYPES & INTERFACES ---
interface NavItemProps {
  name: string;
  icon: string;
}

interface Shipment {
  id: string;
  supplier: string;
  material: string;
  weight: string;
  status: string;
  color: string;
}

export default function IndustryDashboardPage() {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [wasteBatches, setWasteBatches] = useState<any[]>([]);
  const [materials, setMaterials] = useState<any[]>([]);

  // Fetch waste batches
  // Fetch waste batches from backend API
  const fetchWasteBatches = () => {
    fetch('/api/waste-batches')
      .then((res) => res.json())
      .then((data) => setWasteBatches(data));
  };

  useEffect(() => {
    if (activeTab === 'marketplace') {
      fetchWasteBatches();
    }
  }, [activeTab]);

  // Fetch materials
  useEffect(() => {
    if (activeTab === 'marketplace') {
      fetch('/materials.json')
        .then((res) => res.json())
        .then((data) => setMaterials(data));
    }
  }, [activeTab]);

// Type-safe Mock Data
const shipments: Shipment[] = [
  { id: 'SH-7821', supplier: 'Amritsar Bio-Hub', material: 'Wheat Straw', weight: '12 Tons', status: 'In Transit', color: 'text-blue-600 bg-blue-50' },
  { id: 'SH-7825', supplier: 'Gujarat Cotton Co', material: 'Cotton Stalk', weight: '8 Tons', status: 'Dispatched', color: 'text-amber-600 bg-amber-50' },
  { id: 'SH-7790', supplier: 'Pune Sugar Mills', material: 'Bagasse', weight: '24 Tons', status: 'Delivered', color: 'text-emerald-600 bg-emerald-50' },
];

// Type-safe Sub-component
const NavItem = ({ name, icon }: NavItemProps) => {
  const isActive = activeTab === name.toLowerCase();
  return (
    <button
      onClick={() => setActiveTab(name.toLowerCase())}
      className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-200 ${isActive
        ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/20'
        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
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
        <div className="p-8 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-2xl shadow-lg">🌱</div>
            <span className="text-xl font-black tracking-tighter uppercase">Farmer 2 Fuel</span>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          <NavItem name="Overview" icon="📊" />
          <NavItem name="Marketplace" icon="🛒" />
          <NavItem name="Inventory" icon="📦" />
          <NavItem name="Logistics" icon="🚚" />
          <NavItem name="Analytics" icon="📈" />
        </nav>

        <div className="p-6 border-t border-slate-800">
          <div className="bg-slate-800/50 p-4 rounded-2xl flex items-center gap-3 border border-slate-700">
            <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 font-bold">I</div>
            <div className="truncate">
              <p className="text-xs font-black truncate">Indus Biofuel Ltd</p>
              <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest text-ellipsis">Premium Partner</p>
            </div>
          </div>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 flex flex-col max-h-screen overflow-y-auto">
        <div className="p-10 space-y-8">
          {/* Only show the table on Overview tab */}
          {activeTab === 'overview' && (
            <div>
              <header className="h-24 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-10 sticky top-0 z-10">
                <div>
                  <h2 className="text-2xl font-black tracking-tight capitalize">{activeTab}</h2>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">Operational Dashboard v2.0</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="hidden md:block text-right mr-2">
                    <p className="text-sm font-black">Supply Manager</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Ludhiana Facility</p>
                  </div>
                  <button className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center hover:bg-slate-200 transition-all">
                    ⚙️
                  </button>
                </div>
              </header>
              <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Total Sourced</p>
                  <h3 className="text-4xl font-black text-emerald-600">1,420 <span className="text-lg font-medium text-slate-300">Tons</span></h3>
                </div>
                <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Active Procurement</p>
                  <h3 className="text-4xl font-black text-blue-600">08 <span className="text-lg font-medium text-slate-300">Orders</span></h3>
                </div>
                <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">ESG Impact</p>
                  <h3 className="text-4xl font-black text-slate-900">A<span className="text-emerald-500">+</span></h3>
                </div>
              </section>
              <section className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-8 border-b border-slate-50 flex justify-between items-center">
                  <h4 className="font-black text-lg tracking-tight">Recent Inbound Shipments</h4>
                  <button className="bg-emerald-50 text-emerald-700 px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-100 transition-all">
                    View All Logistics
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50/50">
                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Tracking ID</th>
                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Supplier</th>
                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Material</th>
                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Weight</th>
                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {shipments.map((ship, i) => (
                        <tr key={ship.id} className="hover:bg-slate-50/50 transition-colors group">
                          <td className="px-8 py-6 font-bold text-sm text-slate-900">{ship.id}</td>
                          <td className="px-8 py-6 text-sm text-slate-600 font-medium">{ship.supplier}</td>
                          <td className="px-8 py-6 text-sm text-slate-500">{ship.material}</td>
                          <td className="px-8 py-6 text-sm font-bold">{ship.weight}</td>
                          <td className="px-8 py-6">
                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${ship.color}`}>
                              {ship.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>
          )}
          {/* Marketplace tab content */}
          {activeTab === 'marketplace' && (
            <div>
              <h1 className="text-3xl font-bold mb-6 text-green-800">Marketplace</h1>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {wasteBatches.length === 0 ? (
                  <div className="text-gray-500 col-span-3">No waste batches available.</div>
                ) : (
                  wasteBatches.map((batch) => {
                    const material = materials.find((m) => m.id === batch.material_type);
                    const materialName = material ? material.name : batch.material_type;
                    const handleBook = async () => {
                      await fetch('/api/waste-batches', {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ id: batch.id, status: 'Booked' }),
                      });
                      fetchWasteBatches();
                    };
                    return (
                      <MarketplaceCard
                        key={batch.id}
                        listing={{
                          id: batch.id,
                          crop_type: materialName,
                          waste_type: materialName,
                          quantity: batch.quantity_kg.toString(),
                          availability_date: batch.created_at.split('T')[0],
                          location: batch.location || 'Maharashtra',
                          status: batch.status === 'Booked' ? 'Booked' : 'Available',
                          image_url: batch.image_url,
                        }}
                        onBook={handleBook}
                      />
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}