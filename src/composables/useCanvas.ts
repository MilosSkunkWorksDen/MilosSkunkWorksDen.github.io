import jsPDF from 'jspdf'
import { onMounted, onUnmounted, ref, type Ref } from 'vue'

export function useSize(sizeRef: Ref) {
  const sizeConfig = ref({
    width: 300,
    height: 150,
  })

  const fit = () => {
    if (!sizeRef.value) return
    sizeConfig.value = {
      width: sizeRef.value.offsetWidth,
      height: sizeRef.value.offsetHeight,
    }
  }

  const ro = new ResizeObserver(fit)
  onMounted(() => {
    fit()
    ro.observe(sizeRef.value)
  })

  onUnmounted(() => ro.disconnect())

  return {
    sizeRef,
    sizeConfig,
  }
}

export function useView(stageRef: Ref) {
  const viewConfig = ref({
    x: 0,
    y: 0,
    scaleX: 1,
    scaleY: 1,
  })

  /**
   |
   | Scrolling/zooming canvas
   |
   */
  const ZOOM_FACTOR = 1.08
  const MIN_SCALE = 0.2
  const MAX_SCALE = 10

  const onWheel = (e) => {
    const evt = e.evt // konva wraps native event
    evt.preventDefault()

    if (!evt.ctrlKey && !evt.metaKey) {
      viewConfig.value = {
        ...viewConfig.value,
        x: viewConfig.value.x - (evt.shiftKey ? evt.deltaY : evt.deltaX),
        y: viewConfig.value.y - (evt.shiftKey ? 0 : evt.deltaY),
      }
      return
    }

    // ctrl+scroll — zoom toward cursor
    const stage = stageRef.value.getStage()
    const pointer = stage.getPointerPosition()
    const oldScale = viewConfig.value.scaleX
    const direction = evt.deltaY < 0 ? 1 : -1
    const newScale = Math.min(
      MAX_SCALE,
      Math.max(MIN_SCALE, oldScale * (direction > 0 ? ZOOM_FACTOR : 1 / ZOOM_FACTOR)),
    )

    // where the cursor is in scene coords before zoom
    const mousePointTo = {
      x: (pointer.x - viewConfig.value.x) / oldScale,
      y: (pointer.y - viewConfig.value.y) / oldScale,
    }

    viewConfig.value = {
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
      scaleX: newScale,
      scaleY: newScale,
    }
  }

  const resetView = () => {
    viewConfig.value = {
      ...viewConfig.value,
      x: 0,
      y: 0,
      scaleX: 1,
      scaleY: 1,
    }
  }

  /**
   |
   | Dragging canvas
   |
   */
  const isPanning = ref(false)
  const lastPos = ref({ x: 0, y: 0 })
  const isSpaceHeld = ref(false)

  const onMouseMove = (e) => {
    if (!isPanning.value) return
    const dx = e.evt.clientX - lastPos.value.x
    const dy = e.evt.clientY - lastPos.value.y
    lastPos.value = { x: e.evt.clientX, y: e.evt.clientY }
    viewConfig.value = {
      ...viewConfig.value,
      x: viewConfig.value.x + dx,
      y: viewConfig.value.y + dy,
    }
  }

  const onMouseDown = (e) => {
    const isMiddle = e.evt.button === 1
    const isSpaceDrag = e.evt.button === 0 && isSpaceHeld.value
    if (!isMiddle && !isSpaceDrag) return
    e.evt.preventDefault()
    isPanning.value = true
    lastPos.value = { x: e.evt.clientX, y: e.evt.clientY }
    document.body.style.cursor = 'grabbing'
  }

  const onMouseUp = (e) => {
    if (e.evt.button !== 1 && e.evt.button !== 0) return
    isPanning.value = false
    document.body.style.cursor = isSpaceHeld.value ? 'grab' : 'default'
  }

  const onKeyDown = (e) => {
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return

    if (e.code === 'Space' && !isSpaceHeld.value) {
      e.preventDefault()
      isSpaceHeld.value = true
      document.body.style.cursor = 'grab'
    }
  }

  const onKeyUp = (e) => {
    if (e.code === 'Space') {
      isSpaceHeld.value = false
      isPanning.value = false
      document.body.style.cursor = 'default'
    }
  }

  onMounted(() => {
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
  })

  onUnmounted(() => {
    window.removeEventListener('keydown', onKeyDown)
    window.removeEventListener('keyup', onKeyUp)
  })

  function fitView() {
    const stage = stageRef.value.getStage()
    fitStage(stage)

    viewConfig.value = {
      scaleX: stage.scaleX(),
      scaleY: stage.scaleY(),
      x: stage.x(),
      y: stage.y(),
    }
  }

  return {
    viewConfig,
    onWheel,
    resetView,
    isPanning,
    onMouseDown,
    onMouseUp,
    onMouseMove,
    fitView,
  }
}

export function fitStage(stage: any, padding: number = 20) {
  const container = stage.container()
  const containerWidth = container.offsetWidth
  const containerHeight = container.offsetHeight

  // Get the bounding box of all content
  const layer = stage.findOne('Layer')
  const contentRect = layer.getClientRect({ relativeTo: stage })

  // Calculate scale to fit content + padding
  const scaleX = (containerWidth - padding * 2) / contentRect.width
  const scaleY = (containerHeight - padding * 2) / contentRect.height
  const scale = Math.min(scaleX, scaleY) // uniform scale

  // Center the content
  const newX = (containerWidth - contentRect.width * scale) / 2 - contentRect.x * scale
  const newY = (containerHeight - contentRect.height * scale) / 2 - contentRect.y * scale

  stage.scale({ x: scale, y: scale })
  stage.position({ x: newX, y: newY })
  stage.batchDraw()

  return stage
}

export function exportStageToPDF(stage: any, padding: number = 20) {
  const prevScale = { x: stage.scaleX(), y: stage.scaleY() }
  const prevPos = { x: stage.x(), y: stage.y() }
  const prevWidth = stage.width()
  const prevHeight = stage.height()

  stage.scale({ x: 1, y: 1 })
  stage.position({ x: 0, y: 0 })

  const layer = stage.findOne('Layer')
  const contentRect = layer.getClientRect()

  stage.position({ x: -contentRect.x + padding, y: -contentRect.y + padding })
  stage.width(contentRect.width + padding * 2)
  stage.height(contentRect.height + padding * 2)
  stage.batchDraw()

  const dataURL = stage.toDataURL({ pixelRatio: 1 })

  stage.scale(prevScale)
  stage.position(prevPos)
  stage.width(prevWidth)
  stage.height(prevHeight)
  stage.batchDraw()

  const pdf = new jsPDF({
    orientation: contentRect.width > contentRect.height ? 'landscape' : 'portrait',
    unit: 'px',
    format: [contentRect.width + padding * 2, contentRect.height + padding * 2],
  })
  pdf.addImage(
    dataURL,
    'PNG',
    0,
    0,
    contentRect.width + padding * 2,
    contentRect.height + padding * 2,
  )
  pdf.save('export.pdf')
}
