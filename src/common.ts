export type TreeData = {
    text: string;
    value?: any;
    icon?: string | false;
    state: TreeNodeState;
    children?: TreeData[];
};

export type TreeNodeState = {
    opened: boolean;
    selected: boolean;
    disabled: boolean;
    loading: boolean;
    highlighted: boolean;
    dropPosition: DropPosition;
};

export type EventData = {
    data: TreeData;
    path: number[];
};

import { __extends, __decorate, __assign } from "tslib";
(window as any).__extends = __extends;
(window as any).__decorate = __decorate;
(window as any).__assign = __assign;

export class DoubleClick {
    clicked = false;
    timer: null | NodeJS.Timer = null;

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

export function getNodeClassName(data: TreeData, last: boolean) {
    const values = ["tree-node"];
    if (data.children && data.children.length > 0) {
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

export function getAnchorClassName(data: TreeData, hovered: boolean) {
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

export function getCheckboxClassName(data: TreeData) {
    const values = ["tree-icon", "tree-checkbox"];
    if (data.children
        && data.children.some(child => child.state.selected)
        && data.children.some(child => !child.state.selected)) {
        values.push("tree-undetermined");
    }
    return values.join(" ");
}

export function getRootClassName(checkbox: boolean | undefined) {
    return `tree tree-default ${checkbox ? "tree-checkbox-selection tree-checkbox-no-clicked" : ""}`;
}

export function getIconClassName(icon: string | false | undefined) {
    return `tree-icon tree-themeicon ${icon ? `${icon} tree-themeicon-custom` : ""}`;
}

export function getMarkerClassName(data: TreeData) {
    return `tree-marker-${data.state.dropPosition}`;
}

export const enum DropPosition {
    empty,
    up,
    inside,
    down,
};

export type DropData = {
    sourceData: TreeData;
    sourcePath: number[];
    targetData: TreeData;
    targetPath: number[];
};

export function getNodeFromPath(rootData: TreeData[], path: number[]) {
    let node: TreeData | null = null;
    for (const index of path) {
        if (node) {
            node = node.children![index];
        } else {
            node = rootData[index];
        }
    }
    return node;
}

export function getDropPosition(pageY: number, offsetTop: number, offsetHeight: number) {
    const top = pageY - offsetTop;
    if (top < offsetHeight / 3) {
        return DropPosition.up;
    } else if (top > offsetHeight * 2 / 3) {
        return DropPosition.down;
    } else {
        return DropPosition.inside;
    }
}

export function clearDropPositionOfTree(tree: TreeData) {
    if (tree.state.dropPosition) {
        tree.state.dropPosition = DropPosition.empty;
    }
    if (tree.children) {
        for (const child of tree.children) {
            clearDropPositionOfTree(child);
        }
    }
}

export function ondrag(pageY: number, dropTarget: HTMLElement | null, data: TreeData[], next?: () => void) {
    if (dropTarget) {
        const pathString = dropTarget.dataset["path"];
        if (pathString) {
            const path = pathString.split(",").map(s => +s);
            const node = getNodeFromPath(data, path);
            const position = getDropPosition(pageY, dropTarget.offsetTop, dropTarget.offsetHeight);
            if (node!.state.dropPosition !== position) {
                node!.state.dropPosition = position;
                if (next) {
                    next();
                }
            }
        }
    }
}

export function ondragleave(target: HTMLElement, data: TreeData[]) {
    const pathString = target.dataset["path"];
    if (pathString) {
        const path = pathString.split(",").map(s => +s);
        const node = getNodeFromPath(data, path);
        if (node!.state.dropPosition !== DropPosition.empty) {
            node!.state.dropPosition = DropPosition.empty;
        }
    }
}

export function ondrop(target: HTMLElement, dragTarget: HTMLElement | null, data: TreeData[], next: (dropData: DropData) => void) {
    const sourcePath = dragTarget!.dataset["path"].split(",").map(s => +s);
    const targetPathString = target.dataset["path"];
    if (targetPathString) {
        const targetPath = targetPathString.split(",").map(s => +s);
        const targetData = getNodeFromPath(data, targetPath) !;
        if (targetData.state.dropPosition !== DropPosition.empty) {
            const dropData: DropData = {
                sourcePath,
                targetPath,
                sourceData: getNodeFromPath(data, sourcePath) !,
                targetData,
            };
            next(dropData);
        }
    }
    for (const node of data) {
        clearDropPositionOfTree(node);
    }
}

export function clearMarkerOfTree(tree: TreeData) {
    if (tree.state.dropPosition !== DropPosition.empty) {
        tree.state.dropPosition = DropPosition.empty;
    }
    if (tree.children) {
        for (const child of tree.children) {
            clearMarkerOfTree(child);
        }
    }
}
