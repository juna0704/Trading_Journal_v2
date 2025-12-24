export function AdminStats({ stats }: { stats: any }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
      <Stat label="Total Users" value={stats.total} />
      <Stat label="Active" value={stats.active} />
      <Stat label="Inactive" value={stats.inactive} />
      <Stat label="Verified" value={stats.verified} />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="glass-strong rounded-xl p-6">
      <p className="text-sm opacity-60">{label}</p>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
}
