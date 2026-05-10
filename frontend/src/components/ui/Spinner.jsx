export default function Spinner({ size = 8 }) {
  return (
    <div
      className={`w-${size} h-${size} border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin`}
    />
  )
}
