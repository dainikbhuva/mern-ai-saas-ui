import { useState, useEffect } from 'react'
import { aiAPI } from '../services/api'
import AppLayout from '../components/AppLayout'
import AdsOutputDisplay from '../components/AdsOutputDisplay'
import ContentOutputDisplay from '../components/ContentOutputDisplay'
import ExportButtons from '../components/ExportButtons'
import { parseAdsOutput } from '../utils/parseAdsOutput'
import { jsonToMarkdown, jsonToPlainText } from '../utils/exportContent'
import { getGenerationLabel, getGenerationTopic } from '../utils/contentLabels'
import { Copy } from 'lucide-react'

interface Generation {
  id: string
  type: string
  provider: string
  input?: Record<string, unknown>
  output: string
  createdAt: string
}

const FILTER_OPTIONS = ['all', 'ads', 'blog', 'social_media', 'product_description', 'seo'] as const

export default function HistoryPage() {
  const [history, setHistory] = useState<Generation[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [filter, setFilter] = useState<(typeof FILTER_OPTIONS)[number]>('all')

  const filtered = filter === 'all' ? history : history.filter((g) => g.type === filter)
  const selectedGen = history.find((g) => g.id === selectedId)
  const selectedParsedAds = selectedGen?.type === 'ads' ? parseAdsOutput(selectedGen.output) : null

  useEffect(() => {
    loadHistory()
  }, [])

  useEffect(() => {
    if (filtered.length > 0 && !filtered.find((g) => g.id === selectedId)) {
      setSelectedId(filtered[0].id)
    }
  }, [filter, filtered, selectedId])

  const loadHistory = async () => {
    try {
      setLoading(true)
      const response = await aiAPI.getHistory()
      if (response.data.success) {
        const gens = response.data.data.generations
        setHistory(gens)
        if (gens.length > 0) setSelectedId(gens[0].id)
      }
    } catch (err) {
      console.error('Failed to load history:', err)
    } finally {
      setLoading(false)
    }
  }

  const exportName = selectedGen
    ? `${selectedGen.type}-${getGenerationTopic(selectedGen.input)}`.slice(0, 40)
    : 'content'

  return (
    <AppLayout>
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">Content History</h1>
          <p className="mt-2 text-slate-600">All generated ads and content — export anytime</p>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {FILTER_OPTIONS.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                filter === f
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:border-indigo-300'
              }`}
            >
              {f === 'all' ? 'All' : getGenerationLabel(f)}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mx-auto mb-4" />
            <p className="text-slate-600">Loading history...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
            <p className="text-slate-600 text-lg">No content found. Generate ads or content first.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm max-h-[calc(100vh-14rem)] overflow-y-auto">
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
                  {filtered.length} item{filtered.length !== 1 ? 's' : ''}
                </h2>
                <div className="space-y-2">
                  {filtered.map((gen) => (
                    <button
                      key={gen.id}
                      type="button"
                      onClick={() => setSelectedId(gen.id)}
                      className={`w-full text-left p-3 rounded-xl border transition ${
                        selectedId === gen.id
                          ? 'border-indigo-500 bg-indigo-50 ring-1 ring-indigo-500/20'
                          : 'border-slate-200 hover:border-indigo-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5 gap-2">
                        <span className="text-xs font-semibold bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded">
                          {getGenerationLabel(gen.type)}
                        </span>
                        <span className="text-xs text-slate-500 shrink-0">
                          {new Date(gen.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-slate-800 truncate">
                        {getGenerationTopic(gen.input)}
                      </p>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-1">{gen.output.substring(0, 60)}...</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-2">
              {selectedGen ? (
                <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
                  <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                    <div>
                      <h2 className="text-xl font-bold text-slate-900">{getGenerationTopic(selectedGen.input)}</h2>
                      <p className="text-sm text-slate-500 mt-1">
                        {getGenerationLabel(selectedGen.type)} · Gemini ·{' '}
                        {new Date(selectedGen.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => navigator.clipboard.writeText(selectedGen.output)}
                      className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium"
                    >
                      <Copy size={16} />
                      Copy
                    </button>
                  </div>

                  <div className="max-h-[480px] overflow-y-auto mb-4">
                    {selectedGen.type === 'ads' && selectedParsedAds?.parsed ? (
                      <AdsOutputDisplay output={selectedParsedAds.parsed} />
                    ) : selectedGen.type !== 'ads' ? (
                      <ContentOutputDisplay raw={selectedGen.output} />
                    ) : (
                      <div className="bg-slate-900 text-slate-100 p-5 rounded-xl text-sm font-mono whitespace-pre-wrap">
                        {selectedGen.output}
                      </div>
                    )}
                  </div>

                  <ExportButtons
                    plainContent={jsonToPlainText(selectedGen.output)}
                    markdownContent={jsonToMarkdown(selectedGen.output)}
                    filename={exportName}
                  />
                </div>
              ) : (
                <div className="rounded-2xl border border-slate-200 bg-white p-12 shadow-sm flex items-center justify-center min-h-64">
                  <p className="text-slate-600">Select an item to preview and export</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  )
}
