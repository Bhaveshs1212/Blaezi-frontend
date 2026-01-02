export default function PressureBar({ label, value, color }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-slate-600">
        <span>{label}</span>
        <span>{value}</span>
      </div>

      <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-300 ${color}`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}
