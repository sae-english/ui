/**
 * Splits text by double-quote into narrative and quote segments for styling direct speech.
 * Odd-indexed segments (between "...") are quotes.
 */
export type QuoteSegment = { type: 'narrative'; text: string } | { type: 'quote'; text: string }

export function getQuoteSegments(text: string): QuoteSegment[] {
  if (!text || typeof text !== 'string') return []
  const parts = text.split('"')
  const out: QuoteSegment[] = []
  for (let i = 0; i < parts.length; i++) {
    const segmentText = parts[i]
    if (segmentText == null) continue
    if (segmentText.length === 0 && i > 0 && i < parts.length - 1) continue
    out.push({ type: i % 2 === 1 ? 'quote' : 'narrative', text: segmentText })
  }
  return out
}
