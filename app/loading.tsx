export default function Loading() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-sky-50">
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 border-4 border-pink-400 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-pink-600 font-medium">Loading game...</p>
      </div>
    </div>
  )
}
