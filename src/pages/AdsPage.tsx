import { useState, useEffect } from 'react'
import { aiAPI } from '../services/api'
import AppLayout from '../components/AppLayout'
import AdsOutputDisplay from '../components/AdsOutputDisplay'
import ExportButtons from '../components/ExportButtons'
import { parseAdsOutput } from '../utils/parseAdsOutput'
import { jsonToMarkdown, jsonToPlainText } from '../utils/exportContent'
import type { AdsOutput } from '../types/ads'
import { Sparkles, Copy } from 'lucide-react'

interface QuotaData {
  plan: string
  monthlyQuota: number
  usedThisMonth: number
  remainingQuota: number
}

export default function AdsPage() {
  const [quota, setQuota] = useState<QuotaData | null>(null)
  const [productDescription, setProductDescription] = useState('')
  const [targetAudience, setTargetAudience] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [rawOutput, setRawOutput] = useState('')
  const [parsedOutput, setParsedOutput] = useState<AdsOutput | null>(null)
  const [showOutput, setShowOutput] = useState(false)

  useEffect(() => {
    aiAPI.getQuota().then((res) => {
      if (res.data.success) setQuota(res.data.data)
    })
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
      const response = await aiAPI.generateAds(productDescription, targetAudience)
      if (response.data.success) {
        const output = response.data.data.output as string
        const { parsed, raw } = parseAdsOutput(output)
        setRawOutput(raw)
        setParsedOutput(parsed)
        setShowOutput(true)
        const newQuota = await aiAPI.getQuota()
        if (newQuota.data.success) setQuota(newQuota.data.data)
      } else {
        setError(response.data.error?.message || 'Generation failed')
      }
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { error?: { message?: string } } } }).response?.data?.error
          ?.message || 'Failed to generate ads'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  const exportName = `google-ads-${productDescription.slice(0, 20) || 'campaign'}`

  return (
    <AppLayout quota={quota}>
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-8">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-semibold mb-3">
            <Sparkles size={14} />
            AI Ads Copy Generator
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">Generate Google Ads Copy</h1>
          <p className="mt-2 text-slate-600">
            Headlines, descriptions, keywords & marketing tips — powered by Google Gemini
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Campaign Details</h2>

            <form onSubmit={handleGenerateAds} className="space-y-5">
              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 font-medium">
                  {error}
                </div>
              )}

              <div>
                <label className="text-sm font-semibold text-slate-700 mb-2 block">
                  Product / Service Description
                </label>
                <textarea
                  value={productDescription}
                  onChange={(e) => setProductDescription(e.target.value)}
                  placeholder="e.g. Premium eco-friendly yoga mats with non-slip grip..."
                  className={inputClass}
                  rows={4}
                  disabled={loading}
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-700 mb-2 block">Target Audience</label>
                <textarea
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  placeholder="e.g. Women 25-45, fitness enthusiasts..."
                  className={inputClass}
                  rows={3}
                  disabled={loading}
                />
              </div>

              <div className="rounded-lg bg-indigo-50 border border-indigo-100 p-3 text-xs text-indigo-800">
                Using <strong>Google Gemini</strong> (free tier) for ad generation
              </div>

              <button
                type="submit"
                disabled={loading || !quota || quota.remainingQuota === 0}
                className="w-full h-12 flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-violet-700 transition disabled:opacity-50 shadow-md shadow-indigo-500/20"
              >
                <Sparkles size={18} />
                {loading ? 'Generating ads...' : 'Generate Ads Copy'}
              </button>

              {quota && quota.remainingQuota === 0 && (
                <p className="text-sm text-red-600 text-center font-medium">
                  Monthly quota reached ({quota.monthlyQuota}/month on {quota.plan} plan).
                </p>
              )}
            </form>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm min-h-[400px]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-slate-900">Generated Output</h3>
              {showOutput && (
                <button
                  type="button"
                  onClick={() => navigator.clipboard.writeText(rawOutput)}
                  className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200"
                  title="Copy raw"
                >
                  <Copy size={16} />
                </button>
              )}
            </div>

            {!showOutput ? (
              <div className="flex flex-col items-center justify-center h-64 text-center text-slate-500">
                <Sparkles size={40} className="text-slate-300 mb-4" />
                <p className="text-sm">Your headlines, descriptions, and keywords will appear here.</p>
              </div>
            ) : parsedOutput ? (
              <div className="space-y-4">
                <div className="max-h-[520px] overflow-y-auto pr-1">
                  <AdsOutputDisplay output={parsedOutput} onCopyAll={() => navigator.clipboard.writeText(rawOutput)} />
                </div>
                <ExportButtons
                  plainContent={jsonToPlainText(rawOutput)}
                  markdownContent={jsonToMarkdown(rawOutput)}
                  filename={exportName}
                />
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                  Showing raw AI response.
                </p>
                <div className="bg-slate-900 text-slate-100 p-5 rounded-xl max-h-96 overflow-y-auto text-sm font-mono whitespace-pre-wrap">
                  {rawOutput}
                </div>
                <ExportButtons
                  plainContent={rawOutput}
                  markdownContent={rawOutput}
                  filename={exportName}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  )
}

const inputClass =
  'w-full p-4 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition bg-white text-slate-900 placeholder:text-slate-400'
