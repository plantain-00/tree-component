import { defineComponent, PropType } from 'vue'
import * as common from 'tree-component'
export * from 'tree-component'
import { nodeTemplateHtml, treeTemplateHtml } from './variables'

/**
 * @public
 */
export const Node = defineComponent({
  props: {
    data: {
      type: Object as PropType<common.TreeData<unknown>>,
      required: true,
    },
    last: {
      type: Boolean,
      required: true,
    },
    checkbox: Boolean,
    path: {
      type: Array as PropType<number[]>,
      required: true,
    },
    draggable: {
      type: Boolean,
      required: true,
    },
    root: Array as PropType<common.TreeData<unknown>[]>,
    zindex: Number,
    preid: {
      type: String,
      required: true,
    },
  },
  data: () => {
    return {
      contextmenuVisible: false,
      hovered: false,
      doubleClick: new common.DoubleClick(),
    }
  },
  computed: {
    contextmenuStyle(): { [key: string]: unknown } {
      return {
        'position': 'absolute',
        'left': '0px',
        'top': '0px',
        'z-index': typeof this.zindex === 'number' ? this.zindex : 1
      }
    },
    nodeClassName(): string {
      return common.getNodeClassName(this.data, this.last, !!this.$slots.default)
    },
    anchorClassName(): string {
      return common.getAnchorClassName(this.data, this.hovered, this.path)
    },
    checkboxClassName(): string {
      return common.getCheckboxClassName(this.data, this.path)
    },
    iconClassName(): string {
      return common.getIconClassName(this.data.icon)
    },
    oclClassName(): string {
      return common.getOclClassName(this.path)
    },
    pathString(): string {
      return this.path.toString()
    },
    hasMarker(): boolean {
      return this.draggable && this.data.state.dropPosition !== common.DropPosition.empty
    },
    markerClassName(): string {
      return common.getMarkerClassName(this.data)
    },
    eventData(): common.EventData<unknown> {
      return {
        data: this.data,
        path: this.path
      }
    },
    id(): string| undefined {
      return common.getId(this.path, this.preid)
    }
  },
  methods: {
    geChildPath(index: number) {
      return this.path.concat(index)
    },
    hover(hovered: boolean) {
      this.hovered = hovered
      if (!hovered) {
        this.contextmenuVisible = false
      }
    },
    ontoggle(eventData?: common.EventData<unknown>) {
      if (eventData) {
        this.$emit('toggle', eventData)
      } else {
        if (this.data.state.openable || this.data.children.length > 0 || this.$slots.default) {
          this.$emit('toggle', this.eventData)
        }
      }
    },
    onchange(eventData?: common.EventData<unknown>) {
      if (eventData) {
        this.$emit('change', eventData)
      } else {
        if (this.data.state.disabled) {
          return
        }

        this.doubleClick.onclick(() => {
          this.$emit('change', this.eventData)
        })
      }
    },
    oncontextmenu(e: MouseEvent) {
      this.contextmenuVisible = true
      this.contextmenuStyle.left = e.offsetX + 'px'
      this.contextmenuStyle.top = e.offsetY + 'px'
      e.preventDefault()
      return false
    },
    ondragstart(event: DragEvent) {
      this.$emit('dragstart', event)
    },
    ondragend(event: DragEvent) {
      this.$emit('dragend', event)
    },
    ondragover(event: DragEvent) {
      this.$emit('dragover', event)
    },
    ondragenter(event: DragEvent) {
      this.$emit('dragenter', event)
    },
    ondragleave(event: DragEvent) {
      this.$emit('dragleave', event)
    },
    ondrop(event: DragEvent) {
      this.$emit('drop', event)
    },
  },
  render: nodeTemplateHtml,
})

/**
 * @public
 */
export const Tree = defineComponent({
  render: treeTemplateHtml,
  props: {
    data: {
      type: Array as PropType<common.TreeData<unknown>[]>,
      required: true,
    },
    checkbox: Boolean,
    draggable: Boolean,
    nodots: Boolean,
    size: String,
    theme: String,
    dropAllowed: Function as PropType<(dropData: common.DropData<unknown>) => boolean>,
    zindex: Number,
    preid: String,
    dragTarget: Object as PropType<common.DragTargetData<unknown> | null>,
  },
  data: () => {
    return {
      localDragTarget: null as HTMLElement | null,
      dropTarget: null as HTMLElement | null,
    }
  },
  computed: {
    rootClassName(): string {
      return common.getRootClassName(this.checkbox, this.size, this.theme)
    },
    containerClassName(): string {
      return common.getContainerClassName(this.nodots)
    }
  },
  methods: {
    ontoggle(eventData: common.EventData<unknown>) {
      this.$emit('toggle', eventData)
    },
    onchange(eventData: common.EventData<unknown>) {
      this.$emit('change', eventData)
    },
    ondragstart(event: DragEvent) {
      if (!this.draggable) {
        return
      }
      this.localDragTarget = event.target as HTMLElement
      this.dropTarget = event.target as HTMLElement
      this.$emit('change-drag-target', {
        target: event.target as HTMLElement,
        root: this.data
      })
    },
    ondragend(event: DragEvent) {
      if (!this.draggable) {
        return
      }
      this.localDragTarget = null
      for (const tree of this.data) {
        common.clearMarkerOfTree(tree)
      }
      this.$emit('change-drag-target', null)
    },
    ondragover(event: DragEvent) {
      if (!this.canDrop(event)) {
        return
      }
      if (this.dragTarget) {
        common.ondrag(event.pageY, this.dragTarget.target, this.dropTarget, this.dragTarget.root, this.data, this.dropAllowed)
      } else {
        common.ondrag(event.pageY, this.localDragTarget, this.dropTarget, this.data, this.data, this.dropAllowed)
      }
      event.preventDefault()
    },
    ondragenter(event: DragEvent) {
      if (!this.canDrop(event)) {
        return
      }
      this.dropTarget = this.getAnchor(event.target as HTMLElement)
      if (this.dragTarget) {
        common.ondrag(event.pageY, this.dragTarget.target, this.dropTarget, this.dragTarget.root, this.data, this.dropAllowed)
      } else {
        common.ondrag(event.pageY, this.localDragTarget, this.dropTarget, this.data, this.data, this.dropAllowed)
      }
    },
    ondragleave(event: DragEvent) {
      if (!this.canDrop(event)) {
        return
      }
      const target = this.getAnchor(event.target as HTMLElement)
      const containsTarget = this.containsNode(this.dropTarget as HTMLElement, event.target as HTMLElement)
      if (!containsTarget && target === this.dropTarget) {
        this.dropTarget = null
      }
      common.ondragleave(target as HTMLElement, this.data)
    },
    ondrop(event: DragEvent) {
      if (!this.canDrop(event)) {
        return
      }
      if (this.dragTarget) {
        common.ondrop(this.getAnchor(event.target as HTMLElement), this.dragTarget.target, this.dragTarget.root, this.data, dropData => {
          this.$emit('drop', dropData)
        })
      } else {
        common.ondrop(this.getAnchor(event.target as HTMLElement), this.localDragTarget, this.data, this.data, dropData => {
          this.$emit('drop', dropData)
        })
      }
    },
    canDrop(event: DragEvent) {
      if (!this.draggable || !event.target) {
        return false
      }
      const hasPath = (event.target as HTMLElement).dataset && (event.target as HTMLElement).dataset.path
      if (!hasPath && (event.target as HTMLElement).classList && !(event.target as HTMLElement).classList.contains('tree-node')) {
        const target = this.getAnchor(event.target as HTMLElement)
        return target.dataset && target.dataset.path
      }
      return hasPath
    },
    containsNode(parentNode: HTMLElement, node: HTMLElement): boolean {
      for (let i = 0; i < parentNode.children.length; i++) {
        const child = parentNode.children[i] as HTMLElement
        if (child === node) {
          return true
        }
        if (child.children) {
          return this.containsNode(child, node)
        }
      }
      return false
    },
    getAnchor(target: HTMLElement) {
      let anchor = target
      while (anchor && anchor.classList && !anchor.classList.contains('tree-anchor')) {
        anchor = anchor.parentElement as HTMLElement
      }
      if (anchor && anchor.classList && anchor.classList.contains('tree-anchor')) {
        return anchor
      }
      return target
    }
  }
})
