export type ContentType = 'blog' | 'social_media' | 'product_description' | 'seo'

export const CONTENT_TYPE_LABELS: Record<ContentType, string> = {
  blog: 'Blog Post',
  social_media: 'Social Media',
  product_description: 'Product Description',
  seo: 'SEO Content',
}

export const GENERATION_TYPE_LABELS: Record<string, string> = {
  ads: 'Google Ads',
  blog: 'Blog Post',
  social_media: 'Social Media',
  product_description: 'Product Description',
  seo: 'SEO Content',
}

export function getGenerationLabel(type: string): string {
  return GENERATION_TYPE_LABELS[type] || type.replace(/_/g, ' ')
}

export function getGenerationTopic(input?: Record<string, unknown>): string {
  if (!input) return 'Untitled'
  return String(input.topic || input.productName || input.productDescription || 'Untitled')
}
