export function Loader({ text = 'Carregando...' }: { text?: string }) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 border-4 border-blue-100 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
      </div>
      <p className="text-neutral-500 text-sm font-medium animate-pulse">{text}</p>
    </div>
  )
}

export function PageLoader() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-white">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-700 to-blue-800 rounded-lg flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
        <span className="text-xl font-bold text-blue-700">SINPROPNC</span>
      </div>
      <p className="text-neutral-400 text-sm">A carregar...</p>
    </div>
  )
}