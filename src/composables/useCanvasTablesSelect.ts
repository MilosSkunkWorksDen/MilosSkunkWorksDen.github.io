import type { CanvasTable, ContextMenu } from '@/components/canvas/types'
import { ref, watch, type Ref } from 'vue'

export function useCanvasTablesSelect(stageRef: Ref) {
  const hoveredId = ref()
  const selectedId = ref()
  const contextMenu = ref<ContextMenu>({
    visible: false,
  })

  function handleHover(table?: CanvasTable) {
    hoveredId.value = table?.id || undefined
  }

  function handleSelect(table?: CanvasTable) {
    selectedId.value = table?.id || undefined
  }

  function openContextMenu(e: any, table: CanvasTable) {
    e.evt.preventDefault()

    const stage = e.target.getStage()
    const pos = stage.getPointerPosition()

    contextMenu.value = {
      visible: true,
      x: pos.x,
      y: pos.y,
      table,
    }
  }

  const checkIfTableClick = (e: any) => {
    const isTable = e.target.attrs?.elType == 'table'
    if (!isTable) {
      handleSelect()
    }
  }

  const tableEvents = (table: CanvasTable) => {
    return {
      click: () => handleSelect(table),
      mouseenter: () => handleHover(table),
      mouseleave: () => handleHover(),
      contextmenu: (e: any) => openContextMenu(e, table),
    }
  }

  return {
    handleHover,
    handleSelect,
    openContextMenu,
    hoveredId,
    selectedId,
    tableEvents,
    contextMenu,
    checkIfTableClick,
  }
}

interface ResizeProps {
  stageRef: Ref
  selectedId: Ref
  transformed: (table: CanvasTable) => void
}

export function useCanvasTablesResize({ stageRef, selectedId, transformed }: ResizeProps) {
  const transformerRef = ref()
  // watch(selectedId, (id) => {
  //   const transformer = transformerRef.value.getNode()

  //   if (!id) {
  //     transformer.nodes([])
  //     return
  //   }

  //   const stage = stageRef.value.getStage()
  //   const node = stage.findOne(`#table-${id}`)

  //   transformer.nodes([node])
  // })

  const onTransformEnd = (e: any, table: CanvasTable) => {
    const node = e.target
    const scaleX = node.scaleX()
    const scaleY = node.scaleY()

    if (table.type == 'rect') {
      transformed({
        ...table,
        x: table.x + node.x(),
        y: table.y + node.y(),
        width: table.width * scaleX,
        height: table.height * scaleY,
      })
    } else {
      transformed({
        ...table,
        x: table.x + node.x(),
        y: table.y + node.y(),
        width: table.width * scaleX,
      })
    }

    node.scaleX(1)
    node.scaleY(1)
    node.x(0)
    node.y(0)
  }

  const transformTable = (table: CanvasTable) => {
    const transformer = transformerRef.value.getNode()
    const stage = stageRef.value.getStage()
    const node = stage.findOne(`#table-${table.id}`)
    transformer.nodes([node])
  }

  const removeTransformer = () => {
    const transformer = transformerRef.value.getNode()
    transformer.nodes([])
  }

  return {
    transformerRef,
    onTransformEnd,
    transformTable,
    removeTransformer,
  }
}
