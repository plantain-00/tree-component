export type TreeData<T = any> = {
    text?: string;
    value?: T;
    icon?: string | false;
    state: TreeNodeState;
    children: TreeData<T>[];
    // tslint:disable-next-line:ban-types
    contextmenu?: string | Function;
    // tslint:disable-next-line:ban-types
    component?: string | Function;
};

/**
 * @public
 */
export type TreeNodeState = {
    opened: boolean;
    selected: boolean;
    disabled: boolean;
    loading: boolean;
    highlighted: boolean;
    openable: boolean;
    dropPosition: DropPosition;
    dropAllowed: boolean;
};

export type EventData<T = any> = {
    data: TreeData<T>;
    path: number[];
};

export type ContextMenuData<T = any> = {
    data: TreeData<T>;
    path: number[];
    root: TreeData<T>[];
    parent?: any;
};

import { __extends, __decorate, __assign } from "tslib";
window.__extends = __extends;
window.__decorate = __decorate;
window.__assign = __assign;

export class DoubleClick {
    private clicked = false;
    private timer: null | NodeJS.Timer = null;

    constructor(private timeout = 300) { }

    onclick(singleClick: () => void) {
        if (!this.clicked) {
            this.clicked = true;
            singleClick();
            this.timer = setTimeout(() => {
                this.clicked = false;
            }, this.timeout);
        } else {
            this.clicked = false;
            if (this.timer) {
                clearTimeout(this.timer);
                this.timer = null;
            }
        }
    }
}

export function getContainerClassName(noDots: boolean | undefined) {
    const values = ["tree-container-ul", "tree-children"];
    if (noDots) {
        values.push("tree-no-dots");
    }
    return values.join(" ");
}

export function getNodeClassName<T>(data: TreeData<T>, last: boolean) {
    const values = ["tree-node"];
    if (data.state.openable || data.children.length > 0) {
        if (data.state.opened) {
            values.push("tree-open");
        } else {
            values.push("tree-closed");
        }
        if (data.state.loading) {
            values.push("tree-loading");
        }
    } else {
        values.push("tree-leaf");
    }
    if (last) {
        values.push("tree-last");
    }
    return values.join(" ");
}

export function getAnchorClassName<T>(data: TreeData<T>, hovered: boolean) {
    const values = ["tree-anchor", "tree-relative"];
    if (data.state.selected) {
        values.push("tree-clicked");
    }
    if (data.state.disabled) {
        values.push("tree-disabled");
    }
    if (data.state.highlighted) {
        values.push("tree-search");
    }
    if (hovered) {
        values.push("tree-hovered");
    }
    return values.join(" ");
}

export function getCheckboxClassName<T>(data: TreeData<T>) {
    const values = ["tree-icon", "tree-checkbox"];
    if (data.children
        && data.children.some(child => child.state.selected)
        && data.children.some(child => !child.state.selected)) {
        values.push("tree-undetermined");
    }
    return values.join(" ");
}

export function getRootClassName(checkbox: boolean | undefined, size: string | undefined, theme: string = "default") {
    const values = ["tree"];
    if (size) {
        values.push(`tree-${theme}-${size}`);
    } else {
        values.push(`tree-${theme}`);
    }
    if (checkbox) {
        values.push("tree-checkbox-selection", "tree-checkbox-no-clicked");
    }
    return values.join(" ");
}

export function getIconClassName(icon: string | false | undefined) {
    const values = ["tree-icon", "tree-themeicon"];
    if (icon) {
        values.push(icon, "tree-themeicon-custom");
    }
    return values.join(" ");
}

export function getMarkerClassName<T>(data: TreeData<T>) {
    const values = [`tree-marker-${data.state.dropPosition}`];
    if (data.state.dropAllowed) {
        values.push("allowed");
    } else {
        values.push("not-allowed");
    }
    return values.join(" ");
}

export const enum DropPosition {
    empty,
    up,
    inside,
    down,
}

export type DropData<T = any> = {
    sourceData: TreeData<T>;
    sourcePath: number[];
    targetData: TreeData<T>;
    targetPath: number[];
};

/**
 * @public
 */
export function getNodeFromPath<T>(rootData: TreeData<T>[], path: number[]) {
    let node: TreeData<T> | null = null;
    for (const index of path) {
        node = node ? node.children[index] : rootData[index];
    }
    return node;
}

function getDropPosition(pageY: number, offsetTop: number, offsetHeight: number) {
    const top = pageY - offsetTop;
    if (top < offsetHeight / 3) {
        return DropPosition.up;
    } else if (top > offsetHeight * 2 / 3) {
        return DropPosition.down;
    } else {
        return DropPosition.inside;
    }
}

function clearDropPositionOfTree<T>(tree: TreeData<T>) {
    if (tree.state.dropPosition) {
        tree.state.dropPosition = DropPosition.empty;
    }
    if (tree.children) {
        for (const child of tree.children) {
            clearDropPositionOfTree(child);
        }
    }
}

export function ondrag<T>(pageY: number, dragTarget: HTMLElement | null, dropTarget: HTMLElement | null, data: TreeData<T>[], dropAllowed?: (dropData: DropData<T>) => boolean, next?: () => void) {
    if (dropTarget) {
        const sourcePath = dragTarget!.dataset.path!.split(",").map(s => +s);
        const dropTargetPathString = dropTarget.dataset.path;
        if (dropTargetPathString) {
            const targetPath = dropTargetPathString.split(",").map(s => +s);
            const targetData = getNodeFromPath(data, targetPath)!;
            const sourceData = getNodeFromPath(data, sourcePath)!;
            const position = getDropPosition(pageY, dropTarget.offsetTop, dropTarget.offsetHeight);
            if (targetData.state.dropPosition !== position) {
                targetData.state.dropPosition = position;
                const dropData: DropData<T> = {
                    sourcePath,
                    targetPath,
                    sourceData,
                    targetData,
                };
                targetData.state.dropAllowed = dropAllowed ? dropAllowed(dropData) : true;
                if (next) {
                    next();
                }
            }
        }
    }
}

export function ondragleave<T>(target: HTMLElement, data: TreeData<T>[]) {
    const pathString = target.dataset.path;
    if (pathString) {
        const path = pathString.split(",").map(s => +s);
        const node = getNodeFromPath(data, path);
        if (node!.state.dropPosition !== DropPosition.empty) {
            node!.state.dropPosition = DropPosition.empty;
        }
    }
}

export function ondrop<T>(target: HTMLElement, dragTarget: HTMLElement | null, data: TreeData<T>[], next: (dropData: DropData<T>) => void) {
    const sourcePath = dragTarget!.dataset.path!.split(",").map(s => +s);
    const targetPathString = target.dataset.path;
    if (targetPathString) {
        const targetPath = targetPathString.split(",").map(s => +s);
        const targetData = getNodeFromPath(data, targetPath)!;
        const sourceData = getNodeFromPath(data, sourcePath)!;
        if (targetData.state.dropPosition !== DropPosition.empty) {
            const dropData: DropData<T> = {
                sourcePath,
                targetPath,
                sourceData,
                targetData,
            };
            next(dropData);
        }
    }
    for (const node of data) {
        clearDropPositionOfTree(node);
    }
}

export function clearMarkerOfTree<T>(tree: TreeData<T>) {
    if (tree.state.dropPosition !== DropPosition.empty) {
        tree.state.dropPosition = DropPosition.empty;
    }
    if (tree.children) {
        for (const child of tree.children) {
            clearMarkerOfTree(child);
        }
    }
}

export function getId(path: number[], preid?: string) {
    return preid ? preid + path.join("-") : undefined;
}
