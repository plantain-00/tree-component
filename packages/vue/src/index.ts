import Vue from 'vue'
import Component from 'vue-class-component'
import * as common from 'tree-component'
export * from 'tree-component'
import { nodeTemplateHtml, nodeTemplateHtmlStatic, treeTemplateHtml, treeTemplateHtmlStatic } from './variables'

@Component({
  render: nodeTemplateHtml,
  staticRenderFns: nodeTemplateHtmlStatic,
  props: ['data', 'last', 'checkbox', 'path', 'draggable', 'root', 'zindex', 'preid']
})
export class Node<T> extends Vue {
  data!: common.TreeData<T>
  last!: boolean
  checkbox?: boolean
  path!: number[]
  draggable?: boolean
  root!: common.TreeData<T>[]
  zindex?: number
  preid?: string

  contextmenuVisible = false
  contextmenuStyle = {
    'position': 'absolute',
    'left': '0px',
    'top': '0px',
    'z-index': typeof this.zindex === 'number' ? this.zindex : 1
  }
  private hovered = false
  private doubleClick = new common.DoubleClick()

  get nodeClassName() {
    return common.getNodeClassName(this.data, this.last)
  }

  get anchorClassName() {
    return common.getAnchorClassName(this.data, this.hovered, this.path)
  }

  get checkboxClassName() {
    return common.getCheckboxClassName(this.data, this.path)
  }

  get iconClassName() {
    return common.getIconClassName(this.data.icon)
  }

  get oclClassName() {
    return common.getOclClassName(this.path)
  }

  get pathString() {
    return this.path.toString()
  }

  get hasMarker() {
    return this.draggable && this.data.state.dropPosition !== common.DropPosition.empty
  }

  get markerClassName() {
    return common.getMarkerClassName(this.data)
  }

  private get eventData(): common.EventData<T> {
    return {
      data: this.data,
      path: this.path
    }
  }
  get contextmenuData(): common.ContextMenuData<T> {
    return {
      data: this.data,
      path: this.path,
      root: this.root
    }
  }
  get id() {
    return common.getId(this.path, this.preid)
  }

  geChildPath(index: number) {
    return this.path.concat(index)
  }

  hover(hovered: boolean) {
    this.hovered = hovered
    if (!hovered) {
      this.contextmenuVisible = false
    }
  }
  ontoggle(eventData?: common.EventData<T>) {
    if (eventData) {
      this.$emit('toggle', eventData)
    } else {
      if (this.data.state.openable || this.data.children.length > 0) {
        this.$emit('toggle', this.eventData)
      }
    }
  }
  onchange(eventData?: common.EventData<T>) {
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
  }
  oncontextmenu(e: MouseEvent) {
    this.contextmenuVisible = true
    this.contextmenuStyle.left = e.offsetX + 'px'
    this.contextmenuStyle.top = e.offsetY + 'px'
    e.preventDefault()
    return false
  }
}

Vue.component('node', Node)

@Component({
  render: treeTemplateHtml,
  staticRenderFns: treeTemplateHtmlStatic,
  props: ['data', 'checkbox', 'draggable', 'nodots', 'size', 'theme', 'dropAllowed', 'zindex', 'preid']
})
export class Tree<T> extends Vue {
  data!: common.TreeData<T>[]
  checkbox?: boolean
  draggable?: boolean
  nodots?: boolean
  size?: string
  theme?: string
  dropAllowed?: (dropData: common.DropData<T>) => boolean
  zindex?: number
  preid?: string

  private dragTarget: HTMLElement | null = null
  private dropTarget: HTMLElement | null = null

  get rootClassName() {
    return common.getRootClassName(this.checkbox, this.size, this.theme)
  }
  get containerClassName() {
    return common.getContainerClassName(this.nodots)
  }

  ontoggle(eventData: common.EventData<T>) {
    this.$emit('toggle', eventData)
  }
  onchange(eventData: common.EventData<T>) {
    this.$emit('change', eventData)
  }
  ondragstart(event: DragEvent) {
    if (!this.draggable) {
      return
    }
    this.dragTarget = event.target as HTMLElement
    this.dropTarget = event.target as HTMLElement
  }
  ondragend(event: DragEvent) {
    if (!this.draggable) {
      return
    }
    this.dragTarget = null
    for (const tree of this.data) {
      common.clearMarkerOfTree(tree)
    }
  }
  ondragover(event: DragEvent) {
    if (!this.canDrop(event)) {
      return
    }
    common.ondrag(event.pageY, this.dragTarget, this.dropTarget, this.data, this.dropAllowed)
    event.preventDefault()
  }
  ondragenter(event: DragEvent) {
    if (!this.canDrop(event)) {
      return
    }
    this.dropTarget = this.getAnchor(event.target as HTMLElement)
    common.ondrag(event.pageY, this.dragTarget, this.dropTarget, this.data, this.dropAllowed)
  }
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
  }
  ondrop(event: DragEvent) {
    if (!this.canDrop(event)) {
      return
    }
    common.ondrop(this.getAnchor(event.target as HTMLElement), this.dragTarget, this.data, dropData => {
      this.$emit('drop', dropData)
    })
  }
  private canDrop(event: DragEvent) {
    if (!this.draggable || !event.target) {
      return false
    }
    const hasPath = (event.target as HTMLElement).dataset && (event.target as HTMLElement).dataset.path
    if (!hasPath && (event.target as HTMLElement).classList && !(event.target as HTMLElement).classList.contains('tree-node')) {
      const target = this.getAnchor(event.target as HTMLElement)
      return target.dataset && target.dataset.path
    }
    return hasPath
  }
  private containsNode(parentNode: HTMLElement, node: HTMLElement): boolean {
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
  }
  private getAnchor(target: HTMLElement) {
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

Vue.component('tree', Tree)
