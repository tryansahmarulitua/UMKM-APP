export default function FullPageSpinner() {
  return (
    <div className="flex h-screen items-center justify-center bg-gray-50" role="status" aria-label="Memuat...">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
    </div>
  )
}
