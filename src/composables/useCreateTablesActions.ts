import { onMounted, onUnmounted, ref, type Ref } from 'vue'

interface Props {
  stageRef: Ref
  viewConfig: Ref
  addRectTable: (c: { x: number; y: number }) => void
  addCircleTable: (c: { x: number; y: number }) => void
}

export function useCreateTablesActions({
  stageRef,
  viewConfig,
  addRectTable,
  addCircleTable,
}: Props) {
  const placementMode = ref<'rect' | 'circle' | null>(null) // 'rect' | 'circle' | null

  const onCreateRect = () => {
    placementMode.value = 'rect'
  }

  const onCreateCircle = () => {
    placementMode.value = 'circle'
  }

  const cancelPlacement = () => {
    placementMode.value = null
  }

  const onPlaceNewTable = (e) => {
    if (!placementMode.value) return

    const stage = stageRef.value.getStage()
    const pointer = stage.getPointerPosition()

    // convert screen to scene coords
    const x = (pointer.x - viewConfig.value.x) / viewConfig.value.scaleX
    const y = (pointer.y - viewConfig.value.y) / viewConfig.value.scaleY

    if (placementMode.value === 'rect') addRectTable({ x, y })
    if (placementMode.value === 'circle') addCircleTable({ x, y })

    cancelPlacement()
  }

  const onKeyDown = (e) => {
    if (e.code === 'Escape') cancelPlacement()
    // ... rest of your keydown
  }

  onMounted(() => {
    window.addEventListener('keydown', onKeyDown)
  })

  onUnmounted(() => {
    window.removeEventListener('keydown', onKeyDown)
  })

  return {
    placementMode,
    onCreateRect,
    onCreateCircle,
    cancelPlacement,
    onPlaceNewTable,
  }
}
