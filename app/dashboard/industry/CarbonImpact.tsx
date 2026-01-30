'use client';

interface Transaction {
  amount: number;
  transaction_type: string;
}

export default function CarbonImpact({ history }: { history: Transaction[] }) {
  const estimatedTons = history.reduce(
    (acc, curr) => acc + curr.amount / 4000,
    0
  );

const co2Saved = Math.round(estimatedTons * 1.5);     // ✅ number
const carbonCredits = co2Saved * 0.8;     // ✅ number
const treesEquivalent = Math.floor(co2Saved * 45);

  return (
    <div className="space-y-6">

      {/* HERO CARD */}
      <div className="bg-slate-900 rounded-2xl p-8 text-white">
        <p className="text-xs uppercase tracking-widest text-slate-400 mb-3">
          Environmental Impact
        </p>

        <h2 className="text-5xl font-semibold mb-2">
          {co2Saved}
          <span className="text-xl font-normal text-slate-300 ml-2">
            tons CO₂e avoided
          </span>
        </h2>

        <p className="text-sm text-slate-400 max-w-lg">
          Estimated reduction in carbon emissions achieved by diverting agricultural
          residue from open-field burning.
        </p>
      </div>

      {/* METRICS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <MetricCard
          icon="🌱"
          value={treesEquivalent}
          label="Trees equivalent per year"
        />
        <MetricCard
          icon="⬡"
          value={carbonCredits}
          label="Estimated carbon credits"
        />
      </div>

      {/* BREAKDOWN */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200">
        <h4 className="text-xs uppercase tracking-widest text-slate-500 mb-6">
          Contribution by Material
        </h4>

        <div className="space-y-5">
          {[
            { label: 'Wheat Straw', val: '65%', color: 'bg-emerald-400' },
            { label: 'Rice Husk', val: '25%', color: 'bg-amber-400' },
            { label: 'Sugarcane Bagasse', val: '10%', color: 'bg-blue-400' },
          ].map((item) => (
            <div key={item.label}>
              <div className="flex justify-between text-xs text-slate-600 mb-2">
                <span>{item.label}</span>
                <span>{item.val}</span>
              </div>

              <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className={`${item.color} h-full`}
                  style={{ width: item.val }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------- Metric Card ---------- */

function MetricCard({
  icon,
  value,
  label,
}: {
  icon: string;
  value: number | string;
  label: string;
}) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 flex items-center gap-4">
      <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-xl">
        {icon}
      </div>
      <div>
        <p className="text-2xl font-semibold text-slate-900">{value}</p>
        <p className="text-xs text-slate-500">{label}</p>
      </div>
    </div>
  );
}
