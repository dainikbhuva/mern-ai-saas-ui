import { Copy, Hash, Megaphone, Sparkles } from 'lucide-react'
import type { AdsOutput } from '../types/ads'

interface AdsOutputDisplayProps {
  output: AdsOutput
  onCopyAll?: () => void
}

export default function AdsOutputDisplay({ output, onCopyAll }: AdsOutputDisplayProps) {
  const globalKeywords = output.keywords ?? []

  return (
    <div className="space-y-6">
      {globalKeywords.length > 0 && (
        <div className="rounded-xl border border-violet-200 bg-violet-50 p-5">
          <div className="flex items-center gap-2 mb-3">
            <Hash size={18} className="text-violet-600" />
            <h4 className="font-semibold text-violet-900">Suggested Keywords</h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {globalKeywords.map((keyword) => (
              <span
                key={keyword}
                className="px-3 py-1 rounded-full bg-white border border-violet-200 text-sm text-violet-800 font-medium"
              >
                {keyword}
              </span>
            ))}
          </div>
        </div>
      )}

      {output.ads.map((ad) => (
        <div
          key={ad.variation}
          className="rounded-xl border border-slate-200 bg-slate-50 overflow-hidden"
        >
          <div className="flex items-center gap-2 px-5 py-3 bg-white border-b border-slate-200">
            <Megaphone size={18} className="text-indigo-600" />
            <h4 className="font-semibold text-slate-900">Ad Variation {ad.variation}</h4>
          </div>

          <div className="p-5 space-y-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                Headlines (max 30 chars)
              </p>
              <div className="space-y-2">
                {ad.headlines.map((headline, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between gap-3 px-4 py-2.5 rounded-lg bg-white border border-slate-200"
                  >
                    <span className="text-sm font-medium text-slate-900">{headline}</span>
                    <span className="text-xs text-slate-400 shrink-0">{headline.length}/30</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                Descriptions (max 90 chars)
              </p>
              <div className="space-y-2">
                {ad.descriptions.map((desc, i) => (
                  <div
                    key={i}
                    className="flex items-start justify-between gap-3 px-4 py-2.5 rounded-lg bg-white border border-slate-200"
                  >
                    <span className="text-sm text-slate-700">{desc}</span>
                    <span className="text-xs text-slate-400 shrink-0">{desc.length}/90</span>
                  </div>
                ))}
              </div>
            </div>

            {ad.keywords && ad.keywords.length > 0 && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                  Ad Keywords
                </p>
                <div className="flex flex-wrap gap-2">
                  {ad.keywords.map((kw) => (
                    <span
                      key={kw}
                      className="px-2.5 py-1 rounded-md bg-indigo-100 text-indigo-800 text-xs font-medium"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      ))}

      {output.marketingTips && output.marketingTips.length > 0 && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={18} className="text-emerald-600" />
            <h4 className="font-semibold text-emerald-900">Marketing Tips</h4>
          </div>
          <ul className="space-y-2">
            {output.marketingTips.map((tip, i) => (
              <li key={i} className="text-sm text-emerald-800 flex gap-2">
                <span className="text-emerald-500">•</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      )}

      {onCopyAll && (
        <button
          onClick={onCopyAll}
          className="w-full h-10 flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-lg font-medium transition"
        >
          <Copy size={16} />
          Copy All to Clipboard
        </button>
      )}
    </div>
  )
}
