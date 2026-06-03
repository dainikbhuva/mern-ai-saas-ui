import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { LayoutDashboard, LogOut, History } from 'lucide-react'

interface SidebarProps {
  isOpen: boolean
  onToggle: () => void
}

export default function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const { logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const isActive = (path: string) => location.pathname === path

  return (
    <>
      {/* Sidebar */}
      <div
        className={`fixed left-0 top-16 w-64 bg-slate-900 text-white shadow-lg transition-transform duration-300 z-40 flex flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 md:static md:top-0`}
        style={{ height: 'calc(100vh - 4rem)' }}
      >
        {/* Logo */}
        <div className="px-6 py-8 border-b border-slate-700 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-lg">AI</span>
            </div>
            <h1 className="text-xl font-bold">AdGenius</h1>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-hidden">
          <a
            href="/dashboard"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition ${
              isActive('/dashboard')
                ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <LayoutDashboard size={20} />
            Dashboard
          </a>
          <a
            href="/history"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition ${
              isActive('/history')
                ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <History size={20} />
            History
          </a>
        </nav>

        {/* Logout Button */}
        <div className="px-4 py-6 border-t border-slate-700 flex-shrink-0">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition font-medium"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={onToggle}
        />
      )}
    </>
  )
}
