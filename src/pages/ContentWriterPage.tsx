import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { aiAPI } from '../services/api'
import AppLayout from '../components/AppLayout'
import ContentOutputDisplay from '../components/ContentOutputDisplay'
import ExportButtons from '../components/ExportButtons'
import { CONTENT_TYPE_LABELS, type ContentType } from '../utils/contentLabels'
import { jsonToMarkdown, jsonToPlainText } from '../utils/exportContent'
import { FileText, Share2, ShoppingBag, Search, Sparkles, Copy } from 'lucide-react'

interface QuotaData {
  plan: string
  monthlyQuota: number
  usedThisMonth: number
  remainingQuota: number
}

const CONTENT_TYPES: { type: ContentType; icon: typeof FileText; desc: string }[] = [
  { type: 'blog', icon: FileText, desc: 'Full blog articles with SEO' },
  { type: 'social_media', icon: Share2, desc: 'Platform-ready social posts' },
  { type: 'product_description', icon: ShoppingBag, desc: 'Product copy & bullet points' },
  { type: 'seo', icon: Search, desc: 'SEO titles, meta & articles' },
]

const TONE_OPTIONS = ['professional', 'casual', 'friendly', 'persuasive', 'informative']
const PLATFORM_OPTIONS = ['LinkedIn', 'Instagram', 'Twitter/X', 'Facebook', 'Multi-platform']

export default function ContentWriterPage() {
  const [searchParams] = useSearchParams()
  const initialType = (searchParams.get('type') as ContentType) || 'blog'

  const [sidebarQuota, setSidebarQuota] = useState<QuotaData | null>(null)
  const [contentType, setContentType] = useState<ContentType>(
    CONTENT_TYPES.some((c) => c.type === initialType) ? initialType : 'blog',
  )
  const [topic, setTopic] = useState('')
  const [tone, setTone] = useState('professional')
  const [keywords, setKeywords] = useState('')
  const [audience, setAudience] = useState('')
  const [platform, setPlatform] = useState('LinkedIn')
  const [productName, setProductName] = useState('')
  const [features, setFeatures] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [output, setOutput] = useState('')
  const [showOutput, setShowOutput] = useState(false)

  useEffect(() => {
    aiAPI.getQuota().then((res) => {
      if (res.data.success) setSidebarQuota(res.data.data)
    })
  }, [])

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault()

    const resolvedTopic = contentType === 'product_description' ? productName : topic
    if (!resolvedTopic.trim()) {
      setError(contentType === 'product_description' ? 'Product name is required' : 'Topic is required')
      return
    }

    setLoading(true)
    setError('')
    setShowOutput(false)

    try {
      const response = await aiAPI.generateContent({
        type: contentType,
        topic: contentType !== 'product_description' ? topic : undefined,
        productName: contentType === 'product_description' ? productName : undefined,
        features: contentType === 'product_description' ? features : undefined,
        tone,
        keywords,
        audience,
        platform: contentType === 'social_media' ? platform : undefined,
      })

      if (response.data.success) {
        setOutput(response.data.data.output)
        setShowOutput(true)
        const q = await aiAPI.getQuota()
        if (q.data.success) setSidebarQuota(q.data.data)
      } else {
        setError(response.data.error?.message || 'Generation failed')
      }
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { error?: { message?: string } } } }).response?.data?.error
          ?.message || 'Failed to generate content'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  const exportContent = jsonToPlainText(output)
  const exportMd = jsonToMarkdown(output)
  const exportName = `${contentType}-${topic || productName || 'content'}`.slice(0, 40)

  return (
    <AppLayout quota={sidebarQuota}>
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-8">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold mb-3">
            <Sparkles size={14} />
            AI Content Writer
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">Generate Marketing Content</h1>
          <p className="mt-2 text-slate-600">
            Blogs, social media posts, product descriptions & SEO content — powered by Google Gemini
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          {CONTENT_TYPES.map(({ type, icon: Icon, desc }) => (
            <button
              key={type}
              type="button"
              onClick={() => setContentType(type)}
              className={`text-left p-4 rounded-xl border transition ${
                contentType === type
                  ? 'border-emerald-500 bg-emerald-50 ring-2 ring-emerald-500/20'
                  : 'border-slate-200 bg-white hover:border-emerald-300'
              }`}
            >
              <Icon size={22} className={contentType === type ? 'text-emerald-600' : 'text-slate-400'} />
              <p className="font-semibold text-slate-900 mt-2 text-sm">{CONTENT_TYPE_LABELS[type]}</p>
              <p className="text-xs text-slate-500 mt-1">{desc}</p>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-6">
              {CONTENT_TYPE_LABELS[contentType]} Settings
            </h2>

            <form onSubmit={handleGenerate} className="space-y-4">
              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
              )}

              {contentType === 'product_description' ? (
                <>
                  <Field label="Product Name" required>
                    <input
                      value={productName}
                      onChange={(e) => setProductName(e.target.value)}
                      placeholder="e.g. SmartWatch Pro X"
                      className={inputClass}
                      disabled={loading}
                    />
                  </Field>
                  <Field label="Key Features">
                    <textarea
                      value={features}
                      onChange={(e) => setFeatures(e.target.value)}
                      placeholder="List main features, specs, benefits..."
                      rows={3}
                      className={inputClass}
                      disabled={loading}
                    />
                  </Field>
                </>
              ) : (
                <Field label="Topic / Subject" required>
                  <textarea
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder={
                      contentType === 'blog'
                        ? 'e.g. 10 Benefits of Remote Work in 2025'
                        : contentType === 'seo'
                          ? 'e.g. best project management tools'
                          : 'e.g. Summer sale launch campaign'
                    }
                    rows={3}
                    className={inputClass}
                    disabled={loading}
                  />
                </Field>
              )}

              {contentType === 'social_media' && (
                <Field label="Platform">
                  <select value={platform} onChange={(e) => setPlatform(e.target.value)} className={inputClass} disabled={loading}>
                    {PLATFORM_OPTIONS.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </Field>
              )}

              <Field label="Target Audience">
                <input
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                  placeholder="e.g. Small business owners, tech enthusiasts"
                  className={inputClass}
                  disabled={loading}
                />
              </Field>

              <Field label="Tone">
                <select value={tone} onChange={(e) => setTone(e.target.value)} className={inputClass} disabled={loading}>
                  {TONE_OPTIONS.map((t) => (
                    <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                  ))}
                </select>
              </Field>

              {(contentType === 'blog' || contentType === 'seo' || contentType === 'product_description') && (
                <Field label="Keywords (optional)">
                  <input
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                    placeholder="e.g. remote work, productivity, collaboration"
                    className={inputClass}
                    disabled={loading}
                  />
                </Field>
              )}

              <div className="rounded-lg bg-indigo-50 border border-indigo-100 p-3 text-xs text-indigo-800">
                Using <strong>Google Gemini</strong> (free tier) for content generation
              </div>

              <button
                type="submit"
                disabled={loading || !sidebarQuota || sidebarQuota.remainingQuota === 0}
                className="w-full h-12 flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold hover:from-emerald-700 hover:to-teal-700 transition disabled:opacity-50 shadow-md shadow-emerald-500/20"
              >
                <Sparkles size={18} />
                {loading ? 'Generating...' : `Generate ${CONTENT_TYPE_LABELS[contentType]}`}
              </button>
            </form>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm min-h-[400px]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-slate-900">Generated Content</h3>
              {showOutput && (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => navigator.clipboard.writeText(exportContent)}
                    className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 transition"
                    title="Copy"
                  >
                    <Copy size={16} />
                  </button>
                </div>
              )}
            </div>

            {!showOutput ? (
              <div className="flex flex-col items-center justify-center h-64 text-center text-slate-500">
                <FileText size={40} className="text-slate-300 mb-4" />
                <p className="text-sm">Your generated content will appear here.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="max-h-[520px] overflow-y-auto pr-1">
                  <ContentOutputDisplay raw={output} />
                </div>
                <ExportButtons
                  plainContent={exportContent}
                  markdownContent={exportMd}
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
  'w-full p-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition bg-white text-slate-900 placeholder:text-slate-400 text-sm'

function Field({
  label,
  required,
  children,
}: {
  label: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <div>
      <label className="text-sm font-semibold text-slate-700 mb-1.5 block">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
    </div>
  )
}
