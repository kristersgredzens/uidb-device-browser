import type { SyntheticEvent } from 'react'

export const PLACEHOLDER_IMAGE = '/placeholder.png'

export function getDeviceImageUrl(
  id: string,
  imageHash: string | undefined,
  size: number = 256,
): string {
  if (!imageHash) return PLACEHOLDER_IMAGE
  return `https://images.svc.ui.com/?u=https%3A%2F%2Fstatic.ui.com%2Ffingerprint%2Fui%2Fimages%2F${id}%2Fdefault%2F${imageHash}.png&w=${size}&q=75`
}

export function handleImageError(event: SyntheticEvent<HTMLImageElement>) {
  const img = event.currentTarget
  if (!img.dataset.fallbackAttempted) {
    img.dataset.fallbackAttempted = 'true'
    img.src = PLACEHOLDER_IMAGE
  }
}
