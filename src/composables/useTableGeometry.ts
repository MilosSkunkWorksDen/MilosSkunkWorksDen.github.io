import type { CanvasTable } from '@/components/canvas/types'

type Coordinate = number
type Point = { x: Coordinate; y: Coordinate }
type Ring = Point & { radius: number }

function generateSeatingGrid(table: CanvasTable, ringOffset: number, labelHeight: number) {
  const ring = generateSitingRing(table, ringOffset)

  const seats = generateCircleDots(
    table.x,
    table.y,
    table.width / 2,
    table.people.length,
    labelHeight,
    ringOffset,
  )
    .map((r) => ({ ...r, angle: getAngle(table.x, table.y, r.x, r.y) }))
    .sort((a, b) => a.angle - b.angle)

  return { seats, ring }
}

function generateSitingRing(table: CanvasTable, offset: number): Ring {
  const cx = table.x
  const cy = table.y
  const r = table.width / 2

  return {
    x: cx,
    y: cy,
    radius: r + offset,
  }
}

function getAngle(cx: Coordinate, cy: Coordinate, x: Coordinate, y: Coordinate) {
  return Math.round(((Math.atan2(y - cy, x - cx) * 180) / Math.PI + 90 + 360) % 360)
}

function offsetUserCardCoordinates(
  seat: any,
  table: CanvasTable,
  cardWidth: number,
  cardHeight: number,
) {
  const deg = getAngle(table.x, table.y, seat.x, seat.y)

  let x = seat.x
  let y = seat.y
  let position = ''

  const topBottomOffset = 0

  if (seat.side === 'right') {
    y -= cardHeight / 2
    position = 'right'
  }
  //
  else {
    x -= cardWidth
    y -= cardHeight / 2
    position = 'left'
  }

  return { x, y, position, deg }

  //
  if (deg >= 0 && deg < 180) {
    y -= cardHeight / 2
    position = 'right'
  }

  //
  else if (deg >= 180 && deg <= 360) {
    x -= cardWidth
    y -= cardHeight / 2
    position = 'left'
  }

  //
  else if (deg === 0 || deg === 360) {
    x -= cardWidth / 2
    y -= cardHeight
    position = 'top'
  }

  //
  else if (deg === 180) {
    x -= cardWidth / 2
    position = 'bottom'
  }

  return { x, y, position, deg }
}

export default function useTableGeometry() {
  return {
    generateSeatingGrid,
    offsetUserCardCoordinates,
    generateCircleDots,
  }
}

/**
 * Generate circle dots with vertical spacing restriction
 *
 * @param {number} cx - circle center x
 * @param {number} cy - circle center y
 * @param {number} radius
 * @param {number} dotsCount
 * @param {number} minYDiff - minimum Y difference between neighbors
 *
 * @returns {Array<{x:number, y:number, angle:number}>}
 */
function generateCircleDots(
  cx: Coordinate,
  cy: Coordinate,
  radius: number,
  count: number,
  labelHeight = 25,
  labelOffset = 40,
) {
  // STEP 1
  const items = computeIdealPositions(cx, cy, radius, count, labelOffset)

  // STEP 2
  const { left, right } = splitSides(items)

  // STEP 3
  resolveSide(left, labelHeight)
  resolveSide(right, labelHeight)

  return [...left, ...right]
}

function computeIdealPositions(
  cx: Coordinate,
  cy: Coordinate,
  radius: number,
  count: number,
  offset: number,
) {
  const items = []

  for (let i = 0; i < count; i++) {
    const angle = -Math.PI / 2 + i * ((2 * Math.PI) / count)

    const cos = Math.cos(angle)
    const sin = Math.sin(angle)

    const anchorX = cx + radius * cos
    const anchorY = cy + radius * sin

    const labelX = cx + (radius + offset) * cos
    const labelY = cy + (radius + offset) * sin

    items.push({
      angle,
      anchorX,
      anchorY,
      idealX: labelX,
      idealY: labelY,
      side: Number(cos.toFixed(6)) >= 0 && Number(sin.toFixed(6)) != 1 ? 'right' : 'left',
    })
  }

  return items
}

function splitSides(items: any[]) {
  return {
    left: items.filter((i) => i.side === 'left'),
    right: items.filter((i) => i.side === 'right'),
  }
}

function resolveSide(items: any[], minGap: number) {
  if (!items?.length) {
    return []
  }

  // 1. sort by ideal position
  items.sort((a, b) => a.idealY - b.idealY)

  items.forEach((element) => {
    element.x = element.idealX
    element.y = element.idealY
  })

  const minY = Math.min(...items.map((i) => i.y))
  const maxY = Math.max(...items.map((i) => i.y))

  const requiredYSpace = (items.length - 1) * minGap
  const availableYSpace = maxY - minY
  const neededYSpace = requiredYSpace - availableYSpace
  const offsetY = neededYSpace > 0 ? neededYSpace / 2 : 0

  for (let i = 0; i < items.length; i++) {
    if (i === 0) {
      items[i].y = items[i].y - offsetY
    } else {
      items[i].y = Math.max(items[i].y - offsetY, items[i - 1].y + minGap)
    }
  }

  return items
}
