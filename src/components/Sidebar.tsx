import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { LayoutDashboard, LogOut, History, Sparkles, Megaphone, PenLine } from 'lucide-react'

interface SidebarProps {
  isOpen: boolean
  onToggle: () => void
}

export default function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const navigate = useNavigate()
  const { logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const navClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition ${
      isActive
        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
    }`

  return (
    <>
      <div
        className={`fixed left-0 top-16 w-64 bg-slate-900 text-white shadow-xl transition-transform duration-300 z-40 flex flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 md:static md:top-0`}
        style={{ height: 'calc(100vh - 4rem)' }}
      >
        <div className="px-6 py-6 border-b border-slate-700/80 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
              <Sparkles size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold leading-tight">MarketingAI</h1>
              <p className="text-xs text-slate-400">Ads & Content Platform</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-hidden">
          <NavLink to="/dashboard" className={navClass} onClick={onToggle}>
            <LayoutDashboard size={20} />
            Dashboard
          </NavLink>
          <NavLink to="/ads" className={navClass} onClick={onToggle}>
            <Megaphone size={20} />
            Ads Generator
          </NavLink>
          <NavLink to="/content" className={navClass} onClick={onToggle}>
            <PenLine size={20} />
            Content Writer
          </NavLink>
          <NavLink to="/history" className={navClass} onClick={onToggle}>
            <History size={20} />
            Content History
          </NavLink>
        </nav>

        <div className="px-4 py-6 border-t border-slate-700/80 flex-shrink-0">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white transition font-medium"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={onToggle} />
      )}
    </>
  )
}
