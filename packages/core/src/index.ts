/**
 * @public
 */
export interface TreeData<T = any> {
  text?: string;
  value?: T;
  icon?: string | false;
  state: TreeNodeState;
  children: TreeData<T>[];
  contextmenu?: string | Function;
  component?: string | Function;
}

/**
 * @public
 */
export interface TreeNodeState {
  opened: boolean;
  selected: boolean;
  disabled: boolean;
  loading: boolean;
  highlighted: boolean;
  openable: boolean;
  dropPosition: DropPosition;
  dropAllowed: boolean;
}

/**
 * @public
 */
export interface EventData<T = any> {
  data: TreeData<T>;
  path: number[];
}

/**
 * @public
 */
export interface ContextMenuData<T = any> {
  data: TreeData<T>;
  path: number[];
  root: TreeData<T>[];
  parent?: any;
}

/**
 * @public
 */
export type DragTargetData<T = any> = {
  root: TreeData<T>[];
  target: HTMLElement;
} | null

import { __extends, __decorate, __assign } from 'tslib'
(window as any).__extends = __extends;
(window as any).__decorate = __decorate;
(window as any).__assign = __assign

/**
 * @public
 */
export class DoubleClick {
  private clicked = false
  private timer: null | NodeJS.Timer = null

  constructor(private timeout = 300) { }

  public onclick(singleClick: () => void) {
    if (!this.clicked) {
      this.clicked = true
      singleClick()
      this.timer = setTimeout(() => {
        this.clicked = false
      }, this.timeout)
    } else {
      this.clicked = false
      if (this.timer) {
        clearTimeout(this.timer)
        this.timer = null
      }
    }
  }
}

/**
 * @public
 */
export function getContainerClassName(noDots: boolean | undefined = undefined) {
  const values = ['tree-container-ul', 'tree-children']
  if (noDots) {
    values.push('tree-no-dots')
  }
  return values.join(' ')
}

/**
 * @public
 */
export function getNodeClassName<T>(data: TreeData<T>, last: boolean, hasChildren = false) {
  const values = ['tree-node']
  if (data.state.openable || data.children.length > 0 || hasChildren) {
    if (data.state.opened) {
      values.push('tree-open')
    } else {
      values.push('tree-closed')
    }
    if (data.state.loading) {
      values.push('tree-loading')
    }
  } else {
    values.push('tree-leaf')
  }
  if (last) {
    values.push('tree-last')
  }
  return values.join(' ')
}

/**
 * @public
 */
export function getAnchorClassName<T>(data: TreeData<T>, hovered: boolean, path: number[]) {
  const values = ['tree-anchor', 'tree-relative', `tree-anchor-${path.join('-')}`]
  if (data.state.selected) {
    values.push('tree-clicked')
  }
  if (data.state.disabled) {
    values.push('tree-disabled')
  }
  if (data.state.highlighted) {
    values.push('tree-search')
  }
  if (hovered) {
    values.push('tree-hovered')
  }
  return values.join(' ')
}

/**
 * @public
 */
export function getCheckboxClassName<T>(data: TreeData<T>, path: number[]) {
  const values = ['tree-icon', 'tree-checkbox', `tree-checkbox-${path.join('-')}`]
  if (data.children
    && data.children.some(child => child.state.selected)
    && data.children.some(child => !child.state.selected)) {
    values.push('tree-undetermined')
  }
  return values.join(' ')
}

/**
 * @public
 */
export function getRootClassName(checkbox: boolean | undefined = undefined, size: string | undefined, theme = 'default') {
  const values = ['tree']
  if (size) {
    values.push(`tree-${theme}-${size}`)
  } else {
    values.push(`tree-${theme}`)
  }
  if (checkbox) {
    values.push('tree-checkbox-selection', 'tree-checkbox-no-clicked')
  }
  return values.join(' ')
}

/**
 * @public
 */
export function getIconClassName(icon: string | false | undefined) {
  const values = ['tree-icon', 'tree-themeicon']
  if (icon) {
    values.push('tree-themeicon-custom', icon)
  }
  return values.join(' ')
}

/**
 * @public
 */
export function getOclClassName(path: number[]) {
  return ['tree-icon', 'tree-ocl', `tree-ocl-${path.join('-')}`].join(' ')
}

/**
 * @public
 */
export function getMarkerClassName<T>(data: TreeData<T>) {
  const values = [`tree-marker-${data.state.dropPosition}`]
  if (data.state.dropAllowed) {
    values.push('allowed')
  } else {
    values.push('not-allowed')
  }
  return values.join(' ')
}

/**
 * @public
 */
export const enum DropPosition {
  empty,
  up,
  inside,
  down
}

/**
 * @public
 */
export interface DropData<T = any> {
  sourceData: TreeData<T>;
  sourcePath: number[];
  sourceRoot: TreeData<T>[];
  targetData: TreeData<T>;
  targetPath: number[];
}

/**
 * @public
 */
export function getNodeFromPath<T>(rootData: TreeData<T>[], path: number[]) {
  let node: TreeData<T> | undefined
  for (const index of path) {
    node = node ? node.children[index] : rootData[index]
    if (!node) {
      return null
    }
  }
  return node
}

function getGlobalOffset(dropTarget: HTMLElement) {
  let offset = 0
  let currentElem = dropTarget
  while (currentElem) {
    offset += (currentElem.offsetTop - currentElem.scrollTop)
    currentElem = currentElem.offsetParent as HTMLElement
  }
  return offset
}

function getDropPosition(pageY: number, offsetTop: number, offsetHeight: number) {
  const top = pageY - offsetTop
  if (top < offsetHeight / 3) {
    return DropPosition.up
  } else if (top > offsetHeight * 2 / 3) {
    return DropPosition.down
  } else {
    return DropPosition.inside
  }
}

function clearDropPositionOfTree<T>(tree: TreeData<T>) {
  if (tree.state.dropPosition) {
    tree.state.dropPosition = DropPosition.empty
  }
  if (tree.children) {
    for (const child of tree.children) {
      clearDropPositionOfTree(child)
    }
  }
}

/**
 * @public
 */
export function ondrag<T>(pageY: number, dragTarget: HTMLElement | null | undefined, dropTarget: HTMLElement | null, dragTargetRoot: TreeData<T>[], dropTargetRoot: TreeData<T>[], dropAllowed?: (dropData: DropData<T>) => boolean, next?: () => void) {
  while (dragTarget && !dragTarget.classList.contains('tree-anchor')) {
    dragTarget = dragTarget.parentElement
  }
  if (dropTarget && dragTarget) {
    const sourcePath = dragTarget.dataset.path!.split(',').map(s => +s)
    const dropTargetPathString = dropTarget.dataset.path
    if (dropTargetPathString) {
      const targetPath = dropTargetPathString.split(',').map(s => +s)
      const targetData = getNodeFromPath(dropTargetRoot, targetPath)
      const sourceData = getNodeFromPath(dragTargetRoot, sourcePath)
      if (!targetData || !sourceData) {
        return
      }
      const offsetTop = getGlobalOffset(dropTarget)
      const position = getDropPosition(pageY, offsetTop, dropTarget.offsetHeight)
      if (targetData.state.dropPosition !== position) {
        targetData.state.dropPosition = position
        const dropData: DropData<T> = {
          sourcePath,
          targetPath,
          sourceData,
          targetData,
          sourceRoot: dragTargetRoot
        }
        targetData.state.dropAllowed = dropAllowed ? dropAllowed(dropData) : true
        if (next) {
          next()
        }
      }
    }
  }
}

/**
 * @public
 */
export function ondragleave<T>(target: HTMLElement, data: TreeData<T>[]) {
  const pathString = target.dataset.path
  if (pathString) {
    const path = pathString.split(',').map(s => +s)
    const node = getNodeFromPath(data, path)
    if (node && node.state.dropPosition !== DropPosition.empty) {
      node!.state.dropPosition = DropPosition.empty
    }
  }
}

/**
 * @public
 */
export function ondrop<T>(target: HTMLElement, dragTarget: HTMLElement | null | undefined, dragTargetRoot: TreeData<T>[], dropTargetRoot: TreeData<T>[], next: (dropData: DropData<T>) => void) {
  while (dragTarget && !dragTarget.classList.contains('tree-anchor')) {
    dragTarget = dragTarget.parentElement
  }
  if (dragTarget) {
    const sourcePath = dragTarget.dataset.path!.split(',').map(s => +s)
    const targetPathString = target.dataset.path
    if (targetPathString) {
      const targetPath = targetPathString.split(',').map(s => +s)
      const targetData = getNodeFromPath(dropTargetRoot, targetPath)
      const sourceData = getNodeFromPath(dragTargetRoot, sourcePath)
      if (!targetData || !sourceData) {
        return
      }
      if (targetData.state.dropPosition !== DropPosition.empty) {
        const dropData: DropData<T> = {
          sourcePath,
          targetPath,
          sourceData,
          targetData,
          sourceRoot: dragTargetRoot
        }
        next(dropData)
      }
    }
  }
  for (const node of dropTargetRoot) {
    clearDropPositionOfTree(node)
  }
}

/**
 * @public
 */
export function clearMarkerOfTree<T>(tree: TreeData<T>) {
  if (tree.state.dropPosition !== DropPosition.empty) {
    tree.state.dropPosition = DropPosition.empty
  }
  if (tree.children) {
    for (const child of tree.children) {
      clearMarkerOfTree(child)
    }
  }
}

/**
 * @public
 */
export function getId(path: number[], preid?: string) {
  return preid ? preid + path.join('-') : undefined
}
