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

import "tslib";

export class DoubleClick {
    clicked = false;
    timer: null | number = null;

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

export function getNodeClassName(data: TreeData, last: boolean) {
    const values = ["jstree-node"];
    if (data.children && data.children.length > 0) {
        if (data.state.opened) {
            values.push("jstree-open");
        } else {
            values.push("jstree-closed");
        }
        if (data.state.loading) {
            values.push("jstree-loading");
        }
    } else {
        values.push("jstree-leaf");
    }
    if (last) {
        values.push("jstree-last");
    }
    return values.join(" ");
}

export function getAnchorClassName(data: TreeData, hovered: boolean) {
    const values = ["jstree-anchor", "tree-relative"];
    if (data.state.selected) {
        values.push("jstree-clicked");
    }
    if (data.state.disabled) {
        values.push("jstree-disabled");
    }
    if (data.state.highlighted) {
        values.push("jstree-search");
    }
    if (hovered) {
        values.push("jstree-hovered");
    }
    return values.join(" ");
}

export function getCheckboxClassName(data: TreeData) {
    const values = ["jstree-icon", "jstree-checkbox"];
    if (data.children
        && data.children.some(child => child.state.selected)
        && data.children.some(child => !child.state.selected)) {
        values.push("jstree-undetermined");
    }
    return values.join(" ");
}

export function getRootClassName(checkbox: boolean | undefined) {
    return `jstree jstree-default jstree-default-dark ${checkbox ? "jstree-checkbox-selection jstree-checkbox-no-clicked" : ""}`;
}

export function getIconClassName(icon: string | false | undefined) {
    return `jstree-icon jstree-themeicon ${icon ? `${icon} jstree-themeicon-custom` : ""}`;
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
    return node!;
}

export function getDropPosition(pageY: number, offsetTop: number) {
    const top = pageY - offsetTop;
    if (top < 8) {
        return DropPosition.up;
    } else if (top > 16) {
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
