import { Hash, Lightbulb, List } from 'lucide-react'

function tryParseJson(raw: string): Record<string, unknown> | null {
  try {
    const match = raw.trim().match(/\{[\s\S]*\}/)
    if (!match) return null
    return JSON.parse(match[0])
  } catch {
    return null
  }
}

interface ContentOutputDisplayProps {
  raw: string
}

export default function ContentOutputDisplay({ raw }: ContentOutputDisplayProps) {
  const data = tryParseJson(raw)

  if (!data) {
    return (
      <div className="prose prose-slate max-w-none">
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 text-sm text-slate-800 whitespace-pre-wrap">
          {raw}
        </div>
      </div>
    )
  }

  const title = data.title || data.seoTitle || data.productName

  return (
    <div className="space-y-5">
      {title ? (
        <div>
          <h3 className="text-2xl font-bold text-slate-900">{String(title)}</h3>
          {data.tagline ? (
            <p className="text-indigo-600 font-medium mt-1">{String(data.tagline)}</p>
          ) : null}
        </div>
      ) : null}

      {data.metaDescription ? (
        <div className="rounded-lg bg-blue-50 border border-blue-100 p-4">
          <p className="text-xs font-semibold text-blue-700 uppercase mb-1">Meta Description</p>
          <p className="text-sm text-blue-900">{String(data.metaDescription)}</p>
        </div>
      ) : null}

      {data.h1 ? <h4 className="text-xl font-semibold text-slate-800">{String(data.h1)}</h4> : null}

      {data.shortDescription ? (
        <p className="text-slate-700 leading-relaxed">{String(data.shortDescription)}</p>
      ) : null}

      {data.longDescription ? (
        <p className="text-slate-600 leading-relaxed">{String(data.longDescription)}</p>
      ) : null}

      {Array.isArray(data.bulletPoints) && data.bulletPoints.length > 0 && (
        <div className="rounded-xl border border-slate-200 p-5">
          <div className="flex items-center gap-2 mb-3">
            <List size={18} className="text-indigo-600" />
            <h4 className="font-semibold text-slate-900">Key Features</h4>
          </div>
          <ul className="space-y-2">
            {data.bulletPoints.map((item, i) => (
              <li key={i} className="flex gap-2 text-sm text-slate-700">
                <span className="text-indigo-500">✓</span>
                {String(item)}
              </li>
            ))}
          </ul>
        </div>
      )}

      {data.content ? (
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <div className="text-sm text-slate-800 whitespace-pre-wrap leading-relaxed">
            {String(data.content)}
          </div>
        </div>
      ) : null}

      {Array.isArray(data.posts) && data.posts.length > 0 && (
        <div className="space-y-4">
          {data.posts.map((post: Record<string, unknown>, i: number) => (
            <div key={i} className="rounded-xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-5">
              <p className="text-xs font-semibold text-indigo-600 mb-2">
                Post {String(post.number ?? i + 1)}
                {post.characterCount ? ` · ${post.characterCount} chars` : ''}
              </p>
              <p className="text-sm text-slate-800 whitespace-pre-wrap">{String(post.text ?? '')}</p>
              {Array.isArray(post.hashtags) && post.hashtags.length > 0 && (
                <p className="mt-3 text-xs text-indigo-600 font-medium">
                  {post.hashtags.map(String).join(' ')}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {Array.isArray(data.keywords) && data.keywords.length > 0 && (
        <div className="rounded-xl border border-violet-200 bg-violet-50 p-5">
          <div className="flex items-center gap-2 mb-3">
            <Hash size={18} className="text-violet-600" />
            <h4 className="font-semibold text-violet-900">Keywords</h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {data.keywords.map((kw, i) => (
              <span
                key={i}
                className="px-3 py-1 rounded-full bg-white border border-violet-200 text-sm text-violet-800"
              >
                {String(kw)}
              </span>
            ))}
          </div>
        </div>
      )}

      {Array.isArray(data.seoTips) && data.seoTips.length > 0 && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb size={18} className="text-emerald-600" />
            <h4 className="font-semibold text-emerald-900">SEO Tips</h4>
          </div>
          <ul className="space-y-2">
            {data.seoTips.map((tip, i) => (
              <li key={i} className="text-sm text-emerald-800 flex gap-2">
                <span>•</span>
                {String(tip)}
              </li>
            ))}
          </ul>
        </div>
      )}

      {typeof data.wordCount === 'number' && (
        <p className="text-xs text-slate-500">Approx. {data.wordCount} words</p>
      )}
    </div>
  )
}
