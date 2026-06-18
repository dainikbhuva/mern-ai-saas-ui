export interface AdVariation {
  variation: number
  headlines: string[]
  descriptions: string[]
  keywords?: string[]
}

export interface AdsOutput {
  ads: AdVariation[]
  keywords?: string[]
  marketingTips?: string[]
}
