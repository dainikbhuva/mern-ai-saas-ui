import { Download, FileText } from 'lucide-react'
import { exportAsMd, exportAsTxt } from '../utils/exportContent'

interface ExportButtonsProps {
  plainContent: string
  markdownContent: string
  filename: string
}

export default function ExportButtons({ plainContent, markdownContent, filename }: ExportButtonsProps) {
  const safeName = filename.replace(/[^a-z0-9-_]/gi, '-').toLowerCase() || 'content'

  return (
    <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
      <button
        type="button"
        onClick={() => exportAsTxt(plainContent, safeName)}
        className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-sm font-medium transition"
      >
        <Download size={16} />
        Export .txt
      </button>
      <button
        type="button"
        onClick={() => exportAsMd(markdownContent, safeName)}
        className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition"
      >
        <FileText size={16} />
        Export .md
      </button>
    </div>
  )
}
