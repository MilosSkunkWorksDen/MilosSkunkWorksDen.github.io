import { onMounted, ref } from 'vue'

// useKonvaIcon.ts
export function useKonvaIcon(svg: string, color = '#334155', size = 16) {
  const icon = ref<HTMLImageElement | null>(null)

  onMounted(async () => {
    const colored = svg.replace(/currentColor/g, color)
    const blob = new Blob([colored], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)
    const img = new Image(size, size)
    img.onload = () => {
      URL.revokeObjectURL(url)
      icon.value = img
    }
    img.src = url
  })

  return icon
}

export const USERS_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-users-icon lucide-users"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><path d="M16 3.128a4 4 0 0 1 0 7.744"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><circle cx="9" cy="7" r="4"/></svg>`
