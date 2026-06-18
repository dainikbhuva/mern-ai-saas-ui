import { Menu, Sparkles } from 'lucide-react'

interface QuotaData {
  plan: string
  remainingQuota: number
}

interface HeaderProps {
  onToggleSidebar: () => void
  quota?: QuotaData | null
}

export default function Header({ onToggleSidebar, quota }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm z-50">
      <div className="flex items-center justify-between h-full px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="md:hidden p-2 hover:bg-slate-100 rounded-lg transition"
            aria-label="Toggle sidebar"
          >
            <Menu size={22} className="text-slate-900" />
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center">
              <Sparkles size={18} className="text-white" />
            </div>
            <div className="hidden sm:block">
              <div className="text-sm font-bold text-slate-900 leading-tight">MarketingAI</div>
              <div className="text-xs text-slate-500 leading-tight">Ads & Content Platform</div>
            </div>
          </div>
        </div>

        {quota && (
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-xs font-medium text-slate-500 capitalize">
              {quota.plan} plan
            </span>
            <span className="px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-xs font-semibold text-indigo-700">
              {quota.remainingQuota} left this month
            </span>
          </div>
        )}
      </div>
    </header>
  )
}
