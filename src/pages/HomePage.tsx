import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { aiAPI } from '../services/api'
import AppLayout from '../components/AppLayout'
import { getGenerationLabel, getGenerationTopic } from '../utils/contentLabels'
import {
  Megaphone,
  PenLine,
  TrendingUp,
  Clock,
  ArrowRight,
  FileText,
  Share2,
  ShoppingBag,
  Search,
} from 'lucide-react'

interface QuotaData {
  plan: string
  monthlyQuota: number
  usedThisMonth: number
  remainingQuota: number
}

interface Generation {
  id: string
  type: string
  output: string
  input?: Record<string, unknown>
  createdAt: string
}

export default function HomePage() {
  const [quota, setQuota] = useState<QuotaData | null>(null)
  const [recent, setRecent] = useState<Generation[]>([])

  useEffect(() => {
    const load = async () => {
      try {
        const [quotaRes, historyRes] = await Promise.all([aiAPI.getQuota(), aiAPI.getHistory()])
        if (quotaRes.data.success) setQuota(quotaRes.data.data)
        if (historyRes.data.success) setRecent(historyRes.data.data.generations.slice(0, 5))
      } catch (err) {
        console.error(err)
      }
    }
    load()
  }, [])

  const modules = [
    {
      title: 'AI Ads Copy Generator',
      desc: 'Google Ads headlines, descriptions, keywords & marketing tips',
      icon: Megaphone,
      href: '/ads',
      color: 'from-indigo-500 to-violet-600',
    },
    {
      title: 'AI Content Writer',
      desc: 'Blogs, social posts, product descriptions & SEO content',
      icon: PenLine,
      href: '/content',
      color: 'from-emerald-500 to-teal-600',
    },
  ]

  return (
    <AppLayout quota={quota}>
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">Dashboard</h1>
          <p className="mt-2 text-slate-600">
            AI-powered marketing platform — generate ads and content with Google Gemini
          </p>
        </div>

        {quota && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-500 uppercase">Plan</span>
                <TrendingUp size={18} className="text-indigo-600" />
              </div>
              <p className="text-2xl font-bold capitalize">{quota.plan}</p>
              <p className="text-sm text-slate-600 mt-1">{quota.monthlyQuota} generations/month</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-500 uppercase">Used</span>
                <Clock size={18} className="text-orange-600" />
              </div>
              <p className="text-2xl font-bold">
                {quota.usedThisMonth} <span className="text-base font-normal text-slate-500">/ {quota.monthlyQuota}</span>
              </p>
              <div className="mt-3 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-500 transition-all"
                  style={{ width: `${(quota.usedThisMonth / quota.monthlyQuota) * 100}%` }}
                />
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-500 uppercase">Remaining</span>
                <FileText size={18} className="text-emerald-600" />
              </div>
              <p className="text-2xl font-bold text-emerald-600">{quota.remainingQuota}</p>
              <p className="text-sm text-slate-600 mt-1">generations left this month</p>
            </div>
          </div>
        )}

        <h2 className="text-lg font-bold text-slate-900 mb-4">AI Modules</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {modules.map((mod) => (
            <Link
              key={mod.href}
              to={mod.href}
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md hover:border-indigo-200 transition"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${mod.color} flex items-center justify-center mb-4`}>
                <mod.icon size={24} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-700 transition">{mod.title}</h3>
              <p className="text-sm text-slate-600 mt-2">{mod.desc}</p>
              <span className="inline-flex items-center gap-1 mt-4 text-sm font-semibold text-indigo-600">
                Open module <ArrowRight size={16} />
              </span>
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
          {[
            { icon: FileText, label: 'Blog Posts', href: '/content?type=blog' },
            { icon: Share2, label: 'Social Media', href: '/content?type=social_media' },
            { icon: ShoppingBag, label: 'Product Copy', href: '/content?type=product_description' },
            { icon: Search, label: 'SEO Content', href: '/content?type=seo' },
          ].map((item) => (
            <Link
              key={item.label}
              to={item.href}
              className="flex flex-col items-center gap-2 p-4 rounded-xl border border-slate-200 bg-white hover:border-indigo-300 hover:bg-indigo-50/50 transition text-center"
            >
              <item.icon size={22} className="text-indigo-600" />
              <span className="text-xs font-semibold text-slate-700">{item.label}</span>
            </Link>
          ))}
        </div>

        {recent.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-900">Recent Content</h2>
              <Link to="/history" className="text-sm font-semibold text-indigo-600 hover:underline">
                View all history
              </Link>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white divide-y divide-slate-100">
              {recent.map((gen) => (
                <div key={gen.id} className="p-4 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <span className="text-xs font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded capitalize">
                      {getGenerationLabel(gen.type)}
                    </span>
                    <p className="text-sm font-medium text-slate-900 mt-1 truncate">
                      {getGenerationTopic(gen.input)}
                    </p>
                  </div>
                  <span className="text-xs text-slate-500 shrink-0">
                    {new Date(gen.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  )
}
