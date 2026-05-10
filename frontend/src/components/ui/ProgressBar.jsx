export default function ProgressBar({ value, max, label }) {
  const pct = Math.round((value / max) * 100)
  return (
    <div>
      {label && <p className="text-sm text-gray-600 mb-1">{label}</p>}
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-600 rounded-full transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
