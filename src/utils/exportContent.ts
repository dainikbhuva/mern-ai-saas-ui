export function downloadFile(content: string, filename: string, mimeType = 'text/plain') {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export function exportAsTxt(content: string, name: string) {
  downloadFile(content, `${name}.txt`, 'text/plain;charset=utf-8')
}

export function exportAsMd(content: string, name: string) {
  downloadFile(content, `${name}.md`, 'text/markdown;charset=utf-8')
}

export function jsonToPlainText(raw: string): string {
  try {
    const jsonMatch = raw.trim().match(/\{[\s\S]*\}/)
    if (!jsonMatch) return raw
    const data = JSON.parse(jsonMatch[0])
    return formatParsedContent(data)
  } catch {
    return raw
  }
}

function formatParsedContent(data: Record<string, unknown>): string {
  const lines: string[] = []

  if (data.title) lines.push(`# ${data.title}`, '')
  if (data.seoTitle) lines.push(`# ${data.seoTitle}`, '')
  if (data.productName) lines.push(`# ${data.productName}`, '')
  if (data.tagline) lines.push(`*${data.tagline}*`, '')
  if (data.metaDescription) lines.push(`**Meta:** ${data.metaDescription}`, '')
  if (data.h1) lines.push(`## ${data.h1}`, '')
  if (data.shortDescription) lines.push(String(data.shortDescription), '')
  if (data.longDescription) lines.push(String(data.longDescription), '')

  if (Array.isArray(data.bulletPoints)) {
    lines.push('## Features', '')
    data.bulletPoints.forEach((b) => lines.push(`- ${b}`))
    lines.push('')
  }

  if (data.content) lines.push(String(data.content), '')

  if (Array.isArray(data.posts)) {
    lines.push('## Social Media Posts', '')
    data.posts.forEach((post: { number?: number; text?: string; hashtags?: string[] }) => {
      lines.push(`### Post ${post.number ?? ''}`, post.text ?? '')
      if (post.hashtags?.length) lines.push(post.hashtags.join(' '))
      lines.push('')
    })
  }

  if (Array.isArray(data.keywords)) {
    lines.push('## Keywords', data.keywords.join(', '), '')
  }

  if (Array.isArray(data.seoTips)) {
    lines.push('## SEO Tips', '')
    data.seoTips.forEach((t) => lines.push(`- ${t}`))
  }

  if (Array.isArray(data.ads)) {
    lines.push('## Ad Variations', '')
    data.ads.forEach((ad: { variation?: number; headlines?: string[]; descriptions?: string[] }) => {
      lines.push(`### Variation ${ad.variation}`, '')
      ad.headlines?.forEach((h) => lines.push(`- ${h}`))
      ad.descriptions?.forEach((d) => lines.push(`  ${d}`))
      lines.push('')
    })
  }

  return lines.join('\n').trim() || JSON.stringify(data, null, 2)
}

export function jsonToMarkdown(raw: string): string {
  const plain = jsonToPlainText(raw)
  return plain.startsWith('#') ? plain : `# AI Generated Content\n\n${plain}`
}
