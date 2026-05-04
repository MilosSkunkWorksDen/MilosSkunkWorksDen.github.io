import ColorHash from 'color-hash'

const colorCache = new Map<string, string>()

// Create a ColorHash instance with optional saturation/lightness tweaks
const colorHash = new ColorHash({
  saturation: 0.65, // vivid colors
  lightness: 0.55, // medium brightness
})

const colorHashLight = new ColorHash({
  saturation: 0.35, // lower = pastel
  lightness: 0.75, // higher = softer/pastel
})

type UserColor = {
  color: string
  color_light: string
}
// ✅ Cached getter
export function getUserColor(id: any): UserColor {
  if (!colorCache.has(id)) {
    // Convert integer ID to string because color-hash works on strings
    const color = colorHash.hex(id.toString())
    colorCache.set(id, color)

    const colorLight = colorHashLight.hex(id.toString())
    colorCache.set(id + '.light', colorLight)
  }

  return {
    color: colorCache.get(id)!,
    color_light: colorCache.get(id + '.light')!,
  }
}
