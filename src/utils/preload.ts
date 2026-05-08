// Will use preload to load larger images for device detail page. The preload starts when item in list is hovered

const MAX_PRELOADED = 200
const preloaded = new Set<string>()

export function preloadImage(src: string) {
  if (preloaded.has(src)) return
  if (preloaded.size >= MAX_PRELOADED) return
  preloaded.add(src)
  const img = new Image()
  img.src = src
}
