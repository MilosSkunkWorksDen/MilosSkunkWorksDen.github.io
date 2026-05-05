import type { Table } from '@/composables/useTables'

export type BaseCircle = {
  type: 'circle'
  x: number
  y: number
  width: number // radius is / 2
}

export type BaseRect = {
  type: 'rect'
  x: number
  y: number
  width: number
  height: number
}

export type RectTable = Table & BaseRect
export type CircleTable = Table & BaseCircle

export type CanvasTable = CircleTable | RectTable

export type ContextMenu = {
  visible: boolean
  x?: number
  y?: number
  table?: CanvasTable
}
