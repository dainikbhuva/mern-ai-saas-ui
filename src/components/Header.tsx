import { Menu } from 'lucide-react'

interface HeaderProps {
  onToggleSidebar: () => void
}

export default function Header({ onToggleSidebar }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 shadow-sm z-50">
      <div className="flex items-center justify-between h-full px-6">
        {/* Toggle Button */}
        <button
          onClick={onToggleSidebar}
          className="md:hidden p-2 hover:bg-slate-100 rounded-lg transition"
          aria-label="Toggle sidebar"
        >
          <Menu size={24} className="text-slate-900" />
        </button>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Right side - can add more options here if needed */}
        <div className="text-sm text-slate-600">AI Marketing Dashboard</div>
      </div>
    </header>
  )
}
