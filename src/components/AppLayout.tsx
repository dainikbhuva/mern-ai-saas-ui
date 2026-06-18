import { useState } from 'react'
import Header from './Header'
import Sidebar from './Sidebar'

interface QuotaData {
  plan: string
  remainingQuota: number
}

interface AppLayoutProps {
  children: React.ReactNode
  quota?: QuotaData | null
}

export default function AppLayout({ children, quota }: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
      <Header quota={quota} onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex h-[calc(100vh-4rem)] pt-16">
        <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(false)} />
        <main className="flex-1 overflow-y-auto w-full">{children}</main>
      </div>
    </div>
  )
}
