import { useAuth } from '../auth/AuthContext'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { aiAPI } from '../services/api'

interface Generation {
  id: string
  type: string
  provider: string
  output: string
  createdAt: string
}

interface QuotaData {
  plan: string
  monthlyQuota: number
  usedThisMonth: number
  remainingQuota: number
}

export default function DashboardPage() {
  const navigate = useNavigate()
  const { logout } = useAuth()

  const [productDescription, setProductDescription] = useState('')
  const [targetAudience, setTargetAudience] = useState('')
  const [provider, setProvider] = useState<'gemini' | 'openai'>('gemini')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [quota, setQuota] = useState<QuotaData | null>(null)
  const [history, setHistory] = useState<Generation[]>([])
  const [output, setOutput] = useState('')
  const [showOutput, setShowOutput] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      try {
        const [quotaRes, historyRes] = await Promise.all([aiAPI.getQuota(), aiAPI.getHistory()])
        if (quotaRes.data.success) setQuota(quotaRes.data.data)
        if (historyRes.data.success) setHistory(historyRes.data.data.generations)
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
        const [newQuota, newHistory] = await Promise.all([aiAPI.getQuota(), aiAPI.getHistory()])
        if (newQuota.data.success) setQuota(newQuota.data.data)
        if (newHistory.data.success) setHistory(newHistory.data.data.generations)
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
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto w-full max-w-6xl px-4 py-10">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">AI Marketing Dashboard</h1>
            <p className="mt-1 text-sm text-slate-600">
              Generate Google Ads copy with AI
            </p>
          </div>

          <button
            onClick={() => {
              logout()
              navigate('/login')
            }}
            className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-800 hover:bg-slate-100 transition"
          >
            Logout
          </button>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3 mb-8">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="text-xs font-semibold text-slate-500 uppercase">Plan</div>
            <div className="mt-2 text-lg font-semibold capitalize">{quota?.plan || 'Free'}</div>
            <div className="mt-1 text-sm text-slate-600">{quota?.monthlyQuota || 5} generations/month</div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="text-xs font-semibold text-slate-500 uppercase">This Month</div>
            <div className="mt-2 text-lg font-semibold">{quota?.usedThisMonth || 0} used</div>
            <div className="mt-1 text-sm text-slate-600">{quota?.remainingQuota || 5} remaining</div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="text-xs font-semibold text-slate-500 uppercase">Module</div>
            <div className="mt-2 text-lg font-semibold">Ads Copy</div>
            <div className="mt-1 text-sm text-slate-600">Google Ads Generator</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-md">
              <h2 className="text-xl font-bold mb-4">Generate Google Ads Copy</h2>

              <form onSubmit={handleGenerateAds} className="space-y-4">
                {error && (
                  <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                    {error}
                  </div>
                )}

                <div>
                  <label className="text-sm font-medium text-slate-700">Product/Service Description</label>
                  <textarea
                    value={productDescription}
                    onChange={(e) => setProductDescription(e.target.value)}
                    placeholder="Describe your product or service..."
                    className="w-full mt-2 p-3 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition bg-white text-slate-900 placeholder:text-slate-400"
                    rows={4}
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700">Target Audience</label>
                  <textarea
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    placeholder="Who is your target audience? (demographics, interests, etc.)"
                    className="w-full mt-2 p-3 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition bg-white text-slate-900 placeholder:text-slate-400"
                    rows={3}
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700">AI Provider</label>
                  <select
                    value={provider}
                    onChange={(e) => setProvider(e.target.value as 'gemini' | 'openai')}
                    className="w-full mt-2 h-10 px-3 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition bg-white text-slate-900"
                    disabled={loading}
                  >
                    <option value="gemini">Google Gemini</option>
                    <option value="openai">OpenAI GPT-3.5</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={loading || !quota || quota.remainingQuota === 0}
                  className="w-full h-11 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Generating...' : 'Generate Ads'}
                </button>

                {quota && quota.remainingQuota === 0 && (
                  <p className="text-sm text-red-600 text-center">
                    You have reached your monthly quota. Upgrade to Pro for unlimited generations.
                  </p>
                )}
              </form>
            </div>
          </div>

          <div className="lg:col-span-1">
            {showOutput && (
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-md">
                <h3 className="text-lg font-bold mb-4">Generated Output</h3>
                <div className="bg-slate-50 p-4 rounded-lg max-h-96 overflow-y-auto text-sm text-slate-700 whitespace-pre-wrap font-mono">
                  {output}
                </div>
              </div>
            )}
          </div>
        </div>
        {history.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4">Generation History</h2>
            <div className="space-y-3">
              {history.slice(0, 5).map((gen) => (
                <div
                  key={gen.id}
                  className="rounded-lg border border-slate-200 bg-white p-4 hover:shadow-md transition cursor-pointer"
                  onClick={() => {
                    setOutput(gen.output)
                    setShowOutput(true)
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold bg-indigo-100 text-indigo-700 px-2 py-1 rounded capitalize">
                      {gen.type}
                    </span>
                    <span className="text-xs text-slate-500">
                      {new Date(gen.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 truncate">{gen.output.substring(0, 100)}...</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
