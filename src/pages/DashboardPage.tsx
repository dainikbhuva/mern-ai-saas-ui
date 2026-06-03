import { useState, useEffect } from 'react'
import { aiAPI } from '../services/api'
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'
import { TrendingUp, Clock, Zap } from 'lucide-react'

interface QuotaData {
  plan: string
  monthlyQuota: number
  usedThisMonth: number
  remainingQuota: number
}

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [productDescription, setProductDescription] = useState('')
  const [targetAudience, setTargetAudience] = useState('')
  const [provider, setProvider] = useState<'gemini' | 'openai'>('gemini')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [quota, setQuota] = useState<QuotaData | null>(null)
  const [output, setOutput] = useState('')
  const [showOutput, setShowOutput] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      try {
        const quotaRes = await aiAPI.getQuota()
        if (quotaRes.data.success) setQuota(quotaRes.data.data)
      } catch (err) {
        console.error('Failed to load data:', err)
      }
    }
    loadData()
  }, [])

  const handleGenerateAds = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!productDescription.trim() || !targetAudience.trim()) {
      setError('Please fill in all fields')
      return
    }

    setLoading(true)
    setError('')
    setShowOutput(false)

    try {
      const response = await aiAPI.generateAds(productDescription, targetAudience, provider)
      if (response.data.success) {
        setOutput(response.data.data.output)
        setShowOutput(true)
        setProductDescription('')
        setTargetAudience('')
        const newQuota = await aiAPI.getQuota()
        if (newQuota.data.success) setQuota(newQuota.data.data)
      } else {
        setError(response.data.error?.message || 'Generation failed')
      }
    } catch (err: any) {
      const message = err.response?.data?.error?.message || 'Failed to generate ads'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
      <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      {/* Layout Container */}
      <div className="flex h-[calc(100vh-4rem)] pt-16">
        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(false)} />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto w-full">
          <div className="w-full px-8 py-8">
            {/* Page Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-slate-900">Dashboard</h1>
              <p className="mt-2 text-slate-600">Generate Google Ads copy with AI</p>
            </div>

            {/* Top 3 Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Plan Card */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Plan</div>
                  <div className="p-3 bg-indigo-100 rounded-lg">
                    <TrendingUp size={20} className="text-indigo-600" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-slate-900 capitalize">{quota?.plan || 'Free'}</div>
                <div className="mt-2 text-sm text-slate-600">{quota?.monthlyQuota || 5} generations/month</div>
              </div>

              {/* This Month Card */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">This Month</div>
                  <div className="p-3 bg-orange-100 rounded-lg">
                    <Clock size={20} className="text-orange-600" />
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <div className="text-3xl font-bold text-slate-900">{quota?.usedThisMonth || 0}</div>
                  <div className="text-sm text-slate-600">/ {quota?.monthlyQuota || 5}</div>
                </div>
                <div className="mt-2 h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-orange-400 to-orange-600 transition-all"
                    style={{
                      width: `${((quota?.usedThisMonth || 0) / (quota?.monthlyQuota || 5)) * 100}%`,
                    }}
                  />
                </div>
              </div>

              {/* Module Card */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Module</div>
                  <div className="p-3 bg-green-100 rounded-lg">
                    <Zap size={20} className="text-green-600" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-slate-900">Ads Copy</div>
                <div className="mt-2 text-sm text-slate-600">Google Ads Generator</div>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Generator Form */}
              <div className="lg:col-span-2">
                <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
                  <h2 className="text-2xl font-bold text-slate-900 mb-6">Generate Google Ads Copy</h2>

                  <form onSubmit={handleGenerateAds} className="space-y-5">
                    {error && (
                      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 font-medium">
                        ⚠️ {error}
                      </div>
                    )}

                    <div>
                      <label className="text-sm font-semibold text-slate-700 mb-2 block">
                        Product/Service Description
                      </label>
                      <textarea
                        value={productDescription}
                        onChange={(e) => setProductDescription(e.target.value)}
                        placeholder="Describe your product or service..."
                        className="w-full p-4 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition bg-white text-slate-900 placeholder:text-slate-400"
                        rows={4}
                        disabled={loading}
                      />
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-slate-700 mb-2 block">Target Audience</label>
                      <textarea
                        value={targetAudience}
                        onChange={(e) => setTargetAudience(e.target.value)}
                        placeholder="Who is your target audience? (demographics, interests, etc.)"
                        className="w-full p-4 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition bg-white text-slate-900 placeholder:text-slate-400"
                        rows={3}
                        disabled={loading}
                      />
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-slate-700 mb-2 block">AI Provider</label>
                      <select
                        value={provider}
                        onChange={(e) => setProvider(e.target.value as 'gemini' | 'openai')}
                        className="w-full h-11 px-4 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition bg-white text-slate-900 font-medium"
                        disabled={loading}
                      >
                        <option value="gemini">Google Gemini</option>
                        <option value="openai">OpenAI GPT-3.5</option>
                      </select>
                    </div>

                    <button
                      type="submit"
                      disabled={loading || !quota || quota.remainingQuota === 0}
                      className="w-full h-12 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-lg font-semibold hover:from-indigo-700 hover:to-indigo-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? '✨ Generating...' : '✨ Generate Ads'}
                    </button>

                    {quota && quota.remainingQuota === 0 && (
                      <p className="text-sm text-red-600 text-center font-medium">
                        You have reached your monthly quota. Upgrade to Pro for unlimited generations.
                      </p>
                    )}
                  </form>
                </div>
              </div>

              {/* Output Display */}
              {showOutput && (
                <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
                  <h3 className="text-xl font-bold text-slate-900 mb-4">Generated Output</h3>
                  <div className="bg-slate-900 text-slate-100 p-6 rounded-lg max-h-96 overflow-y-auto text-sm font-mono whitespace-pre-wrap break-words border border-slate-700">
                    {output}
                  </div>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(output)
                      alert('Copied to clipboard!')
                    }}
                    className="mt-4 w-full h-10 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-lg font-medium transition"
                  >
                    📋 Copy to Clipboard
                  </button>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
