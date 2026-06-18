import type { AdsOutput } from '../types/ads'

export function parseAdsOutput(raw: string): { parsed: AdsOutput | null; raw: string } {
  const trimmed = raw.trim()

  const jsonMatch = trimmed.match(/\{[\s\S]*\}/)
  if (!jsonMatch) {
    return { parsed: null, raw }
  }

  try {
    const parsed = JSON.parse(jsonMatch[0]) as AdsOutput
    if (Array.isArray(parsed.ads) && parsed.ads.length > 0) {
      return { parsed, raw }
    }
  } catch {
    // fall through to raw display
  }

  return { parsed: null, raw }
}
