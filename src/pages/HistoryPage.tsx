import { useState, useEffect } from 'react'
import { aiAPI } from '../services/api'
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'
import { Copy } from 'lucide-react'

interface Generation {
  id: string
  type: string
  provider: string
  output: string
  createdAt: string
}

export default function HistoryPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [history, setHistory] = useState<Generation[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOutput, setSelectedOutput] = useState<string | null>(null)

  useEffect(() => {
    loadHistory()
  }, [])

  const loadHistory = async () => {
    try {
      setLoading(true)
      const response = await aiAPI.getHistory()
      if (response.data.success) {
        setHistory(response.data.data.generations)
      }
    } catch (err) {
      console.error('Failed to load history:', err)
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
              <h1 className="text-4xl font-bold text-slate-900">Generation History</h1>
              <p className="mt-2 text-slate-600">View all your generated ads copy</p>
            </div>

            {loading ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                <p className="text-slate-600">Loading your history...</p>
              </div>
            ) : history.length === 0 ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
                <p className="text-slate-600 text-lg">No generation history yet. Start creating ads copy!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* History List */}
                <div className="lg:col-span-1">
                  <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm max-h-96 overflow-y-auto">
                    <h2 className="text-lg font-bold text-slate-900 mb-4">Recent Generations</h2>
                    <div className="space-y-3">
                      {history.map((gen) => (
                        <div
                          key={gen.id}
                          onClick={() => setSelectedOutput(gen.output)}
                          className={`p-3 rounded-lg border cursor-pointer transition ${
                            selectedOutput === gen.output
                              ? 'border-indigo-500 bg-indigo-50'
                              : 'border-slate-200 hover:border-indigo-300 bg-white'
                          }`}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <span className="text-xs font-semibold bg-indigo-100 text-indigo-700 px-2 py-1 rounded capitalize">
                              {gen.type}
                            </span>
                            <span className="text-xs text-slate-500">
                              {new Date(gen.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 line-clamp-2">{gen.output.substring(0, 80)}...</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Output Viewer */}
                {selectedOutput ? (
                  <div className="lg:col-span-2">
                    <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-slate-900">Output Preview</h2>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(selectedOutput)
                            alert('Copied to clipboard!')
                          }}
                          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition"
                        >
                          <Copy size={18} />
                          Copy
                        </button>
                      </div>
                      <div className="bg-slate-900 text-slate-100 p-6 rounded-lg min-h-64 max-h-96 overflow-y-auto text-sm font-mono whitespace-pre-wrap break-words border border-slate-700">
                        {selectedOutput}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="lg:col-span-2">
                    <div className="rounded-2xl border border-slate-200 bg-white p-12 shadow-sm flex items-center justify-center min-h-64">
                      <p className="text-slate-600 text-lg">Select a generation to view output</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
